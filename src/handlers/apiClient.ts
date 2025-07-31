export interface ApiOptions extends RequestInit {
  queryParams?: Record<string, string>
  parseAs?: 'json' | 'text' | 'blob' | 'arrayBuffer'
}

export function createApiClient(getToken: () => Promise<string | null>) {
  return async function <T>(
    path: string,
    { queryParams, headers, parseAs = 'json', ...options }: ApiOptions = {}
  ): Promise<T> {
    let url = `${import.meta.env.VITE_API_URL}${path}`
    if (queryParams) {
      const qs = new URLSearchParams(queryParams).toString()
      url += `?${qs}`
    }

    const token = await getToken()

    const mergedHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    }

    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    })

    if (!response.ok) {
      // intentar JSON, si falla, leer texto
      let errorMessage = `API error ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData?.message || errorMessage
      } catch {
        const text = await response.text()
        errorMessage = text || errorMessage
      }
      throw new Error(errorMessage)
    }

    switch (parseAs) {
      case 'text':
        return await response.text() as unknown as T
      case 'blob':
        return await response.blob() as unknown as T
      case 'arrayBuffer':
        return await response.arrayBuffer() as unknown as T
      case 'json':
      default:
        return await response.json()
    }
  }
}
