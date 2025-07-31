import { API_PATH } from "@/lib/constants"
import { create } from "zustand"

interface SkillsStore {
  skills: {
    general: string[]
    technical: string[]
  }
  setSkills: (fetchApi: ({ path }: { path: string }) => Promise<unknown>) => void
}

export const useSkillsStore = create<SkillsStore>((set) => ({
  skills: {
    general: [],
    technical: [],
  },
  setSkills: async (fetchApi) => {
    try {
      const [skillsGeneral, skillsTechnical] = await Promise.all([
        fetchApi({
          path: API_PATH.SKILLS_GENERAL,
        }),
        fetchApi({
          path: API_PATH.SKILLS_TECHNICAL,
        }),
      ])

      set({ skills: { general: skillsGeneral as string[], technical: skillsTechnical as string[] } })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ skills: { general: [], technical: [] } })
    }
  },
}))
