import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { InitiativeFormData } from "../schemas/initiativeSchema"

interface InitiativeState {
  currentStep: number
  formData: Partial<InitiativeFormData>
  completedSteps: Set<number>
  isSubmitting: boolean
  hasStartedNavigation: boolean
  isReset: boolean
  initiativeDraftId: number | null

  // Setter para initiativeDraftId
  setInitiativeDraftId: (id: number | null) => void

  // Actions
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<InitiativeFormData>) => void
  markStepAsCompleted: (step: number) => void
  resetForm: () => void
  resetFormInMemory: () => void
  clearStorage: () => void
  setIsSubmitting: (isSubmitting: boolean) => void
  getStepCompletion: (step: number) => boolean
  setHasStartedNavigation: (hasStarted: boolean) => void
  setIsReset: (isReset: boolean) => void
  forceReset: () => void
}

export const INITIAL_STATE_STORE = {
  currentStep: 1,
  formData: {
    // Paso 1 - Campos obligatorios con valores vacíos
    title: "",
    motto: "",
    mainImage: "",
    images: [],

    // Paso 2 - Campos obligatorios con valores por defecto
    tags: [],
    detailedDescription: "",
    problemSolved: "",
    marketInfo: "",
    productCharacteristics: "",
    objectives: [],

    // Paso 3 - Campos REQUERIDOS según schema sagrado
    seekingProfiles: [],

    // Paso 4 - Campos opcionales con objetos según schema sagrado - MEJORADOS
    coFounderEmails: [],
    socialNetworks: {
      linkedin: "",
      facebook: "",
      instagram: "",
      website: "",
      twitter: "",
    },
    externalLinks: {
      discord: "",
      github: "",
      dework: "",
      aragon: "",
      // figma: "",
    },

    // Paso 5 - Campos opcionales con arrays vacíos
    updates: [],
    roadmapPhases: [],
  },
  completedSteps: new Set<number>(),
  isSubmitting: false,
  hasStartedNavigation: false,
  isReset: false,
  initiativeDraftId: null,
}

export const useInitiativeStore = create<InitiativeState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE_STORE,

      setCurrentStep: (step: number) => {
        if (step !== 1) {
          set({ hasStartedNavigation: true })
        }
        set({ currentStep: step })
      },

      updateFormData: (data: Partial<InitiativeFormData>) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }))
      },

      markStepAsCompleted: (step: number) => {
        const completedSteps = new Set(get().completedSteps)
        completedSteps.add(step)
        set({ completedSteps })
      },

      resetForm: () => {
        // Resetear el estado a los valores iniciales y marcar como reset
        set(() => ({
          ...INITIAL_STATE_STORE,
          completedSteps: new Set<number>(),
          isReset: true, // Marcar que se ha hecho un reset
        }))

        // Llamar a la función externa para limpiar el storage
        clearInitiativeStorage()
      },

      resetFormInMemory: () => {
        set(() => ({
          ...INITIAL_STATE_STORE,
          completedSteps: new Set<number>(),
          isReset: false,
        }))
      },

      clearStorage: () => {
        localStorage.removeItem("initiative-storage")
        set(() => ({
          ...INITIAL_STATE_STORE,
          completedSteps: new Set<number>(),
        }))
      },

      setIsSubmitting: (isSubmitting: boolean) => {
        set({ isSubmitting })
      },

      getStepCompletion: (step: number) => {
        return get().completedSteps.has(step)
      },

      setHasStartedNavigation: (hasStarted: boolean) => {
        set({ hasStartedNavigation: hasStarted })
      },

      setIsReset: (isReset: boolean) => {
        set({ isReset })
      },

      setInitiativeDraftId: (id: number | null) => {
        set({ initiativeDraftId: id })
      },

      /** Resetea todo y borra storage, incluso en /update */
      forceReset: () => {
        set({
          ...INITIAL_STATE_STORE,
          completedSteps: new Set<number>(),
        })
        // Borrar directamente la key, sin pasar por el storage custom
        localStorage.removeItem("initiative-storage")
      },
    }),
    {
      name: "initiative-storage",
      partialize: (state) => ({
        formData: state.formData,
        completedSteps: Array.from(state.completedSteps),
        currentStep: state.currentStep,
        hasStartedNavigation: state.hasStartedNavigation,
        initiativeDraftId: state.initiativeDraftId,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window !== "undefined" && window.location.pathname.includes("/update")) {
            return null
          }
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)

          // 🔧 DESERIALIZAR FECHAS CORRECTAMENTE
          const deserializeFormData = (formData: Record<string, unknown>) => {
            if (!formData) return formData

            // Deserializar updates
            if (formData.updates && Array.isArray(formData.updates)) {
              formData.updates = formData.updates.map((update: Record<string, unknown>) => ({
                ...update,
                createdAt: update.createdAt ? new Date(update.createdAt as string) : new Date(),
              }))
            }

            // Deserializar roadmapPhases si tienen fechas en el futuro
            if (formData.roadmapPhases && Array.isArray(formData.roadmapPhases)) {
              formData.roadmapPhases = formData.roadmapPhases.map((phase: Record<string, unknown>) => ({
                ...phase,
                // Si en el futuro agregamos fechas a roadmap
                date: phase.date ? new Date(phase.date as string) : undefined,
              }))
            }

            return formData
          }

          return {
            ...parsed,
            state: {
              ...parsed.state,
              formData: deserializeFormData(parsed.state.formData),
              completedSteps: new Set(parsed.state.completedSteps || []),
            },
          }
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined" && window.location.pathname.includes("/update")) {
            return
          }
          const serialized = JSON.stringify({
            ...value,
            state: {
              ...value.state,
              completedSteps: Array.from(value.state.completedSteps || []),
              initiativeDraftId: value.state.initiativeDraftId,
            },
          })
          localStorage.setItem(name, serialized)
        },
        removeItem: (name) => {
          if (typeof window !== "undefined" && window.location.pathname.includes("/update")) {
            return
          }
          localStorage.removeItem(name)
        },
      },
    },
  ),
)

// Función auxiliar para limpiar el storage usando la API de persist
export const clearInitiativeStorage = () => {
  try {
    // Usar la API oficial de Zustand persist para limpiar
    useInitiativeStore.persist.clearStorage()
  } catch {
    // Fallback manual si hay algún problema
  }
}
