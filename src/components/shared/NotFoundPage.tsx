import React from "react"
import { useNavigate } from "react-router"
import UnifiedErrorPage from "./UnifiedErrorPage"

/**
 * Componente para manejar rutas no encontradas (404)
 * Como está dentro de LayoutDashboard, automáticamente mantiene Header y Sidebar
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/", { replace: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <UnifiedErrorPage
      errorType="404"
      onPrimaryAction={handleGoHome}
      onSecondaryAction={handleRefresh}
    />
  )
}

export default NotFoundPage
