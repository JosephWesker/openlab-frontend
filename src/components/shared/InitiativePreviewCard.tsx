import React, { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  alpha,
  useTheme,
  Chip,
  Avatar,
  AvatarGroup,
  Stack,
} from "@mui/material"
import { Visibility, HowToVote, Image } from "@mui/icons-material"
import { motion } from "motion/react"

// Estructura de datos unificada que espera la tarjeta.
// Esto permite que funcione tanto con datos del formulario como de una API.
export interface InitiativeCardData {
  title: string
  mainImage?: string
  state?: string
  leaderName: string
  leaderAvatar?: string
  teamMemberCount?: number
  motto?: string
  description?: string
  votesCount?: number
  participantsCount?: number
}

interface InitiativePreviewCardProps {
  initiative: InitiativeCardData
  onButtonClick?: () => void
  buttonText?: string
}

const InitiativePreviewCard: React.FC<InitiativePreviewCardProps> = ({
  initiative,
  onButtonClick,
  buttonText = "Visualizar",
}) => {
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  // Función para detectar si una URL es un video
  const isVideo = (url: string): boolean => {
    if (!url) return false
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv", "video"]
    const urlLower = url.toLowerCase()
    return videoExtensions.some((ext) => urlLower.includes(ext))
  }

  // Generar avatares con colores únicos para el equipo
  const teamColors = ["#3D7BFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
  const teamSize = initiative.teamMemberCount || 0

  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "0 0 35%" },
        maxWidth: { xs: "100%", md: "320px", lg: "360px" },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            position: "relative",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "translateY(-8px)" : "translateY(0px)",
            boxShadow: isHovered
              ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}, 0 0 0 1px ${alpha(
                  theme.palette.primary.main,
                  0.1,
                )}`
              : `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          {/* Header: Badge izquierda + Líder y Equipo derecha */}
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                {/* Badge Propuesta - Izquierda */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <Chip
                    label={initiative.state || "Propuesta"}
                    sx={{
                      bgcolor: "#FF6B6B",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                      height: { xs: 24, md: 28 },
                      borderRadius: 2,
                      "& .MuiChip-label": { px: { xs: 1, md: 2 } },
                    }}
                  />
                </motion.div>

                {/* Líder y Equipo - Derecha */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Box sx={{ textAlign: "right" }}>
                    {/* Líder */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: { xs: 0.5, md: 1 },
                        mb: { xs: 0.5, md: 1 },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="600"
                        sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                      >
                        Líder:
                      </Typography>
                      <Typography variant="body2" fontWeight="700" sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}>
                        {initiative.leaderName}
                      </Typography>
                      <Avatar
                        src={initiative.leaderAvatar}
                        sx={{
                          width: { xs: 24, md: 32 },
                          height: { xs: 24, md: 32 },
                          bgcolor: theme.palette.primary.main,
                          fontSize: { xs: "0.7rem", md: "0.9rem" },
                          fontWeight: "bold",
                        }}
                      >
                        {initiative.leaderName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Box>

                    {/* Equipo */}
                    {teamSize > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: { xs: 0.3, md: 0.5 },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="600"
                          sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                        >
                          Equipo:
                        </Typography>
                        <AvatarGroup
                          max={3}
                          sx={{
                            "& .MuiAvatar-root": {
                              width: { xs: 20, md: 28 },
                              height: { xs: 20, md: 28 },
                              fontSize: { xs: "0.6rem", md: "0.75rem" },
                              border: "2px solid white",
                              fontWeight: "bold",
                            },
                          }}
                        >
                          {teamColors.slice(0, Math.min(3, teamSize)).map((color, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                            >
                              <Avatar sx={{ bgcolor: color }}>{String.fromCharCode(65 + index)}</Avatar>
                            </motion.div>
                          ))}
                        </AvatarGroup>
                        {teamSize > 3 && (
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
                          >
                            +{teamSize - 3}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </CardContent>

          {/* Título Principal - Centrado */}
          <CardContent sx={{ pt: 0, pb: { xs: 0.3, md: 0.5 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  mb: { xs: 0.3, md: 0.5 },
                  textAlign: "left",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {initiative.title || "Título de la Propuesta"}
              </Typography>
            </motion.div>
          </CardContent>

          {/* Imagen Principal - Centrada */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ padding: "0 16px 16px 16px" }}
          >
            {initiative.mainImage ? (
              isVideo(initiative.mainImage) ? (
                <Box
                  component="video"
                  src={initiative.mainImage}
                  controls
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={initiative.mainImage}
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                />
              )
            ) : (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 3,
                  background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.primary.main, 0.1)} 0%,
                        ${alpha("#4ECDC4", 0.1)} 30%,
                        ${alpha("#96CEB4", 0.1)} 60%,
                        ${alpha(theme.palette.primary.main, 0.05)} 100%
                      )`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    color: theme.palette.primary.main,
                    opacity: 0.7,
                  }}
                >
                  <Image sx={{ fontSize: { xs: 50, md: 80 }, mb: { xs: 1, md: 2 } }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                    Imagen de Muestra
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                    Las imágenes subidas aparecerán aquí
                  </Typography>
                </Box>
              </Box>
            )}
          </motion.div>

          {/* Descripción repetida - Debajo de la imagen */}
          <CardContent sx={{ pt: { xs: 0.3, md: 0.3 }, pb: { xs: 0.5, md: 1 } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Stack spacing={0.1} sx={{ mb: { xs: 0.5, md: 1 } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.4,
                    opacity: 1,
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  {initiative.motto || initiative.description || "Descripción de la Propuesta"}
                </Typography>
              </Stack>
            </motion.div>

            {/* Estadísticas: Participantes y Votos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              {/* Participantes */}
              {initiative.participantsCount && initiative.participantsCount > 0 && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: { xs: 0.3, md: 0.5 }, mb: { xs: 0.3, md: 0.5 } }}
                >
                  <AvatarGroup
                    max={3}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: { xs: 16, md: 20 },
                        height: { xs: 16, md: 20 },
                        fontSize: { xs: "0.6rem", md: "0.65rem" },
                        border: "1px solid white",
                      },
                    }}
                  >
                    {teamColors.slice(0, 3).map((color, index) => (
                      <Avatar key={index} sx={{ bgcolor: color }}>
                        {String.fromCharCode(65 + index)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: theme.palette.text.primary, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  >
                    +2
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ ml: { xs: 0.5, md: 1 }, fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  >
                    {initiative.participantsCount} participantes
                  </Typography>
                </Box>
              )}

              {/* Votos */}
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.3, md: 0.5 }, mb: { xs: 0.5, md: 1 } }}>
                <HowToVote sx={{ color: theme.palette.primary.main, fontSize: { xs: 16, md: 20 } }} />
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                  {initiative.votesCount || 0} votos
                </Typography>
              </Box>
            </motion.div>

            {/* Botón Visualizar - Centrado al final */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                startIcon={<Visibility />}
                fullWidth
                onClick={onButtonClick}
                sx={{
                  borderRadius: 3,
                  py: { xs: 1.2, md: 1.8 },
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  fontWeight: "bold",
                  background: theme.palette.primary.main,
                  color: "white",
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.6)}`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {buttonText}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default InitiativePreviewCard
