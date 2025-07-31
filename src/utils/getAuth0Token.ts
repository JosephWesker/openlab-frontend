import { type Auth0ContextInterface } from '@auth0/auth0-react'

export const getAuth0Token = async (auth0: Auth0ContextInterface): Promise<string> => {
  const claims = await auth0.getIdTokenClaims()
  return claims?.__raw || ''
}