import { useInfiniteQuery } from '@tanstack/react-query'
// import { getAuth0Token } from '@/utils/auth0Token'
// import type { Auth0ContextInterface } from '@auth0/auth0-react'
import type { InitiativePaged } from '../../initiative/schemas/initiativeSchema'
import { useAuth0 } from '@auth0/auth0-react'
import { API_PATH } from '@/lib/constants'

export function useInitiatives(stateFilter: string, size = 6) {
  const { getIdTokenClaims } = useAuth0()

  // <InitiativePaged, Error, InitiativePaged, _ , number>
  return useInfiniteQuery<InitiativePaged, Error>({
    queryKey: ['initiatives', stateFilter],
    // enabled: !!auth0, // para que no dispare hasta tener auth0
    queryFn: async ({ pageParam = 0 }) => {
      // const token = await getAuth0Token(auth0)
      const { __raw: token } = (await getIdTokenClaims()) || {}

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_HOME}?page=${pageParam}&size=${size}&state=${stateFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }
      return res.json()
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length
    },
    // keepPreviousData: true,
    initialPageParam: 0,
    retry: 1
  })
}