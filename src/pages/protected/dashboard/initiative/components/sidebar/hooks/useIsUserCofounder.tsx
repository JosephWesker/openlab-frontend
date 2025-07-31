import { useState, useEffect } from "react"
import { type Initiative } from "../../../schemas/initiativeSchema"
// import { useInitiativeApi } from "../../../stores/initiativeStore"
// import type { ApplicationsResponseDTO } from "../../../schemas/applicationsSchema"

interface Collaborator {
  email: string
  initiativeId: number
}

export function useIsUserCofounder(
  initiative: Initiative,
  userEmail?: string
): { isCofounder: boolean, isApplicant: boolean, loading: boolean } {
  // const { getInitiativeApplications} = useInitiativeApi()

  const [isCofounder, setIsCofounder] = useState(false)
  const [isApplicant, setIsApplicant] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!userEmail) {
        setLoading(false)
        return
      }

      let isCofounderLocal = false
      let isApplicantLocal = false

      // 1. Check initiative collaborators
      const found = initiative.collaborators.find(
        (collaborator) =>
          collaborator.email === userEmail && collaborator.role === 'COFOUNDER'
      )
      if (found) {
        isCofounderLocal = true
      }

      // 2. Check localStorage
      if (!isCofounderLocal) {
        const stored = localStorage.getItem('user_cofounding')
        if (stored) {
          const storedUser = JSON.parse(stored)
          const foundInStorage = storedUser.find((collaborator: Collaborator) =>
            collaborator.email === userEmail && collaborator.initiativeId === initiative.id
          )
          if (foundInStorage) {
            isApplicantLocal = true
          }
        }
      }

      // 3. Check API if still not cofounder
      if (!isCofounderLocal && !isApplicantLocal) {
        // try {
        //   const response = await getInitiativeApplications(initiative.id)

        //   const parsed = ApplicationsResponseDTO.safeParse(response)

        //   if (!parsed.success) {
        //     throw new Error('Ocurrió un error inesperado al conseguir las postulaciones del usuario')
        //   }

        //   const foundInApi = parsed.data.find(application => application.email === userEmail && application.status === "true")
        //   if (foundInApi) {
        //     isApplicantLocal = true
        //   }
        // } catch (err) {
        //   console.error("Ocurrió un error inesperado al conseguir las postulaciones del usuario", err)
        // }
      }

      setIsCofounder(isCofounderLocal)
      setIsApplicant(isApplicantLocal)
      setLoading(false)
    }

    checkUserStatus()
  }, [initiative, userEmail])

  return { isCofounder, isApplicant, loading }
}
