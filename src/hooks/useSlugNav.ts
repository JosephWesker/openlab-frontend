// import type { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
import { useGlobal } from "@/context/GlobalContext"
import type { ApiNotification } from "@/context/NotificationApiContext"
import type { UserResponseInitiative, UserResponseVotedInitiative } from "@/interfaces/api/user-response"
import type { InitiativeAdminView } from "@/interfaces/initiative"
import { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
import { useNavigate } from "react-router"
// import { useInitiativeWithFallback } from "./useInitiativeWithFallack"
// import GlobalStyles from '@mui/material/GlobalStyles';

export function useSlugNavigation() {
  const navigate = useNavigate()
  // const { getInitiativeWithFallback } = useInitiativeWithFallback()
  const { setData } = useGlobal()

  // const slugify = (title: string) =>
  //   title
  //     .trim() // Remove blank spaces at the end and start
  //     .normalize("NFD") // Decompose accents
  //     .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
  //     .replace(/[^a-zA-Z0-9.:]+/g, "-") // Replace non-alphanumerics (except dot) with hyphen
  //     .replace(/(^-|-$)/g, "") // Remove leading/trailing hyphens

  const slugify = (title: string) =>
    title
      .trim()
      .replace(/[^\p{L}\p{N}.:]+/gu, "-")
      .replace(/(^-|-$)/g, "")

  const goToInitiative = async (
    initiative:
      | Initiative
      | UserResponseInitiative
      | UserResponseVotedInitiative
      | InitiativeAdminView
      | ApiNotification["initiative"]
      | {
          id: number
          title: string
          img: string
          state: string
          description: string
          date: string
          roles: string[]
        },
    tabName?: string,
    isDraft?: boolean,
  ) => {
    // const goToInitiative = async (initiativeId: number, initiativeTitle: string, tabName?: string, isDraft?: boolean) => {
    if (isDraft) {
      // setGlobalDraftInitiative(initiative)
      setData({
        initiative: initiative as Initiative,
      })

      // if (!initiative.title) return
      const slug = slugify(initiative.title)
      const url = `/initiative-draft/${slug}${tabName ? `?tab=${tabName}` : ""}`
      // const url = `/initiative-draft/${slug}-${initiative.id}${tabName ? `?tab=${tabName}` : ""}`
      // navigate(url, { state: { initiative: initiative } })
      navigate(url)
      return
    } else {
      if (!initiative.title) return
      const slug = slugify(initiative.title)
      console.log("slug", slug)
      navigate(`/initiatives/${slug}${tabName ? `?tab=${tabName}` : ""}`)
      // navigate(`/initiatives/${slug}-${initiative.id}${tabName ? `?tab=${tabName}` : ""}`)
    }
  }

  return { goToInitiative }
}
