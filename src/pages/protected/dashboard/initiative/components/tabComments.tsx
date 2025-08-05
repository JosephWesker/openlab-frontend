import React, { useState, useEffect, useRef } from "react"
// import { Box, Typography, TextField, Button, Avatar, Paper, Container, IconButton, useTheme, CardContent } from "@mui/material"
import { Send, Close } from "@mui/icons-material"
// import { motion, AnimatePresence } from "motion/react"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useComments, useCreateComment } from "@/hooks/useComments"
import type { Comment } from "@/interfaces/comments"
import { LoadingScreen } from "@/components/ui/LoadingTransition"
import type { Initiative } from "../schemas/initiativeSchema"
import Paper from "@mui/material/Paper"
import { useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import IconButton from "@mui/material/IconButton"
import commentsImg from "@/assets/images/initiative-detail/comments.svg"
import { engagementEvents } from "@/lib/clarityEvents"

// interface SimpleUser {
//   name?: string
//   image?: string
// }

interface CommentItemProps {
  comment: Comment
  index: number
  // currentUser?: SimpleUser
}

// Spinner para scroll infinito basado en SpinnerTest actualizado
const InfiniteScrollSpinner: React.FC<{ size?: number }> = ({ size = 50 }) => {
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  return (
    <svg viewBox="0 0 200 200" style={{ width: size, height: size }}>
      <circle fill={primaryColor} stroke={primaryColor} strokeWidth="15" r="15" cx="40" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4"
        />
      </circle>
      <circle fill={primaryColor} stroke={primaryColor} strokeWidth="15" r="15" cx="100" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2"
        />
      </circle>
      <circle fill={primaryColor} stroke={primaryColor} strokeWidth="15" r="15" cx="160" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2"
          values="1;0;1;"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0"
        />
      </circle>
    </svg>
  )
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, index }) => {
  return (
    <Paper
      key={index}
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
        borderLeft: "4px solid",
        borderLeftColor: "primary.main",
        transition: "all 0.2s ease",
        "&:hover": {
          elevation: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Fecha arriba como header */}
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", mb: 1, display: "block" }}>
        {/* Hace 8 horas */}
        {comment.time}
      </Typography>

      {/* Avatar + Nombre en línea horizontal */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Avatar
          src={comment.user.profilePic}
          sx={{
            width: 30,
            height: 30,
            bgcolor: "primary.light",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          {comment.user.name}
        </Avatar>

        <Typography variant="subtitle2" fontWeight="600" color="text.primary">
          {comment.user.name}
        </Typography>
      </Box>

      {/* Comentario abajo */}
      <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.5, fontSize: "0.95rem" }}>
        {comment.comment}
      </Typography>
    </Paper>
  )
}

// Loader para scroll infinito con espacio fijo
const InfiniteLoader: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 100, // Altura fija para evitar cambios abruptos
      py: 2,
      gap: 1,
    }}
  >
    <InfiniteScrollSpinner size={40} />
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
      Cargando más comentarios...
    </Typography>
  </Box>
)

