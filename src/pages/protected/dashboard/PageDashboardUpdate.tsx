import { useLocation, Navigate } from "react-router"
import { useEffect } from "react"
import { useInitiativeStore } from "@/stores/initiativeStore"
import { InitiativeFormProvider } from "@/context/InitiativeFormContext"
import InitiativeStepper from "@/components/initiative/InitiativeStepper"
import type { Initiative } from "@/interfaces/initiative"

export default function PageDashboardUpdate() {
  const location = useLocation()

  // Al entrar en modo edición limpiamos el estado en memoria para evitar
  // que se muestren datos de la creación previa, pero SIN tocar localStorage.
  useEffect(() => {
    useInitiativeStore.getState().resetFormInMemory()
  }, [])

  const initiativeData = location.state?.initiative as Initiative | undefined
  const targetStep = location.state?.targetStep as number | undefined

  // Si hay un targetStep específico, configurarlo después de que se cargue la iniciativa
  useEffect(() => {
    if (targetStep && targetStep >= 1 && targetStep <= 6) {
      // Usar setTimeout para asegurar que la iniciativa se haya cargado primero
      const timer = setTimeout(() => {
        useInitiativeStore.getState().setCurrentStep(targetStep)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [targetStep])

  // Si no hay datos de iniciativa en el estado (p. ej., acceso directo a la URL),
  // redirigir a la lista para evitar errores.
  if (!initiativeData) {
    return <Navigate to="/list" replace />
  }

  // Si todo está bien, renderizamos el formulario en modo edición
  return (
    <InitiativeFormProvider initiativeData={initiativeData}>
      <InitiativeStepper isEditMode />
    </InitiativeFormProvider>
  )
}
