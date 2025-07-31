// Interceptor global para detectar errores HTTP 404 en CUALQUIER petición
// Funciona como un "ErrorBoundary" pero para peticiones HTTP

interface Http404Error {
  url: string
  method: string
  timestamp: Date
}

// Variable global para almacenar el handler de errores 404
let global404Handler: ((error: Http404Error) => void) | null = null

// Función para registrar el handler global
export const setGlobal404Handler = (handler: (error: Http404Error) => void) => {
  global404Handler = handler
}

// Función para limpiar el handler
export const clearGlobal404Handler = () => {
  global404Handler = null
}

// Función para inicializar el interceptor global
export const initGlobalHttpInterceptor = () => {
  // Guardar referencia original de fetch
  const originalFetch = window.fetch

  // Sobrescribir fetch globalmente
  window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
    // Ejecutar la petición original
    const response = await originalFetch.apply(this, args)

    // Detectar errores 404
    if (response.status === 404 && global404Handler) {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url
      const method = args[1]?.method || "GET"

      // Llamar al handler global
      global404Handler({
        url,
        method,
        timestamp: new Date(),
      })
    }

    return response
  }
}

// Auto-inicializar en desarrollo
if (typeof window !== "undefined") {
  initGlobalHttpInterceptor()
}
