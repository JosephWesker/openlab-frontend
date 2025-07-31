import { useLocation } from "react-router"
import { useEffect } from "react"
import { clarity } from "react-microsoft-clarity"

// Declaración de tipo para window.clarity
declare global {
  interface Window {
    clarity: (action: "trackPageview" | "identify" | "set" | "event", ...args: unknown[]) => void
  }
}

export function useClarityPageview() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Función para intentar el tracking con reintentos
    const attemptTracking = (retries = 3) => {
      if (clarity.hasStarted()) {
        // Verificar que window.clarity existe y tiene la función trackPageview
        if (typeof window !== "undefined" && window.clarity && typeof window.clarity === "function") {
          try {
            window.clarity("trackPageview")
          } catch (error) {
            console.warn("Error al enviar pageview a Clarity:", error)
          }
        } else if (retries > 0) {
          // Si clarity no está listo, intentar de nuevo después de un breve delay
          setTimeout(() => attemptTracking(retries - 1), 100)
        }
      }
    }

    attemptTracking()
  }, [pathname, search])
}
