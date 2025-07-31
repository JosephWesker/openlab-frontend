import React from "react"
import {
  Modal,
  Fade,
  Backdrop,
  Paper,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  Box,
} from "@mui/material"
import {
  Close,
  GitHub,
  LinkedIn,
  Facebook,
  Instagram,
  Twitter,
  Chat,
  Web,
  HowToVote,
  Comment,
  RocketLaunch,
} from "@mui/icons-material"
import { motion } from "motion/react"
import { useApi } from "@/hooks/useApi"
import { useQuery } from "@tanstack/react-query"
import { API_PATH } from "@/lib/constants"
import { userMapperWithActivity } from "@/mapper/user-mapper"
import type { UserEntityWithActivity } from "@/interfaces/user"
import type { UserResponseWithActivity } from "@/interfaces/api/user-response"
import { useSlugNavigation } from "@/hooks/useSlugNav"

// Helper para line-clamp
const lineClampStyle = (lines: number) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  overflow: "hidden",
  textOverflow: "ellipsis",
})

interface UserProfileModalProps {
  userId: number | null
  open: boolean
  onClose: () => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, open, onClose }) => {
  const fetchApi = useApi()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserEntityWithActivity>({
    queryKey: ["userProfileWithActivity", userId],
    queryFn: async () => {
      const response = (await fetchApi({
        path: `${API_PATH.USER}/${userId}`,
      })) as UserResponseWithActivity
      return userMapperWithActivity(response)
    },
    enabled: !!userId && open,
  })

  const skills = user?.skills || []

  const socials = [
    { id: 1, icon: GitHub, url: user?.social.github, label: "GitHub", color: "#333" },
    { id: 2, icon: LinkedIn, url: user?.social.linkedIn, label: "LinkedIn", color: "#0077b5" },
    { id: 3, icon: Facebook, url: user?.social.facebook, label: "Facebook", color: "#1877f2" },
    { id: 4, icon: Instagram, url: user?.social.instagram, label: "Instagram", color: "#e4405f" },
    { id: 5, icon: Twitter, url: user?.social.twitter, label: "Twitter", color: "#1da1f2" },
    { id: 6, icon: Chat, url: user?.social.discord, label: "Discord", color: "#7289da" },
    { id: 7, icon: Web, url: user?.social.other, label: "Web", color: "#6366f1" },
  ].filter((social) => social.url)

  const activityStats = user
    ? [
        { label: "Iniciativas propuestas", value: user.initiatives, icon: RocketLaunch, color: "#3b82f6" },
        { label: "Comentarios", value: user.comments, icon: Comment, color: "#f59e0b" },
        { label: "Votos emitidos", value: user.votes, icon: HowToVote, color: "#ef4444" },
      ]
    : []

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  const { goToInitiative } = useSlugNavigation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600, md: 850 },
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: 4,
            p: 3, // Padding general del modal
            boxShadow: 24,
            outline: "none",
          }}
        >
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <Close />
          </IconButton>

          {isLoading && <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}
          {isError && <Typography color="error">Error al cargar el perfil.</Typography>}

          {user && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
              {/* Left Column */}
              <Box sx={{ width: { xs: "100%", md: "35%" }, textAlign: "center" }}>
                <Avatar src={user.image} sx={{ width: 90, height: 90, fontSize: "2rem", mx: "auto", mb: 1 }}>
                  {getInitials(user.name)}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {user.name}
                </Typography>

                <Stack spacing={2}>
                  {/* Redes Sociales */}
                  <Box>
                    {/* <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                      Redes
                    </Typography> */}
                    {socials.length > 0 ? (
                      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
                        {socials.map((social) => (
                          <IconButton
                            key={social.id}
                            component="a"
                            href={social.url!}
                            target="_blank"
                            sx={{
                              color: social.color,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: social.color,
                                color: "white",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <social.icon fontSize="small" />
                          </IconButton>
                        ))}
                      </Stack>
                    ) : (
                      <Chip label="Sin redes" size="small" variant="outlined" />
                    )}
                  </Box>

                  {/* Descripción */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                      Descripción
                    </Typography>
                    {user?.description ? (
                      <Typography variant="body2" color="text.secondary" sx={{ ...lineClampStyle(3) }}>
                        {user.description}
                      </Typography>
                    ) : (
                      <Chip label="Sin descripción" size="small" variant="outlined" />
                    )}
                  </Box>

                  {/* Habilidades */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                      Habilidades
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
                      {skills.length > 0 ? (
                        skills.map((skill: string) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
                          />
                        ))
                      ) : (
                        <Chip label="Sin habilidades" size="small" variant="outlined" />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Right Column */}
              <Box sx={{ width: { xs: "100%", md: "65%" } }}>
                {/* Historial */}
                {user.participation && user.participation?.length > 0 ? (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                      Historial de Iniciativas
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: user.participation.length >= 2 ? 220 : "auto",
                        overflowY: user.participation.length >= 2 ? "auto" : "visible",
                        overflowX: "hidden", // Prevenir scroll horizontal
                        px: 0.5, // Padding para que el hover no se corte
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": { backgroundColor: "primary.main", borderRadius: 3 },
                      }}
                    >
                      {user.participation
                        .filter((initiative) => initiative.state !== "draft" && initiative.state !== "disable")
                        .map((initiative, idx) => (
                          <motion.div
                            key={initiative.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            style={{ marginBottom: 8 }}
                            onClick={() => goToInitiative(initiative)}
                          >
                            <Paper
                              variant="outlined"
                              sx={{ p: 1.5, borderRadius: 2, cursor: "pointer", overflow: "visible" }}
                            >
                              <Stack spacing={1}>
                                {/* Roles */}
                                <Stack direction="row" spacing={0.5}>
                                  {[...new Set(initiative.roles)].map((role) => (
                                    <Chip
                                      key={role}
                                      label={role.toUpperCase()}
                                      size="small"
                                      sx={{
                                        backgroundColor: "primary.main",
                                        color: "white",
                                        fontSize: "0.7rem",
                                        fontWeight: "bold",
                                      }}
                                    />
                                  ))}
                                </Stack>
                                {/* Contenido principal */}
                                <Stack direction="row" alignItems="center" gap={1.5}>
                                  <Avatar src={initiative.img} sx={{ width: 40, height: 40 }} />
                                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                    <Typography variant="subtitle2" sx={lineClampStyle(1)}>
                                      {initiative.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={lineClampStyle(1)}>
                                      {initiative.description}
                                    </Typography>
                                  </Box>
                                  <Stack alignItems="flex-end">
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(initiative.date).toLocaleDateString()}
                                    </Typography>
                                    <Chip
                                      label={initiative.state.toUpperCase()}
                                      size="small"
                                      color="primary"
                                      sx={{ fontSize: "0.6rem" }}
                                    />
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Paper>
                          </motion.div>
                        ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2, width: "100%" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "primary.main", mb: 1 }}>
                      Historial de Iniciativas
                    </Typography>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <Chip label="Sin iniciativas" size="small" variant="outlined" />
                    </Box>
                  </Box>
                )}

                {/* Stats */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
                  Estadísticas de Actividad
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, backgroundColor: "action.hover" }}>
                  <Stack direction="row" divider={<Divider flexItem />} justifyContent="space-around">
                    {activityStats.map((stat) => (
                      <Box key={stat.label} textAlign="center">
                        <stat.icon sx={{ color: stat.color, fontSize: 26 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: stat.color }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          )}
        </Paper>
      </Fade>
    </Modal>
  )
}
