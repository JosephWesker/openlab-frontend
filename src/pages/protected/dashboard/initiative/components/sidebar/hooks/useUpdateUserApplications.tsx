import { useEffect, useState } from 'react'
import { useInitiativeApi } from '../../../stores/initiativeStore'
import { ApplicationsResponseDTO } from '../../../schemas/initiativeSchema'
import { useAuthContext } from '@/hooks/useAuthContext'

export function useUpdateUserApplications(statusChanged: boolean, initiativeId: number) {
  const [updatedUserApplications, setData] = useState<ApplicationsResponseDTO>([])
  const [isGettingApplications, setGettingApplications] = useState(false)
  const { getInitiativeApplications} = useInitiativeApi()

  const { userFromApi } = useAuthContext()
  const userId = userFromApi?.id ?? "" // ToDo: Auth Context must retrieve non optional/undefined values

  useEffect(() => {
    const getInitiativeApplicationsQuery = async () => {
      if (isGettingApplications) return

      try {
        const response = await getInitiativeApplications(initiativeId)

        const parsed = ApplicationsResponseDTO.safeParse(response)
        // console.log(response)

        if (!parsed.success) {
          throw new Error('Ocurrió un error inesperado al abrir la iniciativa, intenta de nuevo más tarde.')
        }

        // setData(parsed.data)
        const filtered = parsed.data.filter((app) => app.userId === userId)
        setData(filtered)

      } catch (err) {
        if (err instanceof Error){
          console.log('err.message', err.message)
        }
      } finally {
        setGettingApplications(false)
      }
    }

    getInitiativeApplicationsQuery()
  }, [statusChanged])

  return { updatedUserApplications }
}