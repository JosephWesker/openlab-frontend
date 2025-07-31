import { useState, useEffect, useRef, useCallback } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import Popover from "@mui/material/Popover"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Avatar from "@mui/material/Avatar"
import Divider from "@mui/material/Divider"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Switch from "@mui/material/Switch"
import CircularProgress from "@mui/material/CircularProgress"
import { useTheme } from "@mui/material/styles"
import NotificationsActive from "@mui/icons-material/NotificationsActive"
import Settings from "@mui/icons-material/Settings"
import MoreHoriz from "@mui/icons-material/MoreHoriz"
import { motion, AnimatePresence } from "motion/react"
import { useNotifications } from "@/context/NotificationApiContext"
import { NOTIFICATION_KINDS, KIND_EMOJI, type NotificationKind } from "@/lib/constants"

export const NotificationCenter = () => {
  const {
    notifications,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    removeNotification,
    notificationPreferences,
    updateNotificationPreference,
  } = useNotifications()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState<{
    id: string
    kind: NotificationKind
  } | null>(null)

  const isOpen = Boolean(anchorEl)

  // --- Scroll infinito ---
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  // Ref al contenedor scrollable (Paper del Popover)
  const [paperEl, setPaperEl] = useState<HTMLDivElement | null>(null)
  const setPaperRef = useCallback((node: HTMLDivElement | null) => {
    setPaperEl(node)
  }, [])
  // Refs adicionales para el IntersectionObserver y el control de estado
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isFetchingRef = useRef(false)

  // Mantener isFetchingRef actualizado con isFetchingNextPage
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage
  }, [isFetchingNextPage])

  useEffect(() => {
    // Si el popover está cerrado, el usuario está en preferencias o ya no hay más páginas, no creamos el observer
    if (!isOpen || showSettings || !hasNextPage) return

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingRef.current && !isFetchingNextPage) {
        isFetchingRef.current = true
        fetchNextPage()
        // Reiniciar la bandera después de un pequeño delay
        setTimeout(() => {
          isFetchingRef.current = false
        }, 100)
      }
    }

    // Limpiar observer previo
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: paperEl,
      rootMargin: "0px 0px 0px 0px",
      threshold: 0.1,
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [hasNextPage, isOpen, showSettings, fetchNextPage, paperEl, isFetchingNextPage])

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    if (showSettings) {
      // Si estamos en preferencias, cerrar directamente sin mostrar la lista
      setAnchorEl(null)
      // Resetear showSettings después de que el popover se cierre
      setTimeout(() => {
        setShowSettings(false)
      }, 150) // Delay para evitar el parpadeo
    } else {
      // Comportamiento normal cuando no estamos en preferencias
      setAnchorEl(null)
      setShowSettings(false)
    }
  }

  // menu for 3 dots
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string, kind: NotificationKind) => {
    event.stopPropagation()
    setSelectedNotif({ id, kind })
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleRemove = () => {
    if (selectedNotif) removeNotification(selectedNotif.id)
    handleMenuClose()
  }

  const handleSwitchChange = (_e: React.ChangeEvent<HTMLInputElement>, kind: string) => {
    // el nuevo valor viene en e.target.checked
    updateNotificationPreference(kind as NotificationKind, _e.target.checked)
  }

  const handleSwitchChangeByNotification = () => {
    if (selectedNotif && !BLOCKED_KINDS.includes(selectedNotif.kind)) {
      const { kind } = selectedNotif
      const enabled = isKindEnabled(kind)

      updateNotificationPreference(kind as NotificationKind, !enabled)
      handleMenuClose()
    }
  }

  const popoverId = isOpen ? "notification-popover" : undefined
  const theme = useTheme()
  const isKindEnabled = (kind: NotificationKind | undefined): boolean =>
    !!kind && notificationPreferences[kind as NotificationKind]

  // Tipos de notificación que no deben ser configurables por el usuario
  const BLOCKED_KINDS: NotificationKind[] = ["INPROCESS", "APROVED", "isNotificationCofunder"]

  const handleNotificationClick = (id: string) => () => {
    markAsRead(id)
    handleClose()
  }

  return (
    <Paper
      elevation={2}
      sx={{ display: "flex", alignItems: "center", gap: 1, mx: { xs: 0, md: 1 }, borderRadius: 9999 }}
    >
      <IconButton color="primary" onClick={handleOpen} sx={{ position: "relative" }}>
        <Badge badgeContent={totalCount} sx={{ "& .MuiBadge-badge": { bgcolor: "primary.main", color: "#fff" } }}>
          <NotificationsActive sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>
      <Popover
        disableScrollLock
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            ref: setPaperRef,
            sx: {
              mt: 1,
              width: 360,
              maxHeight: 500,
              overflowY: "auto",
              borderRadius: 2,
              p: 1,
              // Personalización del scrollbar
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "primary.main",
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
              // Para Firefox
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.primary.main} transparent`,
            },
          },
        }}
      >
        {/* Header */}
        <Box px={1.5} py={1} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} color="primary.main">
            Notificaciones Recientes
          </Typography>
          <IconButton size="small" onClick={() => setShowSettings((prev) => !prev)}>
            <Settings fontSize="small" color="primary" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {showSettings ? (
          // PREFERENCIAS
          <Box px={2}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Preferencias de Notificación
            </Typography>
            {Object.entries(NOTIFICATION_KINDS).map(([kind, label]) => {
              const isEnabled = isKindEnabled(kind as NotificationKind)

              return (
                <Box key={kind} display="flex" alignItems="center" justifyContent="space-between" py={1}>
                  <Typography variant="body2">{label}</Typography>
                  <Switch checked={isEnabled} size="small" onChange={(e) => handleSwitchChange(e, kind)} />
                </Box>
              )
            })}
          </Box>
        ) : notifications.length === 0 ? (
          <Box py={6} display="flex" flexDirection="column" alignItems="center" color="text.secondary">
            <Avatar sx={{ mb: 1, bgcolor: "action.hover", width: 48, height: 48 }}>
              <NotificationsActive color="disabled" />
            </Avatar>
            <Typography variant="body2">No hay notificaciones</Typography>
          </Box>
        ) : (
          <List disablePadding>
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                >
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: !n.read ? "action.hover" : "inherit",
                      borderRadius: 2,
                      my: 0.5,
                      cursor: "pointer",
                    }}
                    onClick={handleNotificationClick(n.id)}
                  >
                    {/* Encabezado con tipo y menú */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={0.5}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {n.title}
                      </Typography>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, n.id, n.kind)}>
                        <MoreHoriz fontSize="small" />
                      </IconButton>
                    </Box>
                    {/* Cuerpo principal */}
                    <Box display="flex" alignItems="flex-start" gap={1} width="100%">
                      <Typography variant="body2" fontWeight={600}>
                        {KIND_EMOJI[n.kind]}
                      </Typography>
                      <Typography variant="body2" className="line-clamp-2">
                        {n.message}
                      </Typography>
                    </Box>
                    {/* Tiempo */}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {n.createdAt}
                    </Typography>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>

            {hasNextPage && (
              <Box ref={loadMoreRef} py={1} display="flex" justifyContent="center">
                {isFetchingNextPage && <CircularProgress size={24} />}
              </Box>
            )}
          </List>
        )}
      </Popover>
      {/* Options menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleRemove}>Borrar esta notificación</MenuItem>
        {/* Mostrar la opción de activar/desactivar sólo si el tipo es configurable */}
        {selectedNotif && !BLOCKED_KINDS.includes(selectedNotif.kind) && (
          <MenuItem onClick={handleSwitchChangeByNotification}>
            {isKindEnabled(selectedNotif.kind)
              ? "Desactivar este tipo de notificación"
              : "Activar este tipo de notificación"}
          </MenuItem>
        )}
      </Menu>
    </Paper>
  )
}
