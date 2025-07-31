// import { type Auth0ContextInterface } from '@auth0/auth0-react'

import { createApiClient } from "@/handlers/apiClient"
import { useAuth0 } from "@auth0/auth0-react"

// export const getAuth0Token = async (auth0: Auth0ContextInterface): Promise<string> => {
//   const claims = await auth0.getIdTokenClaims()
//   return claims?.__raw || ''
// }

// import { createApiClient } from "@/handlers/apiClient"
// import { useAuth0 } from "@auth0/auth0-react"
// // import { createApiClient } from "@/api/client"

// export function useApiClient() {
//   const { getAccessTokenSilently } = useAuth0()

//   // Creamos el apiClient con un getter del token
//   return createApiClient(() => getAccessTokenSilently())
// }

export function useApiClient() {
  const { getIdTokenClaims } = useAuth0()

  return createApiClient(async () => {
    const claims = await getIdTokenClaims()
    return claims?.__raw || null
  })
}