export default function TabComments({ initiative }: { initiative: Initiative }) {
  const { userFromApi } = useAuthContext()
  const [newComment, setNewComment] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isFetchingRef = useRef(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useComments(
    initiative.id.toString(),
  )

  const createCommentMutation = useCreateComment()

  // Actualizar el ref cuando cambia el estado de fetching
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage
  }, [isFetchingNextPage])

  // Scroll infinito con Intersection Observer mejorado
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      // Múltiples verificaciones para evitar peticiones duplicadas
      if (entry.isIntersecting && hasNextPage && !isFetchingRef.current && !isLoading) {
        console.log("🚀 Triggering fetchNextPage") // Para debug
        isFetchingRef.current = true
        fetchNextPage().finally(() => {
          // Pequeño delay para evitar disparos inmediatos
          setTimeout(() => {
            isFetchingRef.current = false
          }, 100)
        })
      }
    }

    // Limpiar observer previo si existe
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Crear nuevo observer con configuración optimizada
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "50px", // Disparar un poco antes de llegar al elemento
    })

    // Observar el elemento si existe
    if (loadMoreRef.current && observerRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasNextPage, isLoading]) // Solo depende de hasNextPage e isLoading

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !userFromApi) return

    try {
      setIsPublishing(true)

      const response = await createCommentMutation.mutateAsync({
        comment: newComment.trim(),
        initiativeId: initiative.id.toString(),
      })

      engagementEvents.commentSubmitted({
        initiativeId: initiative.id.toString(),
        title: initiative.title,
      })

      console.log("response new comment", response)

      // Eliminar el delay del fade in para que aparezca inmediatamente
      setNewComment("")

      // Scroll al top para ver el nuevo comentario
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
      }
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleClearComment = () => {
    setNewComment("")
  }

  const allComments = data?.pages.flatMap((page) => page.content) || []

  if (isError) {
    return (
      <Container maxWidth={false} sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="error">
            Error al cargar los comentarios
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Por favor, intenta recargar la página
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-4 p-0">
      <Box>
        <Typography className="font-semibold text-2xl text-[#304578]">Comentarios</Typography>
      </Box>
      <Box
        sx={
          {
            // mb: 4,
            // maxWidth: {
            //   xs: "100%",
            //   // md: "75%",
            // },
          }
        }
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="body1" fontWeight="500" sx={{ flex: 1 }}>
            Escribe un comentario
          </Typography>
          {newComment.trim() && (
            <IconButton
              size="small"
              onClick={handleClearComment}
              sx={{
                width: 28,
                height: 28,
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          maxRows={2}
          placeholder="Comparte tu opinión..."
          variant="standard"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isPublishing}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmitComment()
            }
          }}
          sx={{
            mb: 2,
            "& .MuiInput-root": {
              fontSize: "1rem",
              "&:before": {
                borderBottomColor: "divider",
              },
              "&:hover:before": {
                borderBottomColor: "primary.main",
              },
              "&.Mui-focused:after": {
                borderBottomColor: "primary.main",
              },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Send />}
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isPublishing}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
              opacity: !newComment.trim() ? 0.6 : 1,
              transition: "all 0.3s ease",
              color: "white !important",
              "&:disabled": {
                backgroundColor: "action.disabled",
              },
            }}
          >
            {isPublishing ? "Comentando..." : "Comentar"}
          </Button>
        </Box>
      </Box>

      {/* Comments List */}
      <Box
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "divider",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "text.secondary",
            },
          },
        }}
        ref={scrollContainerRef}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              width: "100%",
            }}
          >
            <LoadingScreen noFixed />
          </Box>
        ) : allComments.length === 0 ? (
          <Box sx={{ textAlign: "center" }} className="flex flex-col items-center">
            {/* <ChatBubbleOutline sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No hay comentarios aún
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ¡Sé el primero en comentar en esta iniciativa!
                    </Typography> */}

            <Card className="flex flex-col items-center rounded-2xl max-w-xs p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
              <Box component="img" src={commentsImg}></Box>
              <Typography className="text-(--color-primary) font-medium text-sm">Inicia la Conversación</Typography>
              <Typography className="text-xs text-[#304578] text-center">
                Tu perspectiva puede ser la pieza que faltaba. ¡Sé el primero en comentar!
              </Typography>
            </Card>
          </Box>
        ) : (
          <>
            {allComments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                index={index}
                // currentUser={userFromApi || undefined}
              />
            ))}

            {/* /* Espacio fijo para el loader del scroll infinito - solo si hay más páginas */}
            {hasNextPage && (
              <Box ref={loadMoreRef} sx={{ minHeight: 100 }}>
                {isFetchingNextPage && <InfiniteLoader />}
              </Box>
            )}

            {/* Espacio adicional al final para mejor UX */}
            <Box sx={{ height: 40 }} />
          </>
        )}
      </Box>
    </Container>
  )
}
