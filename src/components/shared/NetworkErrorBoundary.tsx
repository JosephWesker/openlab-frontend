import React, { useState, useEffect } from "react"
import type { ReactNode } from "react"
import UnifiedErrorPage from "./UnifiedErrorPage"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

const NetworkErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    // Agregar event listeners para detectar cambios de conexión
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOffline) {
    // Si se proporciona un fallback personalizado, úsalo
    if (fallback) {
      return fallback
    }

    // Mostrar directamente la página de error de red
    return (
      <UnifiedErrorPage
        errorType="network"
        onPrimaryAction={() => window.location.reload()}
        onSecondaryAction={() => window.location.href = '/'}
      />
    )
  }

  return children
}

export default NetworkErrorBoundary
