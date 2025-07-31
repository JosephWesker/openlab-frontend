import { InitiativeFormProvider } from "@/context/InitiativeFormContext"
import { useEffect, useState } from "react"
import { useInitiativeStore } from "@/stores/initiativeStore"
import InitiativeStepper from "@/components/initiative/InitiativeStepper"

export default function PageDashboardAdd() {
  // Siempre rehidratar al entrar para asegurarnos de recuperar la data
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let isMounted = true
    Promise.resolve(useInitiativeStore.persist.rehydrate()).finally(() => {
      if (isMounted) setHydrated(true)
    })
    return () => {
      isMounted = false
    }
  }, [])

  if (!hydrated) return null // puedes mostrar un loader

  return (
    <InitiativeFormProvider>
      <InitiativeStepper />
    </InitiativeFormProvider>
  )
}
