import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import UnifiedErrorPage from "./UnifiedErrorPage"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que la próxima renderización muestre la interfaz de error
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de logging aquí
    console.error("Error capturado por ErrorBoundary:", error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
    // Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, úsalo
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Mostrar directamente la página de error JavaScript
      return (
        <UnifiedErrorPage
          errorType="javascript"
          onPrimaryAction={() => window.location.href = '/'}
          onSecondaryAction={() => window.location.reload()}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
