import { useFormContext } from "react-hook-form"
import type { InitiativeFormData } from "../schemas/initiativeSchema"
import { useInitiativeStore } from "../stores/initiativeStore"

export type StepStatus = "neutral" | "pending" | "optional" | "completed"

interface StepInfo {
  status: StepStatus
  requiredFields: string[]
  optionalFields: string[]
  progress: number // 0-100
}

export const useStepLogic = (options?: { isStep3Optional?: boolean }) => {
  const { watch } = useFormContext<InitiativeFormData>()
  const { hasStartedNavigation } = useInitiativeStore()
  const allFormData = watch()

  // Definir campos obligatorios y opcionales por paso (EXACTAMENTE según el schema sagrado)
  const stepDefinitions = {
    1: {
      required: ["title", "motto", "mainImage"],
      optional: ["images"],
    },
    2: {
      required: ["tags", "detailedDescription", "problemSolved", "objectives", "marketInfo", "productCharacteristics"],
      optional: [],
    },
    3: {
      required: options?.isStep3Optional ? [] : ["seekingProfiles"],
      optional: ["coFounderEmails"],
    },
    4: {
      required: [],
      optional: ["socialNetworks", "externalLinks"],
    },
    5: {
      required: [],
      optional: ["updates", "roadmapPhases"],
    },
    6: {
      required: [],
      optional: [],
    },
  }

  const checkFieldCompletion = (fieldName: string): boolean => {
    const value = allFormData[fieldName as keyof InitiativeFormData]

    switch (fieldName) {
      case "title":
      case "motto":
      case "mainImage":
      case "detailedDescription":
      case "problemSolved":
      case "marketInfo":
      case "productCharacteristics":
        return typeof value === "string" && value.trim().length > 0

      case "tags":
        return Array.isArray(value) && value.length > 0

      case "objectives": {
        const objectives = value as { id: string; description: string }[]
        return (
          Array.isArray(objectives) &&
          objectives.length > 0 &&
          objectives.every((obj) => obj.description && obj.description.trim().length > 0)
        )
      }

      case "coFounderEmails": {
        const coFounderEmails = value as string[]
        return (
          Array.isArray(coFounderEmails) &&
          coFounderEmails.length > 0 &&
          coFounderEmails.every((cf) => cf && cf.includes("@"))
        )
      }

      case "seekingProfiles": {
        const seekingProfiles = value as {
          id: string
          roles: string[]
          generalSkills: string[]
          technicalSkills: string[]
          avatar: string
          additionalDescription?: string
        }[]
        return (
          Array.isArray(seekingProfiles) &&
          seekingProfiles.length > 0 &&
          seekingProfiles.some((sp: { roles: string[] }) => sp.roles.includes("COLLABORATOR")) &&
          seekingProfiles.every(
            (sp) =>
              sp.roles &&
              sp.roles.length > 0 &&
              sp.generalSkills &&
              sp.generalSkills.length > 0 &&
              sp.technicalSkills &&
              sp.technicalSkills.length > 0,
            //  && sp.additionalDescription &&
            // sp.additionalDescription.trim().length > 0,
          )
        )
      }

      case "socialNetworks": {
        const socialNetworks = value as {
          linkedin?: string
          facebook?: string
          instagram?: string
          website?: string
          twitter?: string
        }

        if (!socialNetworks) return false // No está inicializado

        const socialNetworkKeys: (keyof typeof socialNetworks)[] = [
          "linkedin",
          "facebook",
          "instagram",
          "website",
          "twitter",
        ]

        // Para que se considere completo, TODOS los campos de redes sociales deben tener una URL válida.
        for (const key of socialNetworkKeys) {
          const url = socialNetworks[key]
          if (!url || url.trim() === "") {
            return false // Si alguno está vacío, no está completo.
          }
          try {
            new URL(url) // Validar que sea una URL
          } catch {
            return false // Si alguna URL es inválida, no está completo.
          }
        }

        return true // Si todos los campos tienen URLs válidas, está completo.
      }

      case "externalLinks": {
        const externalLinks = value as {
          discord?: string
          github?: string
          dework?: string
          aragon?: string
          // figma?: string
        }

        // Para campos completamente opcionales: siempre considerar completado
        // Solo verificar si hay al menos una URL válida si se quiere mostrar como "completado"
        if (!externalLinks) return false // No está inicializado

        const hasValidUrl = Object.values(externalLinks).some((url) => {
          if (!url || url.trim() === "") return false
          try {
            new URL(url)
            return true
          } catch {
            return false
          }
        })

        return hasValidUrl
      }

      case "updates": {
        const updates = value as { id: string; title: string; description: string; createdAt: Date }[]
        return (
          Array.isArray(updates) && updates.length > 0 && updates.every((update) => update.title && update.description)
        )
      }

      case "roadmapPhases": {
        const roadmapPhases = value as {
          id: string
          phase: string
          title: string
          description: string
          status: string
        }[]
        return (
          Array.isArray(roadmapPhases) &&
          roadmapPhases.length > 0 &&
          roadmapPhases.every((phase) => phase.title && phase.description)
        )
      }

      default:
        return false
    }
  }

  const getStepInfo = (stepNumber: number): StepInfo => {
    const stepDef = stepDefinitions[stepNumber as keyof typeof stepDefinitions]

    if (!stepDef) {
      return { status: "neutral", requiredFields: [], optionalFields: [], progress: 0 }
    }

    // Si no ha empezado la navegación, mostrar neutral
    if (!hasStartedNavigation) {
      return { status: "neutral", requiredFields: stepDef.required, optionalFields: stepDef.optional, progress: 0 }
    }

    // Lógica especial para el paso 6: solo completado si todos los pasos obligatorios están completos
    if (stepNumber === 6) {
      // Verificar directamente si los pasos 1, 2 y 3 están completos (según el schema sagrado)
      const step1Info = getStepInfoInternal(1)
      const step2Info = getStepInfoInternal(2)
      const step3Info = getStepInfoInternal(3)
      const isAllRequiredCompleted =
        step1Info.status === "completed" && step2Info.status === "completed" && step3Info.status === "completed"

      return {
        status: isAllRequiredCompleted ? "completed" : "pending",
        requiredFields: [],
        optionalFields: [],
        progress: isAllRequiredCompleted ? 100 : 0,
      }
    }

    return getStepInfoInternal(stepNumber)
  }

  // Función interna para evitar recursión en el paso 6
  const getStepInfoInternal = (stepNumber: number): StepInfo => {
    const stepDef = stepDefinitions[stepNumber as keyof typeof stepDefinitions]

    if (!stepDef) {
      return { status: "neutral", requiredFields: [], optionalFields: [], progress: 0 }
    }

    // Lógica especial para el paso 4: se considera completo si todas las redes sociales están llenas.
    if (stepNumber === 4) {
      const allSocialsCompleted = checkFieldCompletion("socialNetworks")
      if (allSocialsCompleted) {
        return {
          status: "completed",
          requiredFields: stepDef.required,
          optionalFields: stepDef.optional,
          progress: 100,
        }
      }
    }

    const requiredCompleted = stepDef.required.filter((field) => checkFieldCompletion(field))
    const optionalCompleted = stepDef.optional.filter((field) => checkFieldCompletion(field))

    const totalFields = stepDef.required.length + stepDef.optional.length
    const completedFields = requiredCompleted.length + optionalCompleted.length
    const progress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0

    // Lógica de estados según tus especificaciones
    if (stepDef.required.length === 0) {
      // Solo campos opcionales
      if (stepDef.optional.length === 0) {
        return { status: "completed", requiredFields: [], optionalFields: [], progress: 100 }
      }

      if (optionalCompleted.length === stepDef.optional.length) {
        return { status: "completed", requiredFields: [], optionalFields: stepDef.optional, progress: 100 }
      } else {
        return { status: "optional", requiredFields: [], optionalFields: stepDef.optional, progress }
      }
    } else {
      // Tiene campos obligatorios
      if (requiredCompleted.length === stepDef.required.length) {
        return { status: "completed", requiredFields: stepDef.required, optionalFields: stepDef.optional, progress }
      } else {
        return { status: "pending", requiredFields: stepDef.required, optionalFields: stepDef.optional, progress }
      }
    }
  }

  const getOverallProgress = (): number => {
    // Progreso inteligente: base 6 pasos, según el schema sagrado
    // Paso 1: Cuenta como 1 (REQUERIDO)
    // Paso 2: Cuenta como 1 (REQUERIDO)
    // Paso 3: Solo cuenta si hay perfiles buscados
    // Pasos 4, 5: NO cuentan (son opcionales)
    // Paso 6: Se autocompleta cuando 1, 2 y 3 están listos (cuenta como 3 para llegar a 6)

    const step1Info = getStepInfoInternal(1)
    const step2Info = getStepInfoInternal(2)
    const step3Info = getStepInfoInternal(3)

    let completedCount = 0

    // Contar paso 1 si está completo
    if (step1Info.status === "completed") {
      completedCount += 1
    }

    // Contar paso 2 si está completo
    if (step2Info.status === "completed") {
      completedCount += 1
    }

    // Contar paso 3 si está completo
    if (step3Info.status === "completed") {
      completedCount += 1
    }

    // Si todos los pasos obligatorios están completos, automáticamente llegar a 6
    // (paso 6 se autocompleta + damos crédito por los pasos opcionales)
    if (step1Info.status === "completed" && step2Info.status === "completed" && step3Info.status === "completed") {
      completedCount = 6 // Automáticamente 6/6 = 100%
    }

    return (completedCount / 6) * 100
  }

  const getCompletedStepsCount = (): { completed: number; total: number } => {
    // Función auxiliar para obtener el conteo de pasos para mostrar en UI
    const step1Info = getStepInfoInternal(1)
    const step2Info = getStepInfoInternal(2)
    const step3Info = getStepInfoInternal(3)

    let completedCount = 0

    if (step1Info.status === "completed") {
      completedCount += 1
    }

    if (step2Info.status === "completed") {
      completedCount += 1
    }

    if (step3Info.status === "completed") {
      completedCount += 1
    }

    // Si todos los obligatorios están completos, mostrar 6/6
    if (step1Info.status === "completed" && step2Info.status === "completed" && step3Info.status === "completed") {
      completedCount = 6
    }

    return { completed: completedCount, total: 6 }
  }

  const getRequiredStepsProgress = (): { completed: number; total: number; percentage: number } => {
    const requiredSteps = options?.isStep3Optional ? [1, 2] : [1, 2, 3] // Pasos 1, 2 y 3 son obligatorios según el schema sagrado
    let completedRequired = 0

    requiredSteps.forEach((stepNum) => {
      const stepInfo = getStepInfo(stepNum)
      if (stepInfo.status === "completed") {
        completedRequired++
      }
    })

    return {
      completed: completedRequired,
      total: requiredSteps.length,
      percentage: (completedRequired / requiredSteps.length) * 100,
    }
  }

  const getStepValidationMessage = (stepNumber: number): string[] => {
    const stepDef = stepDefinitions[stepNumber as keyof typeof stepDefinitions]
    if (!stepDef) return []

    const missingFields: string[] = []

    // Lógica especial para el paso 6: verificar que todos los pasos obligatorios estén completos
    if (stepNumber === 6) {
      const step1Info = getStepInfoInternal(1)
      const step2Info = getStepInfoInternal(2)

      if (step1Info.status !== "completed") {
        missingFields.push("Completar Paso 1 (La Idea)")
      }
      if (step2Info.status !== "completed") {
        missingFields.push("Completar Paso 2 (El Producto)")
      }
      if (!options?.isStep3Optional) {
        const step3Info = getStepInfoInternal(3)
        if (step3Info.status !== "completed") {
          missingFields.push("Completar Paso 3 (El Equipo)")
        }
      }

      return missingFields
    }

    // Verificar campos obligatorios
    stepDef.required.forEach((field) => {
      if (!checkFieldCompletion(field)) {
        switch (field) {
          case "title":
            missingFields.push("Título de la iniciativa")
            break
          case "motto":
            missingFields.push("Lema de la iniciativa")
            break
          case "mainImage":
            missingFields.push("Imagen principal")
            break
          case "detailedDescription":
            missingFields.push("Descripción detallada")
            break
          case "problemSolved":
            missingFields.push("Problema que resuelve")
            break
          case "marketInfo":
            missingFields.push("Información del mercado")
            break
          case "productCharacteristics":
            missingFields.push("Características del producto")
            break
          case "tags":
            missingFields.push("Al menos una etiqueta")
            break
          case "objectives":
            missingFields.push("Al menos un objetivo")
            break
          case "coFounderEmails":
            missingFields.push("Al menos un cofundador")
            break
          case "seekingProfiles":
            missingFields.push("Al menos un perfil buscado")
            break
          case "socialNetworks":
            missingFields.push("URLs válidas en redes sociales")
            break
          case "externalLinks":
            missingFields.push("URLs válidas en enlaces externos")
            break
        }
      }
    })

    // Para campos opcionales, verificar si están incompletos (empezados pero no terminados)
    stepDef.optional.forEach((field) => {
      const value = allFormData[field as keyof InitiativeFormData]

      switch (field) {
        case "coFounderEmails": {
          const coFounderEmails = value as string[]
          if (Array.isArray(coFounderEmails) && coFounderEmails.length > 0) {
            const incompleteCoFounders = coFounderEmails.filter((cf) => !cf || !cf.includes("@"))
            if (incompleteCoFounders.length > 0) {
              missingFields.push(`Email válido de ${incompleteCoFounders.length} cofundador(es)`)
            }
          }
          break
        }
        case "seekingProfiles": {
          const seekingProfiles = value as {
            id: string
            roles: string[]
            generalSkills: string[]
            technicalSkills: string[]
            avatar: string
            additionalDescription: string
          }[]
          if (Array.isArray(seekingProfiles) && seekingProfiles.length > 0) {
            const incompleteProfiles = seekingProfiles.filter(
              (sp) =>
                !sp.roles ||
                sp.roles.length === 0 ||
                !sp.generalSkills ||
                sp.generalSkills.length === 0 ||
                !sp.technicalSkills ||
                sp.technicalSkills.length === 0 ||
                !sp.additionalDescription ||
                sp.additionalDescription.trim().length === 0,
            )
            if (incompleteProfiles.length > 0) {
              missingFields.push(`Información completa de ${incompleteProfiles.length} perfil(es) buscado(s)`)
            }
          }
          break
        }
        case "socialNetworks": {
          const socialNetworks = value as {
            linkedin?: string
            facebook?: string
            instagram?: string
            website?: string
            twitter?: string
          }
          if (socialNetworks) {
            const invalidUrls = Object.entries(socialNetworks).filter(
              ([, url]) => url && url.trim().length > 0 && !url.startsWith("http"),
            )
            if (invalidUrls.length > 0) {
              const networks = invalidUrls.map(([key]) => {
                switch (key) {
                  case "linkedin":
                    return "LinkedIn"
                  case "facebook":
                    return "Facebook"
                  case "instagram":
                    return "Instagram"
                  case "website":
                    return "Sitio web"
                  case "twitter":
                    return "Twitter"
                  default:
                    return key
                }
              })
              missingFields.push(`URL válida para: ${networks.join(", ")}`)
            }
          }
          break
        }
        case "externalLinks": {
          const externalLinks = value as {
            discord?: string
            github?: string
            dework?: string
            aragon?: string
            // figma?: string
          }
          if (externalLinks) {
            const invalidUrls = Object.entries(externalLinks).filter(
              ([, url]) => url && url.trim().length > 0 && !url.startsWith("http"),
            )
            if (invalidUrls.length > 0) {
              const links = invalidUrls.map(([key]) => {
                switch (key) {
                  case "discord":
                    return "Discord"
                  case "github":
                    return "GitHub"
                  case "dework":
                    return "Dework"
                  case "aragon":
                    return "Aragon"
                  // case "figma":
                  //   return "Figma"
                  default:
                    return key
                }
              })
              missingFields.push(`URL válida para: ${links.join(", ")}`)
            }
          }
          break
        }
        case "updates": {
          const updates = value as { id: string; title: string; description: string; createdAt: Date }[]
          if (Array.isArray(updates) && updates.length > 0) {
            const incompleteUpdates = updates.filter((update) => !update.title || !update.description)
            if (incompleteUpdates.length > 0) {
              missingFields.push(`Información completa de ${incompleteUpdates.length} actualización(es)`)
            }
          }
          break
        }
        case "roadmapPhases": {
          const roadmapPhases = value as {
            id: string
            phase: string
            title: string
            description: string
            date: Date
            status: string
          }[]
          if (Array.isArray(roadmapPhases) && roadmapPhases.length > 0) {
            const incompletePhases = roadmapPhases.filter((phase) => !phase.title || !phase.description)
            if (incompletePhases.length > 0) {
              missingFields.push(`Información completa de ${incompletePhases.length} fase(s) del roadmap`)
            }
          }
          break
        }
      }
    })

    return missingFields
  }

  return {
    getStepInfo,
    getOverallProgress,
    getRequiredStepsProgress,
    getStepValidationMessage,
    getCompletedStepsCount,
    hasStartedNavigation,
  }
}
