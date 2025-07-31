import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OnboardingData {
  name?: string
  roles?: string[]
  skillsGeneral?: string[]
  newlyCreatedGeneralSkills?: string[]
}

interface OnboardingStore {
  data: OnboardingData
  updateData: (newData: Partial<OnboardingData>) => void
  clearData: () => void
  onboardingCompleted: boolean
  setOnboardingCompleted: (onboardingCompleted: boolean) => void
}

const initialData: OnboardingData = {
  name: "",
  roles: [],
  skillsGeneral: [],
  newlyCreatedGeneralSkills: [],
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: initialData,
      onboardingCompleted: false,

      updateData: (newData: Partial<OnboardingData>) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      clearData: () => set({ data: initialData }),

      setOnboardingCompleted: (onboardingCompleted: boolean) => set({ onboardingCompleted }),
    }),
    {
      name: "openlab-onboarding-storage",
      version: 1,
    },
  ),
)
