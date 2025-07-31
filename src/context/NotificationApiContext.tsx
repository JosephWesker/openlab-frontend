import { createContext, useContext, useMemo, useCallback, useRef, useEffect, useState, type ReactNode } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "@/hooks/useApi"
import { API_PATH, KIND_EMOJI, RANDOM_KINDS, type NotificationKind } from "@/lib/constants"
import { Snackbar, Fade, Box, Typography, Avatar, useTheme } from "@mui/material"
import { motion } from "motion/react"
import { useSlugNavigation } from "@/hooks/useSlugNav"
import { useNavigate } from "react-router"
import { useAuthContext } from "@/hooks/useAuthContext"
import { InitiativeTabs } from "@/interfaces/general-enum"
import type { Initiative } from "@/interfaces/initiative"

// Respuesta de la API
export interface ApiNotification {
  id: number
  message: string | null
  seen: boolean
  date: string | null // ISO string
  type: NotificationKind | null
  title: string | null
  initiative: {
    id: number
    title: string
    creatorName: string
  }
}

interface NotificationsPage {
  content: ApiNotification[]
  last?: boolean
  totalElements: number
  totalPages?: number
}

export interface NotificationData {
  id: string
  kind: NotificationKind
  title: string
  message: string
  createdAt: string
  read: boolean
}

