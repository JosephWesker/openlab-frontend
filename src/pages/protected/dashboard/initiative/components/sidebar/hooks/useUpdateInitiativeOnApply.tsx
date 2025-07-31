import { useEffect, useState } from 'react'
import { useInitiativeApi } from '../../../stores/initiativeStore'
import { Initiative } from '../../../schemas/initiativeSchema'

export function useUpdateInitiative(statusChanged: boolean, initiativeId: number) {
  const [updatedInitiative, setData] = useState<Initiative>()
  const [isGettingInitiative, setGettingInitiative] = useState(false)
  const { getInitiative} = useInitiativeApi()

  useEffect(() => {
    const getInitiativeData = async () => {
      if (isGettingInitiative) return

      try {
        const response = await getInitiative(initiativeId)

        const parsed = Initiative.safeParse(response)
        // console.log(response)

        if (!parsed.success) {
          // showSnackbar({
          //   title: "Servicio no disponible",
          //   message: "Servicio no disponible",
          //   severity: "error",
          // })
          throw new Error('Ocurrió un error inesperado al abrir la iniciativa, intenta de nuevo más tarde.')
        }

        setData(parsed.data)

      } catch (err) {
        if (err instanceof Error){
          // console.log('err.message', err.message)
          // showSnackbar({
          //   title: "Ups, algo salio mal",
          //   message: "Ups, algo salio mal",
          //   severity: "error",
          // })
        }
      } finally {
        setGettingInitiative(false)
      }
    }

    getInitiativeData()
  }, [statusChanged])

  return { updatedInitiative }
}