import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import type { InitiativePaged } from '../../initiative/schemas/initiativeSchema'
// import { useDebounce } from './useDebounce'
import { API_PATH } from '@/lib/constants'
import { useDebounce } from '@/hooks/useDebounce'
import { communityEvents } from '@/lib/clarityEvents'

export function useSearchInitiatives(searchQuery: string, size = 6) {
  const { getIdTokenClaims } = useAuth0()
  const debouncedQuery = useDebounce(searchQuery, 500)

  return useInfiniteQuery<InitiativePaged, Error>({
    queryKey: ['search-initiatives', debouncedQuery],
    enabled: !!debouncedQuery.trim(), // solo dispara si hay texto
    queryFn: async ({ pageParam = 0 }) => {
      const { __raw: token } = (await getIdTokenClaims()) || {}

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_SEARCH}?page=${pageParam}&size=${size}&search=${debouncedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      // registro de evento de busqueda
      communityEvents.searchUsed({ searchQuery: debouncedQuery })

      return res.json()
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.last ? undefined : allPages.length
    },
    initialPageParam: 0,
    staleTime: 1000 * 60,
    retry: 1
  })
}
