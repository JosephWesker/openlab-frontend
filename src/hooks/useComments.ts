import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "./useApi"
import type {
  CommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  CommentsInfiniteData,
} from "@/interfaces/comments"
import { API_PATH } from "@/lib/constants"

// Hook para obtener comentarios con scroll infinito
export const useComments = (initiativeId: string) => {
  const fetchApi = useApi()

  return useInfiniteQuery({
    queryKey: ["comments", initiativeId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetchApi({
        path: `${API_PATH.INITIATIVE_COMMENTS}?initiativeId=${initiativeId}&page=${pageParam}`,
      })
      console.log('comments response', response)
      return response as CommentsResponse
    },
    getNextPageParam: (lastPage, pages) => {
      // Si no es la última página, devolver el siguiente número de página
      if (!lastPage.last) {
        return pages.length
      }
      return undefined
    },
    initialPageParam: 0,
    enabled: !!initiativeId,
  })
}

// Hook para crear comentarios
export const useCreateComment = () => {
  const fetchApi = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await fetchApi({
        path: API_PATH.INITIATIVE_COMMENTS,
        init: {
          method: "POST",
          body: JSON.stringify(data),
        },
      })
      return response as CreateCommentResponse
    },
    onSuccess: (newComment, variables) => {
      // Optimización: Agregar el comentario directamente sin recargar toda la query
      queryClient.setQueryData(["comments", variables.initiativeId], (oldData: CommentsInfiniteData | undefined) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          // Si no hay datos previos, crear la estructura inicial
          return {
            pages: [
              {
                content: [newComment],
                last: false,
              },
            ],
            pageParams: [0],
          }
        }

        // Agregar el nuevo comentario al principio de la primera página
        const newPages = [...oldData.pages]
        newPages[0] = {
          ...newPages[0],
          content: [newComment, ...newPages[0].content],
        }

        return {
          ...oldData,
          pages: newPages,
        }
      })
    },
  })
}
