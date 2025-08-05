import React, { useState, useCallback } from "react"
import {
  Button,
  alpha,
  useTheme,
  Stack,
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material"
import {
  NavigateBefore,
  NavigateNext,
  Save,
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
  InfoOutlined,
  Close,
  GitHub,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "motion/react"
import { useInitiativeForm } from "@/context/InitiativeFormContext"
import { useSnackbar } from "@/context/SnackbarContext"
import { useFormContext, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { clearInitiativeStorage, useInitiativeStore } from "@/stores/initiativeStore"
import { useStepLogic } from "@/hooks/useStepLogic"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
import { useApi } from "@/hooks/useApi"
import { API_PATH } from "@/lib/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { useShallow } from "zustand/react/shallow"
import { useAuthContext } from "@/hooks/useAuthContext"
import type { UserEntity } from "@/interfaces/user"
import { useSkillsStore } from "@/stores/skillsStore"
import { FormTextField } from "@/components/initiative/steps/shared/FormTextField"
import { contentEvents, engagementEvents } from "@/lib/clarityEvents"

interface NavigationButtonsProps {
  stepNumber: number
  stepTitle?: string
}

type PostulationType = {
  role: string
  gSkills: string
  hardSkills: string[]
  description?: string
  active?: boolean
}

type ApiInitiativePayload = Omit<
  Partial<InitiativeFormData>,
  "objectives" | "roadmapPhases" | "updates" | "externalLinks" | "socialNetworks" | "needs"
> & {
  id?: number
  objectives?: string[]
  externalLinks?: {
    otros?: {
      nombre: string
      url: string
      img: string
    }[]
  }
  roadmap?: Array<{
    phaseNumber: string
    phaseName: string
    description: string
    status: string
  }>
  update?: Array<{
    name: string
    description: string
  }>
  needs?: Array<PostulationType>
  announcements?: Array<PostulationType>
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ stepNumber }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { goToNextStep, goToPreviousStep, canGoToPreviousStep, goToStep, isEditMode, initiativeData } =
    useInitiativeForm()
  const { showSnackbar } = useSnackbar()
  const {
    trigger,
    clearErrors,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<InitiativeFormData>()
  const { resetForm, initiativeDraftId, forceReset, setInitiativeDraftId } = useInitiativeStore(
    useShallow((state) => ({
      resetForm: state.resetForm,
      initiativeDraftId: state.initiativeDraftId,
      forceReset: state.forceReset,
      setInitiativeDraftId: state.setInitiativeDraftId,
    })),
  )
  const isStep3Optional = isEditMode
  const { getRequiredStepsProgress } = useStepLogic({ isStep3Optional })
  const fetchApi = useApi()
  const queryClient = useQueryClient()
  const { userFromApi, setUserFromApi } = useAuthContext()
  const skillsGeneral = useSkillsStore((state) => state.skills.general)

  // Responsive breakpoint
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Estados para el modal épico unificado
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [missingProfileFields, setMissingProfileFields] = useState<string[]>([])
  // const [, setErrorMessage] = useState<string>("") // Nuevo estado para capturar errores específicos
  // Estado para controlar el contenido del modal principal
  const [modalState, setModalState] = useState<
    "confirm" | "loading" | "success" | "error" | "profileSuggestion" | "githubRequired" | "titleRequired"
  >("confirm")
  const [isUpdatingGithub, setIsUpdatingGithub] = useState(false)
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false) // Nuevo estado para actualización de título

  // Formulario local para el input de GitHub en el modal
  const githubSchema = z.object({
    github: z
      .string()
      .trim()
      .min(1, "El enlace de GitHub es requerido")
      .url("Debe ser una URL válida")
      .refine((val) => val.startsWith("https://github.com/"), "La URL debe ser de github.com"),
  })

  const {
    register: registerGithub,
    handleSubmit: handleSubmitGithub,
    watch: watchGithub,
    formState: { errors: githubErrors },
    setValue: setGithubValue,
  } = useForm<{ github: string }>({
    resolver: zodResolver(githubSchema),
    defaultValues: { github: userFromApi?.social?.github || "" },
  })

  // Formulario local para el input de título en el modal
  const titleSchema = z.object({
    title: z
      .string()
      .trim()
      .min(1, "El título es requerido")
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(100, "El título no debe exceder los 100 caracteres"),
  })

  const {
    register: registerTitle,
    handleSubmit: handleSubmitTitle,
    watch: watchTitle,
    formState: { errors: titleErrors },
    setValue: setTitleValue,
  } = useForm<{ title: string }>({
    resolver: zodResolver(titleSchema),
    defaultValues: { title: getValues("title") || "" },
  })

  const canPrev = canGoToPreviousStep()

  const isFormCompletelyValid = (): boolean => {
    const requiredProgress = getRequiredStepsProgress()
    const allRequiredComplete = requiredProgress.completed === requiredProgress.total

    // Verificar que no hay errores en ningún paso (incluyendo opcionales)
    const hasAnyErrors = !!(
      errors.coFounderEmails ||
      errors.socialNetworks ||
      errors.externalLinks ||
      errors.updates ||
      errors.roadmapPhases ||
      Object.keys(errors).length > 0
    )

    const isCompletelyValid = allRequiredComplete && !hasAnyErrors

    return isCompletelyValid
  }

  // Mutación para actualizar la iniciativa (PUT)
  const updateMutation = useMutation({
    mutationFn: async (updatedData: ApiInitiativePayload) => {
      if (!initiativeData?.id) {
        throw new Error("ID de iniciativa no encontrado para la actualización.")
      }

      await fetchApi({
        path: `${API_PATH.INITIATIVE}`,
        init: {
          method: "PUT",
          body: JSON.stringify(updatedData),
        },
      })

      engagementEvents.updatePublished({
        initiativeId: initiativeData.id.toString(),
        title: initiativeData.title,
      })

      // tambien se debe enviar el correo de los cofundadores a la API de invitaciones
      const promisedCoFounderEmails =
        updatedData.coFounderEmails?.map((email) =>
          fetchApi({
            path: API_PATH.INVITATION_COFOUNDER_EMAIL,
            init: { method: "POST", body: JSON.stringify({ initiativeId: initiativeData.id, email }) },
          }),
        ) || []

      const promisedPostulationCofounder =
        updatedData.announcements
          ?.filter(
            (postulation) =>
              postulation.gSkills && postulation.hardSkills.length > 0 && postulation.active === undefined,
          )
          .map((postulation) =>
            fetchApi({
              path: API_PATH.INITIATIVE_CREATE_NOTICE,
              init: {
                method: "POST",
                body: JSON.stringify({
                  initiativeId: initiativeData.id,
                  description: postulation.description,
                  gSkills: postulation.gSkills,
                  hardSkills: postulation.hardSkills,
                }),
              },
            }),
          ) || []

      await Promise.all([...promisedCoFounderEmails, ...promisedPostulationCofounder])

      if (initiativeData.state === "draft") {
        await fetchApi({
          path: `${API_PATH.INITIATIVE_DRAFT_TO_PUBLISHED}/${initiativeData.id}`,
          init: {
            method: "POST",
          },
        })

        contentEvents.initiativeProposed({
          initiativeId: initiativeData.id.toString(),
          title: initiativeData.title,
        })
      }
    },
    onSuccess: () => {
      setModalState("success")
      // Si el borrador publicado coincide con el draft guardado en persistencia, limpia el storage para evitar estados inconsistentes
      const localData = localStorage.getItem("initiative-storage")
      const localDataParsed = JSON.parse(localData || "{}")

      const initiativeDraftIdFromApiLocalStorage = localDataParsed?.state?.initiativeDraftId

      if (initiativeDraftIdFromApiLocalStorage && initiativeDraftIdFromApiLocalStorage === initiativeData?.id) {
        // localStorage.removeItem("initiative-storage")
        // resetForm()
        forceReset()
      }
      setInitiativeDraftId(null)
      queryClient.invalidateQueries({ queryKey: ["initiatives"] }) // Invalida todas las listas
      queryClient.invalidateQueries({ queryKey: ["initiative", initiativeData?.id] }) // Invalida el detalle
    },
    onError: () => {
      setModalState("error")
    },
  })

  // Función para verificar si el perfil del usuario está completo
  const checkProfileCompleteness = (user: UserEntity | null): { isComplete: boolean; missingFields: string[] } => {
    if (!user) return { isComplete: false, missingFields: ["Datos de usuario no encontrados"] }

    const missing: string[] = []

    if (!user.description) {
      missing.push("Una descripción personal o biografía.")
    }
    if (!user.image) {
      missing.push("Una foto de perfil.")
    }
    if (!user.roles) {
      missing.push("Tu rol principal en el ecosistema (Ej: Lider, Colaborador, etc).")
    }
    if (!user.skills || user.skills.general.length === 0) {
      missing.push("Al menos una habilidad general.")
    }
    if (!user.skills || user.skills.technical.length === 0) {
      missing.push("Al menos una habilidad técnica.")
    }

    const socialLinks = user.social ? Object.values(user.social).filter(Boolean).length : 0
    if (!socialLinks) {
      missing.push("Más redes sociales o enlaces profesionales (LinkedIn, Facebook, etc).")
    }

    return {
      isComplete: missing.length === 0,
      missingFields: missing,
    }
  }

  // 🔥 FUNCIÓN ÉPICA: Detecta errores y navega automáticamente al primer error
  const findAndNavigateToFirstError = async (): Promise<boolean> => {
    // PRIMERO: Activar TODOS los errores del formulario para tener estado actualizado
    await trigger()

    const formData = getValues()
    const currentErrors = errors

    // Definir todos los campos requeridos por paso
    const stepFieldsMap: Record<number, Array<{ field: string; name: string }>> = {
      1: [
        { field: "title", name: "Título" },
        { field: "motto", name: "Lema" },
        { field: "mainImage", name: "Imagen principal" },
      ],
      2: [
        { field: "tags", name: "Tags" },
        { field: "detailedDescription", name: "Descripción detallada" },
        { field: "problemSolved", name: "Problema que resuelve" },
        { field: "objectives", name: "Objetivos" },
        { field: "marketInfo", name: "Información del mercado" },
        { field: "productCharacteristics", name: "Características del producto" },
      ],
      3: isStep3Optional
        ? []
        : [
            // { field: "coFounderEmails", name: "Emails de cofundadores" },
            { field: "seekingProfiles", name: "Perfiles buscados" },
          ],
    }

    // Verificar errores paso por paso (SOLO pasos requeridos según schema sagrado: 1, 2, 3)
    for (const step of [1, 2, 3]) {
      const stepFields = stepFieldsMap[step]

      for (const { field, name } of stepFields) {
        const value = formData[field as keyof InitiativeFormData]
        let isEmpty = false

        // Verificaciones específicas por tipo de campo
        if (Array.isArray(value)) {
          isEmpty = value.length === 0
        } else if (typeof value === "string") {
          isEmpty = !value || value.trim() === ""
        } else {
          isEmpty = !value
        }

        if (isEmpty) {
          showSnackbar({
            title: `Campo requerido en Paso ${step}`,
            message: `${name} es obligatorio. Navegando automáticamente...`,
            severity: "error",
          })

          // 🚀 NAVEGACIÓN AUTOMÁTICA AL ERROR
          setTimeout(() => {
            goToStep(step)
          }, 1000)

          return false
        }
      }

      // Trigger validación del paso actual
      const stepFieldNames = stepFields.map(({ field }) => field)
      const isStepValid = await trigger(stepFieldNames as (keyof InitiativeFormData)[])

      if (!isStepValid) {
        showSnackbar({
          title: `Errores en Paso ${step}`,
          message: `Hay errores de validación. Navegando automáticamente...`,
          severity: "error",
        })

        setTimeout(() => {
          goToStep(step)
        }, 1000)

        return false
      }
    }

    // 🔧 VERIFICAR ERRORES EN PASOS OPCIONALES (3, 4 y 5)
    for (const step of [3, 4, 5]) {
      let hasOptionalErrors = false

      if (step === 3) {
        if (currentErrors.coFounderEmails) {
          hasOptionalErrors = true
        }
      } else if (step === 4) {
        // Verificar errores reales en socialNetworks y externalLinks
        if (currentErrors.socialNetworks || currentErrors.externalLinks) {
          hasOptionalErrors = true
        }
      } else if (step === 5) {
        // Verificar errores reales en updates y roadmapPhases
        if (currentErrors.updates || currentErrors.roadmapPhases) {
          hasOptionalErrors = true
        }
      }

      if (hasOptionalErrors) {
        const errorMessage =
          step === 3
            ? "Hay errores en los emails de cofundadores. Por favor corrígelos o déjalos vacíos."
            : step === 4
              ? "Hay URLs inválidas en las redes sociales o enlaces externos. Por favor corrígelas o déjalas vacías."
              : "Hay errores en las actualizaciones o roadmap. Por favor corrígelos o déjalos vacíos."

        showSnackbar({
          title: `Errores en Paso ${step}`,
          message: `${errorMessage} Navegando automáticamente...`,
          severity: "error",
        })

        setTimeout(() => {
          goToStep(step)
        }, 1000)

        return false
      }
    }

    if (stepNumber === 6) {
      if (isFormCompletelyValid()) {
        // --- NUEVA LÓGICA DE VERIFICACIÓN DE PERFIL ---
        const profileCheck = checkProfileCompleteness(userFromApi)
        const hasGithubLink = !!(userFromApi?.social?.github && userFromApi.social.github.includes("github.com"))

        if (!hasGithubLink) {
          setModalState("githubRequired")
          setShowConfirmModal(true)
          return true
        }
        if (profileCheck.isComplete) {
          // Si el perfil está completo, ir directo a la confirmación
          setModalState("confirm")
        } else {
          // Si no, mostrar la sugerencia primero
          setMissingProfileFields(profileCheck.missingFields)
          setModalState("profileSuggestion")
        }
        setShowConfirmModal(true)
      } else {
        // 🔥 ACTIVAR TODOS LOS ERRORES Y NAVEGAR AL PRIMER ERROR
        await trigger() // Activa TODOS los errores del formulario
        await findAndNavigateToFirstError()
      }
    }

    return true
  }

  const handleContinue = async () => {
    // Para pasos 1-5: Navegación normal
    if (stepNumber < 6) {
      // Excepción para el paso 3 en modo edición: es opcional
      if (stepNumber === 3 && isEditMode) {
        goToNextStep()
        return
      }

      const getStepFields = (step: number): string[] => {
        switch (step) {
          case 1:
            return ["title", "motto", "mainImage"]
          case 2:
            return [
              "tags",
              "detailedDescription",
              "problemSolved",
              "objectives",
              "marketInfo",
              "productCharacteristics",
            ]
          case 3:
            return isStep3Optional ? [] : ["seekingProfiles"]
          case 4:
            return [] // Paso 4 es completamente opcional según schema sagrado
          case 5:
            return [] // Paso 5 es completamente opcional según schema sagrado
          default:
            return []
        }
      }

      const currentStepFields = getStepFields(stepNumber)

      // Limpiar errores y validar solo si hay campos requeridos
      if (currentStepFields.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearErrors(currentStepFields as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isStepValid = await trigger(currentStepFields as any)

        if (!isStepValid) {
          showSnackbar({
            title: "Campos requeridos",
            message: `Por favor, completa correctamente todos los campos del paso ${stepNumber}`,
            severity: "error",
          })
          return
        }
      } else if (stepNumber === 3 || stepNumber === 4 || stepNumber === 5) {
        // PARA PASOS OPCIONALES: FORZAR VALIDACIÓN COMPLETA
        let fieldsToValidate: string[] = []

        if (stepNumber === 3) {
          fieldsToValidate = ["coFounderEmails"]
        } else if (stepNumber === 4) {
          // Forzar validación de todos los campos del paso 4
          fieldsToValidate = [
            "socialNetworks.linkedin",
            "socialNetworks.facebook",
            "socialNetworks.instagram",
            "socialNetworks.website",
            "socialNetworks.twitter",
            "externalLinks.discord",
            "externalLinks.github",
            "externalLinks.dework",
            "externalLinks.aragon",
            // "externalLinks.figma",
          ]
        } else if (stepNumber === 5) {
          // Para el paso 5, verificar solo si hay datos reales que validar
          const currentData = getValues()
          const updates = currentData.updates || []
          const roadmapPhases = currentData.roadmapPhases || []

          // Solo validar si hay elementos en los arrays
          if (updates.length > 0) {
            fieldsToValidate.push("updates")
          }
          if (roadmapPhases.length > 0) {
            fieldsToValidate.push("roadmapPhases")
          }
        }

        // Solo validar si hay campos que validar
        if (fieldsToValidate.length > 0) {
          // FORZAR VALIDACIÓN de estos campos específicos
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isStepValid = await trigger(fieldsToValidate as any)

          if (!isStepValid) {
            const errorMessage =
              stepNumber === 3
                ? "Por favor, verifica que todos los emails ingresados sean válidos o déjalos vacíos"
                : stepNumber === 4
                  ? "Por favor, verifica que todas las URLs ingresadas sean válidas o déjalas vacías"
                  : "Por favor, completa correctamente la información ingresada o déjala vacía"

            showSnackbar({
              title:
                stepNumber === 3 ? "Emails inválidos" : stepNumber === 4 ? "URLs inválidas" : "Información incompleta",
              message: errorMessage,
              severity: "error",
            })
            return
          }
        }
      }

      goToNextStep()
      return
    }

    // Para paso 6: Lógica épica de validación y envío
    if (stepNumber === 6) {
      if (isFormCompletelyValid()) {
        // --- NUEVA LÓGICA DE VERIFICACIÓN DE PERFIL ---
        const profileCheck = checkProfileCompleteness(userFromApi)
        const hasGithubLink = !!(userFromApi?.social?.github && userFromApi.social.github.includes("github.com"))

        if (!hasGithubLink) {
          setModalState("githubRequired")
          setShowConfirmModal(true)
          return
        }
        if (profileCheck.isComplete) {
          // Si el perfil está completo, ir directo a la confirmación
          setModalState("confirm")
        } else {
          // Si no, mostrar la sugerencia primero
          setMissingProfileFields(profileCheck.missingFields)
          setModalState("profileSuggestion")
        }
        setShowConfirmModal(true)
      } else {
        // 🔥 ACTIVAR TODOS LOS ERRORES Y NAVEGAR AL PRIMER ERROR
        await trigger() // Activa TODOS los errores del formulario
        await findAndNavigateToFirstError()
      }
    }
  }

  const handleSaveDraft = async () => {
    try {
      const formDataApi = getValues()
      const newlyCreatedSkills: string[] = []

      const profilesByRole = (formDataApi.seekingProfiles ?? []).reduce(
        (acc, p) => {
          for (const role of p.roles) {
            // si un perfil tiene varios roles, los indexamos todos
            if (!acc[role]) acc[role] = []

            // revisar si la habilidad general es nueva
            if (!skillsGeneral.includes(p.generalSkills[0].trim())) newlyCreatedSkills.push(p.generalSkills[0].trim())

            acc[role].push({
              role: role,
              gSkills: p.generalSkills[0].trim(),
              hardSkills: p.technicalSkills.map((t) => t.trim()),
              description: p.additionalDescription?.trim(),
            })
          }
          return acc
        },
        {} as Record<string, PostulationType[]>,
      )

      const postulationCollaborator = profilesByRole["COLLABORATOR"] ?? []
      const postulationCofounder = profilesByRole["COFOUNDER"] ?? []

      const payload = {
        title: formDataApi.title.trim() || null,
        // isDraft: true,
        description: formDataApi.detailedDescription.trim() || null,
        img: formDataApi.mainImage || null,
        problemToBeSolved: formDataApi.problemSolved.trim() || null,
        marketInformation: formDataApi.marketInfo.trim() || null,
        productFeatures: formDataApi.productCharacteristics.trim() || null,
        objectives: formDataApi.objectives?.map((o) => o.description.trim()) || null,
        externalLinks: {
          otros: Object.entries(formDataApi.socialNetworks)
            .map(([key, value]) => ({
              nombre: key,
              url: value.trim(),
              img: "",
            }))
            .filter(({ url }) => url !== null && url !== ""),
        },
        motto: formDataApi.motto.trim() || null,
        tags: formDataApi.tags?.map((t) => t.trim()) || null,
        multimedia: formDataApi.images || null,
        roadmap:
          formDataApi.roadmapPhases?.map((phase, idx) => ({
            phaseNumber: (idx + 1).toString(),
            phaseName: phase.title.trim(),
            description: phase.description.trim(),
            status: phase.status,
          })) || null,
        update:
          formDataApi.updates?.map((u) => ({
            name: u.title.trim(),
            description: u.description.trim(),
          })) || null,
        needs: postulationCollaborator,
      } as const

      const isUpdatingDraft = !!initiativeDraftId || (isEditMode && initiativeData && initiativeData.state === "draft")

      if (newlyCreatedSkills.length > 0) {
        await fetchApi({
          path: API_PATH.USER_SKILL,
          init: { method: "POST", body: JSON.stringify({ skills: newlyCreatedSkills }) },
        })
      }

      if (isUpdatingDraft) {
        // PUT al draft existente
        await fetchApi({
          path: API_PATH.INITIATIVE,
          init: {
            method: "PUT",
            body: JSON.stringify({ ...payload, id: initiativeDraftId ?? initiativeData?.id }),
          },
        })

        // const promisedCoFounderEmails = formDataApi.coFounderEmails.map((email) =>
        //   fetchApi({
        //     path: API_PATH.INVITATION_COFOUNDER_EMAIL,
        //     init: { method: "POST", body: JSON.stringify({ initiativeId: iniciativeResponseDraft.id, email }) },
        //   }),
        // )

        const promisedPostulationCofounder =
          postulationCofounder
            .filter((postulation) => postulation.gSkills && postulation.hardSkills.length > 0)
            .map((postulation) =>
              fetchApi({
                path: API_PATH.INITIATIVE_CREATE_NOTICE,
                init: {
                  method: "POST",
                  body: JSON.stringify({
                    initiativeId: initiativeDraftId ?? initiativeData?.id,
                    description: postulation.description,
                    gSkills: postulation.gSkills,
                    hardSkills: postulation.hardSkills,
                  }),
                },
              }),
            ) || []

        await Promise.all(promisedPostulationCofounder)
      } else {
        // POST para crear nuevo draft
        const res = await fetchApi({
          path: API_PATH.INITIATIVE,
          init: { method: "POST", body: JSON.stringify(payload) },
        })
        // Guardar ID devuelto
        if (res && typeof res === "object" && "id" in res) {
          setInitiativeDraftId(res.id as number)

          const promisedPostulationCofounder =
            postulationCofounder
              .filter((postulation) => postulation.gSkills && postulation.hardSkills.length > 0)
              .map((postulation) =>
                fetchApi({
                  path: API_PATH.INITIATIVE_CREATE_NOTICE,
                  init: {
                    method: "POST",
                    body: JSON.stringify({
                      initiativeId: res.id,
                      description: postulation.description,
                      gSkills: postulation.gSkills,
                      hardSkills: postulation.hardSkills,
                    }),
                  },
                }),
              ) || []

          await Promise.all(promisedPostulationCofounder)
        }
      }

      showSnackbar({
        title: "Borrador guardado",
        message: "Borrador guardado exitosamente",
        severity: "success",
      })
    } catch (error: unknown) {
      showSnackbar({
        title: "Error al guardar el borrador",
        message: error instanceof Error ? error.message : "Error al guardar el borrador",
        severity: "error",
      })
    }
  }

  // Nueva función para avanzar desde la sugerencia de perfil a la confirmación final
  const handleProceedToConfirmation = () => {
    setModalState("confirm")
  }

  // 🚀 FUNCIÓN ÉPICA: Envío con bifurcación para CREAR vs ACTUALIZAR
  const handleSubmitInitiative = async () => {
    setModalState("loading")
    const newlyCreatedSkills: string[] = []

    const formDataApi = getValues()

    const profilesByRole = (formDataApi.seekingProfiles ?? []).reduce(
      (acc, p) => {
        for (const role of p.roles) {
          // si un perfil tiene varios roles, los indexamos todos
          if (!acc[role]) acc[role] = []
          if (!skillsGeneral.includes(p.generalSkills[0].trim())) newlyCreatedSkills.push(p.generalSkills[0].trim())
          acc[role].push({
            role: role,
            gSkills: p.generalSkills[0].trim(),
            hardSkills: p.technicalSkills.map((t) => t.trim()),
            description: p.additionalDescription?.trim(),
            active: p.active,
          })
        }
        return acc
      },
      {} as Record<string, PostulationType[]>,
    )

    const postulationCollaborator = profilesByRole["COLLABORATOR"] ?? []
    const postulationCofounder = profilesByRole["COFOUNDER"] ?? []

    const body = {
      // El body es casi el mismo, la API diferencia por el método (POST/PUT)
      title: formDataApi.title.trim(),
      description: formDataApi.detailedDescription.trim(),
      img: formDataApi.mainImage,
      problemToBeSolved: formDataApi.problemSolved.trim(),
      marketInformation: formDataApi.marketInfo.trim(),
      productFeatures: formDataApi.productCharacteristics.trim(),
      objectives: formDataApi.objectives?.map((objective) => objective.description.trim()),
      externalLinks: {
        otros: Object.entries(formDataApi.socialNetworks)
          .map(([key, value]) => ({
            nombre: key,
            url: value.trim(),
            img: "",
          }))
          .filter(({ url }) => url !== null && url !== ""),
      },
      motto: formDataApi.motto.trim(),
      tags: formDataApi.tags?.map((t) => t.trim()),
      multimedia: formDataApi.images,
      roadmap: formDataApi.roadmapPhases?.map((phase, index) => ({
        phaseNumber: (index + 1).toString(),
        phaseName: phase.title.trim(),
        description: phase.description.trim(),
        status: phase.status,
      })),
      update: formDataApi.updates?.map((update) => ({
        name: update.title.trim(),
        description: update.description.trim(),
      })),

      // esta parte solo funcionara para crear una iniciativa nueva y no para editar. Solo para colaboradores
      needs: postulationCollaborator,
    }

    if (newlyCreatedSkills.length > 0) {
      await fetchApi({
        path: API_PATH.USER_SKILL,
        init: { method: "POST", body: JSON.stringify({ skills: newlyCreatedSkills }) },
      })
    }

    if (isEditMode) {
      // --- Lógica de Actualización ---
      updateMutation.mutate({
        ...body,
        id: initiativeData?.id,
        announcements: postulationCofounder,
        coFounderEmails: formDataApi.coFounderEmails?.map((email) => email.trim()) || [],
      })
    } else {
      // --- Lógica de Creación o Publicación de borrador ---
      try {
        const iniciativeResponse = await fetchApi({
          path: API_PATH.INITIATIVE,
          init: {
            method: initiativeDraftId ? "PUT" : "POST",
            body: JSON.stringify(initiativeDraftId ? { ...body, id: initiativeDraftId } : body),
          },
        })

        await fetchApi({
          path: `${API_PATH.INITIATIVE_DRAFT_TO_PUBLISHED}/${initiativeDraftId ? initiativeDraftId : iniciativeResponse.id}`,
          init: {
            method: "POST",
          },
        })

        contentEvents.initiativeProposed({
          initiativeId: iniciativeResponse.id.toString(),
          title: body.title,
        })

        // tambien se debe enviar el correo de los cofundadores a la API de invitaciones
        const promisedCoFounderEmails =
          formDataApi.coFounderEmails?.map((email) =>
            fetchApi({
              path: API_PATH.INVITATION_COFOUNDER_EMAIL,
              init: {
                method: "POST",
                body: JSON.stringify({
                  initiativeId: initiativeDraftId ? initiativeDraftId : iniciativeResponse.id,
                  email,
                }),
              },
            }),
          ) || []

        const promisedPostulationCofounder =
          postulationCofounder
            .filter((postulation) => postulation.gSkills && postulation.hardSkills.length > 0)
            .map((postulation) =>
              fetchApi({
                path: API_PATH.INITIATIVE_CREATE_NOTICE,
                init: {
                  method: "POST",
                  body: JSON.stringify({
                    initiativeId: initiativeDraftId ? initiativeDraftId : iniciativeResponse.id,
                    description: postulation.description,
                    gSkills: postulation.gSkills,
                    hardSkills: postulation.hardSkills,
                  }),
                },
              }),
            ) || []

        await Promise.all([...promisedCoFounderEmails, ...promisedPostulationCofounder])
        setModalState("success")
        setInitiativeDraftId(null)
        queryClient.invalidateQueries({ queryKey: ["initiatives"] })
      } catch (error: unknown) {
        // Capturar el mensaje de error específico del backend
        const errorMsg = error instanceof Error ? error.message : "Error desconocido"

        if (errorMsg === "Por favor cambia el nombre de tu iniciativa") {
          // Actualizar el valor del formulario de título con el título actual
          setModalState("titleRequired")
        } else {
          setModalState("error")
        }
      }
    }
  }

  const handleModalCloseAndRedirect = useCallback(() => {
    setShowConfirmModal(false)
    setModalState("confirm")
    // Redirect to /list in both cases as requested by the user.
    if (isEditMode) {
      navigate(`/list?updated=true`)
    } else {
      resetForm()
      clearInitiativeStorage()
      navigate("/list")
    }
  }, [isEditMode, navigate, resetForm])

  // FUNCIÓN ÉPICA: Reintentar envío
  const handleRetry = () => {
    handleSubmitInitiative()
  }

  // ❌ FUNCIÓN ÉPICA: Cancelar proceso
  const handleCancel = () => {
    setShowConfirmModal(false)
    setModalState("confirm")
  }

  const handleUpdateGithub = async (data: { github: string }) => {
    const githubUrl = data.github.trim()

    setIsUpdatingGithub(true)
    try {
      await fetchApi({
        path: API_PATH.USERS,
        init: {
          method: "PUT",
          body: JSON.stringify({
            id: userFromApi?.id,
            github: githubUrl,
          }),
        },
      })

      const userFromApiState = {
        ...userFromApi!,
        social: {
          ...userFromApi!.social,
          github: githubUrl,
        },
      }

      setUserFromApi(userFromApiState)

      // Una vez actualizado, avanzamos al siguiente paso que es la sugerencia de perfil o la confirmación
      const profileCheck = checkProfileCompleteness(userFromApiState)
      if (profileCheck.isComplete) {
        setModalState("confirm")
      } else {
        setMissingProfileFields(profileCheck.missingFields)
        setModalState("profileSuggestion")
      }
    } catch {
      showSnackbar({
        title: "Error",
        message: "No se pudo actualizar tu perfil de GitHub. Por favor, inténtalo de nuevo.",
        severity: "error",
      })
    } finally {
      setIsUpdatingGithub(false)
    }
  }

  const handleGoToGitHub = () => {
    window.open("https://github.com", "_blank", "noopener")
  }

  const handleUpdateTitle = async (data: { title: string }) => {
    const newTitle = data.title.trim()

    setIsUpdatingTitle(true)
    try {
      // Actualizar el título en el formulario principal
      setValue("title", newTitle)

      // Una vez actualizado el título, reintentar el envío
      setModalState("loading")

      // Pequeña pausa para que el usuario vea que se está procesando
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Reintentar el envío con el nuevo título
      handleSubmitInitiative()
    } catch {
      showSnackbar({
        title: "Error",
        message: "No se pudo actualizar el título. Por favor, inténtalo de nuevo.",
        severity: "error",
      })
      setModalState("titleRequired")
    } finally {
      setIsUpdatingTitle(false)
    }
  }

  // ¡BOTÓN SIEMPRE ACTIVO AHORA!
  const buttonText = () => {
    if (stepNumber === 6) {
      if (isFormCompletelyValid()) {
        return isEditMode ? "Actualizar Iniciativa" : "¡Publicar!"
      }
      return "Completar Pasos"
    }
    return "Continuar"
  }

  const buttonTextMobile = () => {
    if (stepNumber === 6) {
      if (isFormCompletelyValid()) {
        return isEditMode ? "Actualizar" : "Publicar"
      }
      return "Completar"
    }
    return "Siguiente"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
        <Button
          onClick={goToPreviousStep}
          variant="contained"
          disabled={!canPrev}
          startIcon={!isMobile ? <NavigateBefore /> : undefined}
          sx={{
            borderRadius: 8,
            px: { xs: 1.5, sm: 3 },
            py: 1.5,
            fontWeight: 600,
            minWidth: { xs: 80, sm: 140 },
            fontSize: { xs: "0.85rem", sm: "1rem" },
            background: canPrev
              ? "linear-gradient(135deg, #E1BEE7, #F8BBD9)"
              : alpha(theme.palette.action.disabled, 0.5),
            color: canPrev ? "#8E24AA" : alpha(theme.palette.text.disabled, 0.8),
            border: "none",
            boxShadow: canPrev ? "0 4px 12px rgba(225, 190, 231, 0.4)" : "none",
            "&:hover": {
              background: canPrev
                ? "linear-gradient(135deg, #D1C4E9, #F06292)"
                : alpha(theme.palette.action.disabled, 0.5),
              transform: canPrev ? "translateY(-1px)" : "none",
              boxShadow: canPrev ? "0 6px 16px rgba(225, 190, 231, 0.5)" : "none",
            },
            "&:disabled": {
              background: alpha(theme.palette.action.disabled, 0.3),
              color: alpha(theme.palette.text.disabled, 0.5),
            },
          }}
        >
          Atrás
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSaveDraft}
            variant="contained"
            disabled={isEditMode && initiativeData?.state !== "draft"}
            startIcon={!isMobile ? <Save /> : undefined}
            sx={{
              borderRadius: 8,
              px: { xs: 1.5, sm: 3 },
              py: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.85rem", sm: "1rem" },
              background: "linear-gradient(135deg, #B3C5E8, #9FB8E3)",
              color: "#3F51B5",
              border: "none",
              boxShadow: "0 4px 12px rgba(179, 197, 232, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #9FB8E3, #90A4DF)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 16px rgba(179, 197, 232, 0.5)",
              },
            }}
          >
            <Box sx={{ display: { xs: "block", sm: "none" } }}>Borrador</Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>Guardar borrador</Box>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleContinue}
            variant="contained"
            endIcon={!isMobile ? <NavigateNext /> : undefined}
            sx={{
              borderRadius: 8,
              px: { xs: 2, sm: 4 },
              py: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              background: "linear-gradient(135deg, #4A5FBF, #3D4FB5)",
              color: "white",
              border: "none",
              boxShadow: "0 8px 24px rgba(74, 95, 191, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #3D4FB5, #2E3A8C)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(74, 95, 191, 0.5)",
              },
            }}
          >
            <Box sx={{ display: { xs: "block", sm: "none" } }}>{buttonTextMobile()}</Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>{buttonText()}</Box>
          </Button>
        </motion.div>
      </Stack>

      {/* 🚀 MODAL DE CONFIRMACIÓN ÉPICO */}
      <AnimatePresence>
        {showConfirmModal && (
          <Dialog
            open={showConfirmModal}
            onClose={(_, reason) => {
              // Prevenir que se cierre el modal durante la carga, éxito o error
              if (modalState === "loading" || modalState === "success" || modalState === "error") {
                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                  return // No hacer nada y mantener el modal abierto
                }
              }

              // Comportamiento por defecto para otros estados (como 'confirm')
              if (reason === "backdropClick" && !isUpdatingGithub) {
                handleCancel()
              }
            }}
            maxWidth="sm"
            fullWidth
            disableEscapeKeyDown
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: "hidden",
                maxHeight: "90vh",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
            sx={{
              "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                  overflow: "hidden",
                },
              },
              "& .MuiDialog-paper": {
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <DialogContent
                sx={{
                  p: 4,
                  textAlign: "center",
                  overflow: "hidden",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Contenido del modal de sugerencia de perfil */}
                {modalState === "profileSuggestion" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <IconButton onClick={handleCancel} sx={{ position: "absolute", top: 8, right: 8 }}>
                      <Close />
                    </IconButton>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <InfoOutlined sx={{ fontSize: 80 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      ¡Haz que tu iniciativa destaque! 🚀
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: "left" }}>
                      Un perfil completo genera más confianza y ayuda a que las personas se interesen en tu iniciativa.
                      Para que tu propuesta tenga el máximo impacto, te sugerimos completar:
                    </Typography>
                    <List dense sx={{ mb: 4, textAlign: "left" }}>
                      {missingProfileFields.map((field, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: "secondary.light" }} />
                          </ListItemIcon>
                          <ListItemText primary={field} />
                        </ListItem>
                      ))}
                    </List>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                      <Button
                        onClick={() => navigate("/profile/edit")}
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Ir a mi perfil
                      </Button>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleProceedToConfirmation}
                          variant="contained"
                          color="secondaryLight"
                          size="large"
                        >
                          Continuar de todos modos
                        </Button>
                      </motion.div>
                    </Stack>
                  </motion.div>
                )}

                {/* Contenido del modal de confirmación */}
                {modalState === "confirm" && (
                  <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <CheckCircle sx={{ fontSize: 80 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      {isEditMode ? "Confirmar Actualización" : "Confirmación de iniciativa"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                      {isEditMode
                        ? "Al guardar los cambios, la información de tu iniciativa se actualizará para toda la comunidad."
                        : "Al enviar tu propuesta, esta aparecerá en la sección 'Explorar Iniciativas' y estará disponible para que la comunidad vote y comente. El proceso de votación de la comunidad toma aproximadamente 2 semanas, y el equipo de OpenLab la revisará una vez que cumpla los criterios de pre-aprobación."}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button onClick={handleCancel} variant="outlined" size="large">
                        Cancelar
                      </Button>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleSubmitInitiative}
                          variant="contained"
                          size="large"
                          sx={{
                            background: "primary.main",
                            px: 4,
                          }}
                        >
                          {isEditMode ? "Guardar Cambios" : "Crear iniciativa"}
                        </Button>
                      </motion.div>
                    </Stack>
                  </motion.div>
                )}

                {/* Contenido del modal de loading */}
                {modalState === "loading" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div animate={{ rotate: 360 }}>
                      <CircularProgress size={80} sx={{ color: "primary.main", mb: 3 }} />
                    </motion.div>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      {isEditMode ? "Actualizando tu iniciativa..." : "Creando tu iniciativa..."}
                    </Typography>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Typography variant="body1" color="text.secondary">
                        Estamos procesando tu propuesta. ¡Esto no tomará mucho tiempo!
                      </Typography>
                    </motion.div>
                  </motion.div>
                )}

                {/* Contenido del modal de éxito */}
                {modalState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle sx={{ fontSize: 100, color: "primary.main", mb: 2 }} />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
                        {isEditMode ? "¡Iniciativa Actualizada!" : "¡Iniciativa creada con éxito!"}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {isEditMode
                          ? "Los cambios en tu iniciativa se han guardado correctamente."
                          : "Tu Iniciativa ahora es una propuesta que puede ver toda la comunidad"}
                      </Typography>

                      {/* Barra de progreso animada */}
                      <Box sx={{ width: "100%", mb: 3 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.6, duration: 2 }}
                          onAnimationComplete={handleModalCloseAndRedirect}
                          style={{
                            height: 8,
                            background: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>

                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleModalCloseAndRedirect}
                        sx={{
                          background: theme.palette.primary.main,
                          px: 4,
                        }}
                      >
                        Finalizar
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Contenido del modal de error */}
                {modalState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                      <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
                    </motion.div>

                    <Typography variant="h5" fontWeight="bold" color="error.main" sx={{ mb: 2 }}>
                      ¡Ups! Algo salió mal
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      {isEditMode
                        ? "Hubo un problema al actualizar tu iniciativa."
                        : "Hubo un problema al enviar tu iniciativa."}{" "}
                      Por favor, inténtalo de nuevo.
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button onClick={handleCancel} variant="outlined" color="error">
                        Cancelar
                      </Button>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          onClick={handleRetry}
                          variant="contained"
                          color="error"
                          startIcon={<Refresh />}
                          sx={{
                            background: "red",
                            color: "white",
                            "&:hover": {
                              background: "red",
                            },
                          }}
                        >
                          Reintentar
                        </Button>
                      </motion.div>
                    </Stack>
                  </motion.div>
                )}

                {modalState === "githubRequired" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <IconButton
                      onClick={handleCancel}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      disabled={isUpdatingGithub}
                    >
                      <Close />
                    </IconButton>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <GitHub sx={{ fontSize: 80 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      Enlaza tu cuenta de GitHub
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "left" }}>
                      Para crear o editar una iniciativa, es necesario que enlaces tu perfil de GitHub. Esto nos ayuda a
                      verificar tu identidad y tu experiencia.
                    </Typography>

                    <form onSubmit={handleSubmitGithub(handleUpdateGithub)} noValidate>
                      <FormTextField
                        register={registerGithub("github")}
                        label="URL de tu perfil de GitHub"
                        placeholder="https://github.com/tu-usuario"
                        value={watchGithub("github")}
                        error={githubErrors.github}
                        disabled={isUpdatingGithub}
                        sx={{ mb: 1 }}
                        icon={GitHub}
                        onClear={() => setGithubValue("github", "")}
                      />

                      {githubErrors.github && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {githubErrors.github.message}
                        </Alert>
                      )}

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={isUpdatingGithub}
                          startIcon={isUpdatingGithub ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                          {isUpdatingGithub ? "Agregando..." : "Agregar Cuenta"}
                        </Button>
                        <Button
                          onClick={handleGoToGitHub}
                          variant="contained"
                          color="secondaryLight"
                          size="large"
                          disabled={
                            isUpdatingGithub ||
                            (watchGithub("github").trim().startsWith("https://github.com/") &&
                              watchGithub("github").trim().length > 19)
                          }
                        >
                          Crear cuenta en GitHub
                        </Button>
                      </Stack>
                    </form>
                  </motion.div>
                )}

                {/* Modal para cambiar título cuando hay error de título duplicado */}
                {modalState === "titleRequired" && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <IconButton
                      onClick={handleCancel}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      disabled={isUpdatingTitle}
                    >
                      <Close />
                    </IconButton>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      <ErrorIcon sx={{ fontSize: 80 }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      Título duplicado
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "left" }}>
                      Ya existe una iniciativa con ese nombre. Por favor, elige un título diferente para continuar.
                    </Typography>

                    <form onSubmit={handleSubmitTitle(handleUpdateTitle)} noValidate>
                      <FormTextField
                        register={registerTitle("title")}
                        label="Nuevo título para tu iniciativa"
                        placeholder="Escribe un título único y descriptivo"
                        value={watchTitle("title")}
                        error={titleErrors.title}
                        disabled={isUpdatingTitle}
                        sx={{ mb: 1 }}
                        onClear={() => {
                          setTitleValue("title", "")
                          setValue("title", "")
                        }}
                        maxLength={100}
                      />

                      {titleErrors.title && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {titleErrors.title.message}
                        </Alert>
                      )}

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Button
                          onClick={handleCancel}
                          variant="outlined"
                          color="primary"
                          size="large"
                          disabled={isUpdatingTitle}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={isUpdatingTitle || !watchTitle("title").trim()}
                          startIcon={isUpdatingTitle ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                        >
                          {isUpdatingTitle ? "Actualizando..." : "Actualizar y reintentar"}
                        </Button>
                      </Stack>
                    </form>
                  </motion.div>
                )}
              </DialogContent>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default NavigationButtons