interface NotificationContextValue {
  notifications: NotificationData[]
  totalCount: number
  unreadCount: number
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  refetchNotifications: () => void
  // Preferencias de notificaciones
  notificationPreferences: Record<NotificationKind, boolean>
  loadNotificationPreferences: () => Promise<void>
  updateNotificationPreference: (kind: NotificationKind, enabled: boolean) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return ctx
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthResolved } = useAuthContext()

  const fetchApi = useApi()
  const theme = useTheme()
  const [toast, setToast] = useState<{
    title: string
    message: string
    kind: NotificationKind
  } | null>(null)
  const prevTotalRef = useRef(0)
  const firstLoadRef = useRef(true)
  const queryClient = useQueryClient()
  const { goToInitiative } = useSlugNavigation()
  const navigate = useNavigate()

  // 🔄 1) ref para llevar los timers por tipo
  const preferenceTimers = useRef<Record<NotificationKind, NodeJS.Timeout | undefined>>({
    isNotificationUpdate: undefined,
    isNotificationRoadmap: undefined,
    isNotificationMessage: undefined,
    isNotificationColaborator: undefined,
    INPROCESS: undefined,
    APROVED: undefined,
    isNotificationCofunder: undefined,
  })

  // Estado para las preferencias de notificaciones
  const [notificationPreferences, setNotificationPreferences] = useState<Record<NotificationKind, boolean>>({
    isNotificationUpdate: false,
    isNotificationRoadmap: false,
    isNotificationMessage: false,
    isNotificationColaborator: false,
    INPROCESS: false,
    APROVED: false,
    isNotificationCofunder: false,
  })
  // Obtener con scroll infinito
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<NotificationsPage>({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchApi({
        path: `${API_PATH.INITIATIVE_NOTIFICATION}?page=${pageParam}`,
      })
      // Si la petición falla (p.e. 401) devolvemos estructura vacía para evitar errores
      if (!res) {
        return { content: [], last: true, totalElements: 0 } as NotificationsPage
      }
      return res as NotificationsPage
    },
    getNextPageParam: (lastPage, pages) => {
      if (typeof lastPage.last === "boolean") {
        return lastPage.last ? undefined : pages.length
      }
      if (typeof lastPage.totalPages === "number") {
        return pages.length < lastPage.totalPages ? pages.length : undefined
      }
      return undefined
    },
    initialPageParam: 0,
  })

  // Detectar nuevas notificaciones usando totalElements (solo en refetch)
  useEffect(() => {
    if (!isAuthResolved) return
    if (!data) return

    const currentTotal = data.pages[0]?.totalElements ?? 0

    if (firstLoadRef.current) {
      firstLoadRef.current = false
      prevTotalRef.current = currentTotal
      return
    }

    const prev = prevTotalRef.current
    const diff = currentTotal - prev

    const snackbarDisabled = localStorage.getItem("notifications_snackbar_disabled") === "true"
    if (diff > 0 && !snackbarDisabled) {
      setToast({
        title: diff === 1 ? "Nueva notificación" : "Nuevas notificaciones",
        message: diff === 1 ? "1 notificación nueva" : `${diff} notificaciones nuevas`,
        kind: RANDOM_KINDS[Math.floor(Math.random() * RANDOM_KINDS.length)],
      })
    }

    prevTotalRef.current = currentTotal
  }, [isAuthResolved, data])

  const notifications: NotificationData[] = useMemo(() => {
    const seenIds = new Set<string>()
    const items: NotificationData[] = []
    data?.pages.forEach((p) => {
      p.content.forEach((n) => {
        const idStr = String(n.id)
        if (seenIds.has(idStr)) return // dedup
        seenIds.add(idStr)
        items.push({
          id: idStr,
          kind: n.type ?? "isNotificationUpdate",
          title: n.title ?? "Actualizacion Iniciativa",
          message: n.message ?? "¡Actualización en Foodster! El líder ha publicado novedades.",
          createdAt: n.date ?? "Hace unos momentos",
          read: n.seen,
        })
      })
    })
    return items
  }, [data])

  const totalCount = data?.pages[0]?.totalElements ?? notifications.length
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  // PATCH /message/:id marcar como leido
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const responseNotification = (await fetchApi({
        path: `${API_PATH.INITIATIVE_NOTIFICATION}/${id}`,
        init: { method: "PATCH" },
      })) as ApiNotification

      if (!responseNotification) return

      const NOTIFICATION_REDIRECT = {
        INPROCESS: () => navigate(`/list?tab=my-initiatives&subtab=inprocess`), //
        APROVED: () => navigate(`/list?tab=my-initiatives&subtab=approved`),
        isNotificationCofunder: () =>
          goToInitiative(responseNotification.initiative), //
        // isNotificationColaborator: () => navigate(`/list?tab=postulations&subtab=general-skills`),
        isNotificationColaborator: () => handleUpdateInitiative(responseNotification.initiative.id),
        isNotificationMessage: () =>
          goToInitiative(
            responseNotification.initiative,
            InitiativeTabs.COMMENTS,
          ),
        isNotificationUpdate: () =>
          goToInitiative(
            responseNotification.initiative,
            InitiativeTabs.UPDATES,
          ),
        isNotificationRoadmap: () =>
          goToInitiative(
            responseNotification.initiative,
            InitiativeTabs.ROADMAP,
          ),
      } satisfies Record<NotificationKind, () => void>

      NOTIFICATION_REDIRECT[responseNotification.type ?? "isNotificationCofunder"]()
    },
    onSuccess: (_, id) => {
      // Optimista: marcar como leído en cache
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old
        const newPages = old.pages.map((p: NotificationsPage) => ({
          ...p,
          content: p.content.map((n) => (n.id === Number(id) ? { ...n, seen: true } : n)),
        }))
        return { ...old, pages: newPages }
      })
    },
  })

  const handleUpdateInitiative = useCallback(async (id: number) => {
    try {
      const response = (await fetchApi({
        path: `${API_PATH.INITIATIVE}/${id}`,
      })) as Initiative

      if (response) {
        navigate("/update#collaborators-profile", {
          state: { initiative: response, targetStep: 3 },
        })
      }
    } catch {
      /* empty */
    }
  }, [])

  const markAsRead = useCallback((id: string) => markAsReadMutation.mutate(id), [markAsReadMutation])

  // DELETE /message/:id
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetchApi({
        path: `${API_PATH.INITIATIVE_NOTIFICATION}/${id}`,
        init: { method: "DELETE" },
      })
    },
    onSuccess: (_, id) => {
      // Optimista: remover del cache y ajustar contador
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old
        const newPages = old.pages.map((p: NotificationsPage, idx: number) => {
          const newContent = p.content.filter((n) => n.id !== Number(id))
          // Ajustar totalElements solo en la primera página si existe
          if (idx === 0 && typeof p.totalElements === "number") {
            return {
              ...p,
              content: newContent,
              totalElements: Math.max(0, p.totalElements - 1),
            } as NotificationsPage
          }
          return { ...p, content: newContent } as NotificationsPage
        })
        return { ...old, pages: newPages }
      })
      // Forzar refetch para mantener consistencia con el backend
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        refetchType: "none",
      })
    },
  })

  const removeNotification = useCallback((id: string) => deleteMutation.mutate(id), [deleteMutation])

  const refetchNotifications = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["notifications"],
      refetchType: "all",
    })
  }, [queryClient])

  // Función para cargar las preferencias de notificaciones
  const loadNotificationPreferences = useCallback(async () => {
    try {
      const response = await fetchApi({
        path: API_PATH.USER_NOTIFICATION,
        init: {
          method: "GET",
        },
      })
      if (response) {
        setNotificationPreferences(response)
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error)
    }
  }, [])

  // Función para actualizar una preferencia específica
  const updateNotificationPreference = useCallback((kind: NotificationKind, enabled: boolean) => {
    // ① Actualiza el estado temporal para el UI (NO limpiar aquí)

    setNotificationPreferences((prev) => ({ ...prev, [kind]: enabled }))

    // ② Si ya había un timer para este tipo, lo cancelo
    if (preferenceTimers.current[kind]) {
      clearTimeout(preferenceTimers.current[kind])
    }

    // ③ Programo el optimista y el PATCH (500 ms después de la última pulsación)
    preferenceTimers.current[kind] = setTimeout(async () => {
      // Cambio optimista real
      // setNotificationPreferences((prev) => ({ ...prev, [kind]: enabled }))
      try {
        await fetchApi({
          path: API_PATH.USER_NOTIFICATION,
          init: {
            method: "PATCH",
            body: JSON.stringify({ [kind]: enabled }),
          },
        })
        // Refresca con la respuesta para garantizar consistencia
        // if (response) setNotificationPreferences(response)
      } catch (err) {
        console.error("Error updating notification preference:", err)
        // Revierto el optimista si el servidor falla
        setNotificationPreferences((prev) => ({ ...prev, [kind]: !enabled }))
      } finally {
        delete preferenceTimers.current[kind]
      }
    }, 1000)
  }, [])

  // Cargar preferencias al montar el componente
  useEffect(() => {
    if (!isAuthResolved) return
    loadNotificationPreferences()
  }, [isAuthResolved])

  const value: NotificationContextValue = useMemo(
    () => ({
      notifications,
      totalCount,
      unreadCount,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      markAsRead,
      removeNotification,
      refetchNotifications,
      notificationPreferences,
      loadNotificationPreferences,
      updateNotificationPreference,
    }),
    [
      notifications,
      totalCount,
      unreadCount,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      markAsRead,
      removeNotification,
      refetchNotifications,
      notificationPreferences,
      loadNotificationPreferences,
      updateNotificationPreference,
    ],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        slots={{
          transition: Fade,
        }}
        sx={{ top: { xs: 70, sm: 80 } }}
      >
        {toast ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              padding: "8px 16px",
              paddingRight: "20px",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "transparent", color: "#fff", width: 32, height: 32, fontSize: 20 }}>
                {KIND_EMOJI[toast.kind]}
              </Avatar>
              <Box ml={1}>
                <Typography variant="subtitle2" fontWeight={600} color="#fff">
                  {toast.title}
                </Typography>
                <Typography variant="body2" color="#fff" sx={{ whiteSpace: "pre-line" }}>
                  {toast.message}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ) : (
          <Box />
        )}
      </Snackbar>
    </NotificationContext.Provider>
  )
}
