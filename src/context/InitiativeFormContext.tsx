import { createContext, useContext, useEffect } from "react"
import type { ReactNode } from "react"
import { useForm, FormProvider, type UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import type { InitiativeFormData, Step4Data } from "../schemas/initiativeSchema"
import {
  initiativeSchema,
  step1Schema,
  step2Schema,
  // step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
} from "../schemas/initiativeSchema"
import type { Initiative } from "@/interfaces/initiative"
import { useInitiativeStore } from "../stores/initiativeStore"
import { RoadmapStatus } from "@/interfaces/general-enum"
import { useShallow } from "zustand/react/shallow"
import { AVATAR_PROFILE_POSTULATION } from "@/lib/constants"

interface InitiativeFormContextType {
  form: UseFormReturn<InitiativeFormData>
  isStepValid: (step: number) => boolean
  submitForm: () => Promise<void>
  goToNextStep: () => void
  goToPreviousStep: () => void
  canGoToNextStep: () => boolean
  canGoToPreviousStep: () => boolean
  goToStep: (step: number) => void
  isEditMode: boolean
  initiativeData?: Initiative | null
}

const InitiativeFormContext = createContext<InitiativeFormContextType | undefined>(undefined)

interface InitiativeFormProviderProps {
  children: ReactNode
  initiativeData?: Initiative | null
}

const transformApiToFormData = (apiData: Initiative): Partial<InitiativeFormData> => {
  // Mapeo cuidadoso de la data de la API a la del formulario
  const socialLinks: Step4Data["socialNetworks"] = {}
  const externalLinks: Step4Data["externalLinks"] = {}

  const { otros } = apiData.externalLinks || {}

  if (otros && otros.length) {
    otros.forEach(({ nombre, url }) => {
      if (nombre === "facebook") socialLinks.facebook = url
      else if (nombre === "instagram") socialLinks.instagram = url
      else if (nombre === "twitter") socialLinks.twitter = url
      else if (nombre === "linkedin") socialLinks.linkedin = url
      else if (nombre === "website") socialLinks.website = url
    })
  }

  const formDataParsed: Partial<InitiativeFormData> = {
    title: apiData.title,
    motto: apiData.motto,
    mainImage: apiData.img,
    images: apiData.multimedia || [],
    tags: apiData.tags || [],
    detailedDescription: apiData.description,
    problemSolved: apiData.problemToBeSolved,
    marketInfo: apiData.marketInformation,
    productCharacteristics: apiData.productFeatures,
    objectives: apiData.objectives?.map((desc, i) => ({ id: `obj_${i}`, description: desc })) || [],
    socialNetworks: socialLinks,
    externalLinks: externalLinks,
    updates:
      apiData.update?.map((u, i) => ({
        id: `update_${i}`,
        title: u.name || "",
        description: u.description || "",
        createdAt: new Date(),
      })) || [],
    roadmapPhases:
      apiData.roadmap?.map((r, i) => ({
        id: `phase_${i}`,
        phase: r.phaseNumber || "",
        title: r.phaseName || "",
        description: r.description || "",
        status: (r.status as RoadmapStatus) || RoadmapStatus.PENDING,
      })) || [],
    // Campos que no vienen de la API pero necesitan estar en el form
    coFounderEmails: [],
    seekingProfiles: (
      apiData.needs?.map((need) => ({
        id: need.id.toString(),
        roles: ["COLLABORATOR"],
        generalSkills: [need.gSkills],
        avatar: AVATAR_PROFILE_POSTULATION,
        technicalSkills: need.hardSkills,
      })) || []
    ).concat(
      apiData.announcements?.map((a) => ({
        id: a.id.toString(),
        roles: ["COFOUNDER"],
        generalSkills: a.gSkill ? [a.gSkill] : [],
        technicalSkills: a.hardSkills?.length ? a.hardSkills : [],
        avatar: AVATAR_PROFILE_POSTULATION,
        additionalDescription: a.description,
        date: a.createdDate,
        active: a.active,
      })) || [],
    ),
    collaborators: apiData.collaborators || [],
  }

  return formDataParsed
}

export const InitiativeFormProvider: React.FC<InitiativeFormProviderProps> = ({ children, initiativeData = null }) => {
  const {
    formData: storeFormData,
    updateFormData,
    setIsSubmitting,
    resetForm,
    currentStep,
    setCurrentStep,
    markStepAsCompleted,
    isReset,
    setIsReset,
  } = useInitiativeStore(
    useShallow((state) => ({
      formData: state.formData,
      updateFormData: state.updateFormData,
      setIsSubmitting: state.setIsSubmitting,
      resetForm: state.resetForm,
      currentStep: state.currentStep,
      setCurrentStep: state.setCurrentStep,
      markStepAsCompleted: state.markStepAsCompleted,
      isReset: state.isReset,
      setIsReset: state.setIsReset,
    })),
  )

  const isEditMode = !!initiativeData
  const isStep3Optional = isEditMode

  // Esquema opcional para el paso 3. Se eliminan las validaciones .min(1)
  // para permitir arrays vacíos, sin cambiar el tipo a `T | undefined`.
  const step3SchemaOptional = z.object({
    coFounderEmails: z.array(z.string().email("Email inválido")).optional(),
    // seekingProfiles: z.array(step3Schema.shape.seekingProfiles.element).max(20, "Máximo 20 perfiles"),
    seekingProfiles: z
      .array(
        z.object({
          id: z.string().trim(),
          roles: z.array(z.string().trim()).min(1, "Selecciona al menos un rol"),
          generalSkills: z.array(z.string().trim()).min(1, "Selecciona al menos una habilidad general"),
          technicalSkills: z.array(z.string().trim()).min(1, "Selecciona al menos una habilidad técnica"),
          avatar: z.string().trim().url("URL de avatar inválida"),
          date: z.string().trim().optional(),
          active: z.boolean().optional(),
          additionalDescription: z
            .string({
              required_error: "La descripción adicional es requerida",
              invalid_type_error: "La descripción adicional debe ser una cadena de texto",
              message: "La descripción adicional es requerida",
            })
            .trim()
            .optional(),
        }),
      )
      .max(20, "Máximo 20 perfiles"),
    collaborators: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          email: z.string(),
          role: z.enum(["COFOUNDER", "COLLABORATOR"]),
          profilePic: z.string(),
        }),
      )
      .optional(),
  })

  const dynamicInitiativeSchema = isStep3Optional
    ? step1Schema.merge(step2Schema).merge(step3SchemaOptional).merge(step4Schema).merge(step5Schema).merge(step6Schema)
    : initiativeSchema

  const form = useForm<InitiativeFormData>({
    resolver: zodResolver(dynamicInitiativeSchema),
    // Los valores por defecto SIEMPRE vienen del store. Al entrar en modo edición,
    // un efecto se encargará de poblar el store con los datos correctos.
    defaultValues: storeFormData as InitiativeFormData,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
    shouldFocusError: true,
  })

  // Sincronizar con el store SÓLO en modo de creación
  useEffect(() => {
    if (!isEditMode) {
      const subscription = form.watch((value) => {
        updateFormData(value as Partial<InitiativeFormData>)
      })
      return () => subscription.unsubscribe()
    }
  }, [form, updateFormData, isEditMode])

  // Lógica de reset del formulario
  useEffect(() => {
    if (isReset && !isEditMode) {
      form.reset(storeFormData as InitiativeFormData)
      setIsReset(false)
    }
  }, [isReset, form, setIsReset, storeFormData, isEditMode])

  // Cargar datos de edición en el formulario Y EN EL STORE.
  // Esto es clave: al entrar en modo edición, el store se actualiza con los datos
  // de la iniciativa, convirtiéndose en la fuente de verdad y activando la persistencia
  // para la sesión de edición actual.
  useEffect(() => {
    if (isEditMode && initiativeData) {
      const dataForForm = transformApiToFormData(initiativeData)
      // Actualizamos el store, que a su vez actualizará localStorage
      updateFormData(dataForForm)
      // Reseteamos el formulario de RHF para que refleje los nuevos datos del store
      form.reset(dataForForm)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiativeData, isEditMode]) // Se ejecuta solo cuando initiativeData aparece/cambia.

  // 🔧 LÓGICA MEJORADA PARA LIMPIAR ERRORES AUTOMÁTICAMENTE
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && form.formState.errors[name as keyof typeof form.formState.errors]) {
        const currentData = form.getValues()
        let shouldClearError = false

        // ✅ LÓGICA SIMPLIFICADA PARA CAMPOS BÁSICOS
        if (
          [
            "title",
            "motto",
            "mainImage",
            "detailedDescription",
            "problemSolved",
            "marketInfo",
            "productCharacteristics",
          ].includes(name)
        ) {
          const fieldValue = currentData[name as keyof InitiativeFormData] as string
          shouldClearError = !!(fieldValue && fieldValue.trim().length > 0)
        }

        // ✅ LÓGICA PARA ARRAYS
        else if (["tags", "objectives", "coFounderEmails", "seekingProfiles"].includes(name)) {
          const fieldValue = currentData[name as keyof InitiativeFormData] as unknown[]
          shouldClearError = Array.isArray(fieldValue) && fieldValue.length > 0
        }

        // ✅ LÓGICA ESPECIAL PARA CAMPOS OPCIONALES DEL PASO 4
        else if (name.includes("socialNetworks.") || name.includes("externalLinks.")) {
          const fieldValue = value?.[name as keyof typeof value] as string

          // Para campos opcionales: limpiar error si está vacío O si es URL válida
          if (!fieldValue || fieldValue.trim() === "") {
            shouldClearError = true // Vacío es válido para campos opcionales
          } else {
            try {
              new URL(fieldValue)
              shouldClearError = true // URL válida
            } catch {
              shouldClearError = false // URL inválida, mantener error
            }
          }
        }

        // ✅ LÓGICA PARA OBJETOS COMPLETOS OPCIONALES (paso 3, 4 y 5)
        else if (["socialNetworks", "externalLinks", "updates", "roadmapPhases", "coFounderEmails"].includes(name)) {
          shouldClearError = true // Estos campos son completamente opcionales
        }

        if (shouldClearError) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.clearErrors(name as any)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Función para validar si un paso es válido
  const isStepValid = (step: number): boolean => {
    const currentData = form.getValues()

    switch (step) {
      case 1:
        // Validaciones según step1Schema
        return !!(
          currentData.title &&
          currentData.title.trim().length >= 3 &&
          currentData.title.trim().length <= 100 &&
          currentData.motto &&
          currentData.motto.trim().length >= 5 &&
          currentData.motto.trim().length <= 200 &&
          currentData.mainImage &&
          currentData.mainImage.startsWith("http")
        )
      case 2:
        // Validaciones según step2Schema
        return !!(
          currentData.tags &&
          currentData.tags.length >= 1 &&
          currentData.tags.length <= 9 &&
          currentData.detailedDescription &&
          currentData.detailedDescription.length >= 10 &&
          currentData.problemSolved &&
          currentData.problemSolved.length >= 10 &&
          currentData.marketInfo &&
          currentData.marketInfo.length >= 10 &&
          currentData.productCharacteristics &&
          currentData.productCharacteristics.length >= 10 &&
          currentData.objectives &&
          currentData.objectives.length >= 1 &&
          currentData.objectives.length <= 10 &&
          currentData.objectives.every(
            (obj: { description: string }) => obj.description && obj.description.trim().length > 0,
          )
        )
      case 3:
        if (isStep3Optional) return true
        // Validaciones según step3Schema
        return !!(
          // currentData.coFounderEmails &&
          // currentData.coFounderEmails.length >= 1 &&
          // currentData.coFounderEmails.every((cf: string) => cf && cf.includes("@")) &&
          (
            currentData.seekingProfiles &&
            currentData.seekingProfiles.length >= 1 &&
            currentData.seekingProfiles.some((sp: { roles: string[] }) => sp.roles.includes("COLLABORATOR")) &&
            currentData.seekingProfiles.every(
              (sp: {
                roles: string[]
                generalSkills: string[]
                technicalSkills: string[]
                additionalDescription?: string
              }) =>
                sp.roles &&
                sp.roles.length > 0 &&
                sp.generalSkills &&
                sp.generalSkills.length > 0 &&
                sp.technicalSkills &&
                sp.technicalSkills.length > 0,
              // && sp.additionalDescription
              // && sp.additionalDescription.trim().length > 0,
            )
          )
        )
      case 4: {
        // 🔧 PASO 4: Opcional pero si hay contenido debe ser válido
        // Verificar si hay errores en los campos del paso 4
        const hasErrors = !!(form.formState.errors.socialNetworks || form.formState.errors.externalLinks)
        // El paso 4 es válido solo si NO tiene errores
        return !hasErrors
      }
      case 5: {
        // 🔧 PASO 5: Opcional pero sin errores y datos válidos
        const updates = currentData.updates || []
        const roadmapPhases = currentData.roadmapPhases || []

        // Verificar errores solo si hay datos
        const hasErrorsStep5 = !!(form.formState.errors.updates || form.formState.errors.roadmapPhases)

        // Si hay errores, el paso no es válido
        if (hasErrorsStep5) return false

        // Si hay updates, verificar que estén completos (sin trim para ser consistente con schema)
        if (updates.length > 0) {
          const hasIncompleteUpdates = updates.some(
            (update: { title: string; description: string }) => !update.title || !update.description,
          )
          if (hasIncompleteUpdates) return false
        }

        // Si hay roadmapPhases, verificar que estén completos (sin trim para ser consistente con schema)
        if (roadmapPhases.length > 0) {
          const hasIncompletePhases = roadmapPhases.some(
            (phase: { title: string; description: string }) => !phase.title || !phase.description,
          )
          if (hasIncompletePhases) return false
        }

        // El paso 5 es válido: no tiene errores y los datos están completos
        return true
      }
      case 6:
        // Paso de visualización, siempre válido
        return true
      default:
        return false
    }
  }

  // Funciones de navegación
  const goToNextStep = async () => {
    if (canGoToNextStep()) {
      const isValid = isStepValid(currentStep)
      if (isValid) {
        markStepAsCompleted(currentStep)
      }
      setCurrentStep(Math.min(currentStep + 1, 6))
    }
  }

  const goToPreviousStep = () => {
    if (canGoToPreviousStep()) {
      setCurrentStep(Math.max(currentStep - 1, 1))
    }
  }

  const canGoToNextStep = (): boolean => {
    return currentStep < 6 && isStepValid(currentStep)
  }

  const canGoToPreviousStep = (): boolean => {
    return currentStep > 1
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step)
    }
  }

  // Función para enviar el formulario
  const submitForm = async (): Promise<void> => {
    try {
      setIsSubmitting(true)

      const isValid = await form.trigger()
      if (!isValid) {
        throw new Error("Formulario inválido")
      }

      // const formDataToSubmit = form.getValues()

      // Aquí haríamos la llamada a la API
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Limpiar el formulario después del envío exitoso
      resetForm() // Esto resetea el store y triggerea el useEffect de reset

      // Mostrar mensaje de éxito o redirigir
      alert("¡Iniciativa creada exitosamente!")
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      alert("Error al enviar la iniciativa. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contextValue: InitiativeFormContextType = {
    form,
    isStepValid,
    submitForm,
    goToNextStep,
    goToPreviousStep,
    canGoToNextStep,
    canGoToPreviousStep,
    goToStep,
    isEditMode,
    initiativeData,
  }

  return (
    <InitiativeFormContext.Provider value={contextValue}>
      <FormProvider {...form}>{children}</FormProvider>
    </InitiativeFormContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInitiativeForm = (): InitiativeFormContextType => {
  const context = useContext(InitiativeFormContext)
  if (!context) {
    throw new Error("useInitiativeForm debe ser usado dentro de InitiativeFormProvider")
  }
  return context
}
