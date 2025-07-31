import type { ComponentType, ReactNode } from "react"
import ErrorBoundary from "@/components/shared/ErrorBoundary"

/**
 * HOC (Higher-Order Component) que envuelve cualquier componente con un Error Boundary
 * @param WrappedComponent - El componente a envolver
 * @param fallback - Componente de fallback personalizado (opcional)
 * @returns Componente envuelto con Error Boundary
 */
function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  // Preservar el nombre del componente para debugging
  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`

  return WithErrorBoundaryComponent
}

export default withErrorBoundary
