import React, { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router"
import { setGlobal404Handler, clearGlobal404Handler } from "@/utils/globalHttpInterceptor"

interface Http404Error {
  url: string
  method: string
  timestamp: Date
}

interface Http404ContextType {
  show404Error: (error: Http404Error) => void
  clear404Error: () => void
  currentError: Http404Error | null
}

const Http404Context = createContext<Http404ContextType | null>(null)

export const useHttp404 = () => {
  const context = useContext(Http404Context)
  if (!context) {
    throw new Error("useHttp404 debe usarse dentro de Http404Provider")
  }
  return context
}

interface Http404PageProps {
  error?: Http404Error
  onClear: () => void
}

const Http404Page: React.FC<Http404PageProps> = ({ onClear }) => {
  const navigate = useNavigate()
  // Ejecutar redirección automáticamente al montar el componente
  useEffect(() => {
    onClear()

    navigate(`/errorh`, { replace: true })
  }, [onClear, navigate])

  // Mostrar mensaje temporal mientras se redirige
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      Redirigiendo a la página de error HTTP...
    </div>
  )
}

interface Http404ProviderProps {
  children: ReactNode
}

export const Http404Provider: React.FC<Http404ProviderProps> = ({ children }) => {
  const [currentError, setCurrentError] = useState<Http404Error | null>(null)

  const show404Error = (error: Http404Error) => {
    setCurrentError(error)
  }

  const clear404Error = () => {
    setCurrentError(null)
  }

  // Registrar el handler global cuando el provider se monta
  useEffect(() => {
    setGlobal404Handler(show404Error)

    return () => {
      clearGlobal404Handler()
    }
  }, [])

  const contextValue: Http404ContextType = {
    show404Error,
    clear404Error,
    currentError,
  }

  if (currentError) {
    return <Http404Page error={currentError} onClear={clear404Error} />
  }

  return <Http404Context.Provider value={contextValue}>{children}</Http404Context.Provider>
}

// HOC para envolver componentes con manejo de 404
export function withHttp404Handler<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithHttp404HandlerComponent = (props: P) => {
    return (
      <Http404Provider>
        <WrappedComponent {...props} />
      </Http404Provider>
    )
  }

  WithHttp404HandlerComponent.displayName = `withHttp404Handler(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`

  return WithHttp404HandlerComponent
}
