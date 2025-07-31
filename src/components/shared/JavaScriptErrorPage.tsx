import React from "react"
import { useNavigate } from "react-router"
import UnifiedErrorPage from "./UnifiedErrorPage"

/**
 * Página de error para errores de JavaScript capturados por ErrorBoundary
 * Al estar dentro del dashboard como ruta, mantiene Header y Sidebar automáticamente
 */
const JavaScriptErrorPage: React.FC = () => {
  const navigate = useNavigate()

  // Usar configuración por defecto de ERROR_CONFIGS sin pasar props personalizados

  const handleGoHome = () => {
    navigate("/", { replace: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <UnifiedErrorPage
      errorType="javascript"
      onPrimaryAction={handleGoHome}
      onSecondaryAction={handleRefresh}
    />
  )
}

export default JavaScriptErrorPage
