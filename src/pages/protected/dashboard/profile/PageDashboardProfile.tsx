import { useNavigate, Routes, Route } from "react-router"
import { useState } from "react"
import {
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Web,
  Twitter,
  GitHub,
  Instagram,
  Facebook,
  Edit,
  LinkedIn,
  Chat,
  RocketLaunch,
  Comment,
  HowToVote,
} from "@mui/icons-material"
import { motion } from "motion/react"
import { useAuthContext } from "@/hooks/useAuthContext"
import PageDashboardProfileEdit from "./PageDashboardProfileEdit"
import { useSlugNavigation } from "@/hooks/useSlugNav"

interface ProfileViewProps {
  isCommunity?: boolean
}

const ProfileView = ({ isCommunity = false }: ProfileViewProps) => {
  const navigate = useNavigate()
  const { userFromApi } = useAuthContext()
  const [activeTab, setActiveTab] = useState(0)
  const { linkedIn, github, facebook, instagram, twitter, other, discord } = userFromApi?.social ?? {}
  const { goToInitiative } = useSlugNavigation()

  // Configuración de redes sociales con renderizado condicional
  const socials = [
    { id: 1, icon: GitHub, url: github, label: "GitHub", color: "#333" },
    { id: 2, icon: LinkedIn, url: linkedIn, label: "LinkedIn", color: "#0077b5" },
    { id: 3, icon: Facebook, url: facebook, label: "Facebook", color: "#1877f2" },
    { id: 4, icon: Instagram, url: instagram, label: "Instagram", color: "#e4405f" },
    { id: 5, icon: Twitter, url: twitter, label: "Twitter", color: "#1da1f2" },
    { id: 6, icon: Chat, url: discord, label: "Discord", color: "#7289da" },
    { id: 7, icon: Web, url: other, label: "Web", color: "#6366f1" },
  ].filter((social) => social.url) // Solo mostrar redes sociales que tienen URL

  const activityStats = userFromApi
    ? [
        {
          label: "Iniciativas propuestas",
          value: userFromApi.totalInitiatives,
          icon: RocketLaunch,
          color: "#3b82f6",
        },
        { label: "Comentarios", value: userFromApi.totalComments, icon: Comment, color: "#f59e0b" },
        { label: "Votos emitidos", value: userFromApi.totalVotes, icon: HowToVote, color: "#ef4444" },
      ]
    : []

  const handleAction = (path: string) => {
    navigate(path)
  }

  const initiatives =
    userFromApi?.initiatives?.filter((initiative) => initiative.state !== "draft" && initiative.state !== "disabled") ||
    []

  const votedInitiatives =
    userFromApi?.votedInitiatives?.filter(
      (initiative) => initiative.state !== "draft" && initiative.state !== "disabled",
    ) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <Box className="flex justify-between items-center mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-primary">
          {isCommunity ? "Perfil de Comunidad" : "Perfil de Usuario"}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Columna izquierda - Información del perfil */}
        <Box sx={{ width: { xs: "100%", md: "33.33%" } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Paper className="p-6 rounded-xl shadow-md">
              <Box className="flex flex-col items-center mb-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Avatar src={userFromApi?.image} className="w-32 h-32 mb-4 border-4 border-white shadow-lg" />
                </motion.div>

                <Typography variant="h5" className="font-bold">
                  {userFromApi?.name}
                </Typography>
                {!isCommunity && (
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    {userFromApi?.email}
                  </Typography>
                )}

                {/* Redes sociales mejoradas */}
                {socials.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-2 mt-4 flex-wrap justify-center"
                  >
                    {socials.map((social, index) => (
                      <motion.div
                        key={social.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => social.url && window.open(social.url, "_blank")}
                          sx={{
                            backgroundColor: "rgba(0,0,0,0.05)",
                            color: social.color,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: social.color,
                              color: "white",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            },
                          }}
                        >
                          <social.icon fontSize="small" />
                        </IconButton>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box className="my-4">
                  <Box className="mb-4 text-center">
                    {userFromApi?.roles && userFromApi.roles.length > 0 ? (
                      <Box className="flex flex-wrap gap-2 justify-center">
                        {userFromApi.roles.map((role, index) => (
                          <motion.div
                            key={role}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -1 }}
                          >
                            <Chip
                              label={role}
                              sx={{
                                backgroundColor: "primary.main",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "0.9rem",
                                height: "auto",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                },
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" className="text-gray-500 mt-1">
                        Sin rol asignado
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body1" className="my-4 text-gray-700">
                    {userFromApi?.description || "Sin descripción"}
                  </Typography>

                  {/* Habilidades Generales mejoradas */}
                  <Box className="my-4">
                    <Typography variant="subtitle2" className="font-semibold   mb-3">
                      Habilidades Generales
                    </Typography>
                    <Box className="flex flex-wrap gap-2 mb-2">
                      {userFromApi?.skills?.general?.length && userFromApi?.skills?.general?.length > 0 ? (
                        userFromApi?.skills?.general.map((skill, index) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -1 }}
                          >
                            <Chip
                              label={skill}
                              size="small"
                              sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                },
                              }}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <Chip label="No hay habilidades generales" size="small" className="bg-gray-100" />
                      )}
                    </Box>
                  </Box>

                  {/* Habilidades Técnicas mejoradas */}
                  <Box className="my-4">
                    <Typography variant="subtitle2" className="font-semibold mb-3">
                      Habilidades técnicas
                    </Typography>
                    <Box className="flex flex-wrap gap-2">
                      {userFromApi?.skills?.technical?.length && userFromApi?.skills?.technical?.length > 0 ? (
                        userFromApi?.skills?.technical.map((skill, index) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -1 }}
                          >
                            <Chip
                              label={skill}
                              size="small"
                              sx={{
                                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                color: "white",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                },
                              }}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <Chip label="No hay habilidades técnicas" size="small" className="bg-gray-100" />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="mt-4 py-3 rounded-lg"
                  onClick={() => handleAction("/profile/edit")}
                  startIcon={<Edit />}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Editar Perfil
                </Button>
              </motion.div>
            </Paper>
          </motion.div>
        </Box>

        {/* Columna derecha - Actividad y proyectos */}
        <Box sx={{ width: { xs: "100%", md: "66.67%" } }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {/* Historial de Iniciativas con Tabs */}
            <Paper className="p-6 rounded-xl shadow-md mb-6">
              <Typography variant="h6" className="mb-4 font-bold text-primary">
                Actividad del Usuario
              </Typography>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  mb: 3,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <Tab
                  label="Historial de Iniciativas"
                  sx={{
                    textTransform: "none",
                    fontWeight: activeTab === 0 ? "bold" : "normal",
                    color: activeTab === 0 ? "primary.main" : "text.secondary",
                  }}
                />
                <Tab
                  label="Iniciativas Votadas"
                  sx={{
                    textTransform: "none",
                    fontWeight: activeTab === 1 ? "bold" : "normal",
                    color: activeTab === 1 ? "primary.main" : "text.secondary",
                  }}
                />
              </Tabs>

              {/* Tab Content */}
              {activeTab === 0 && (
                <Box>
                  {initiatives && initiatives.length > 0 ? (
                    <Box
                      className="space-y-3"
                      sx={{
                        maxHeight: 380,
                        overflowY: "auto",
                        scrollbarGutter: "stable",
                        pr: 1,
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "primary.main",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "primary.main",
                        },
                      }}
                    >
                      {initiatives.map((initiative, index) => (
                        <motion.div
                          key={initiative.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <Card
                            className="overflow-hidden cursor-pointer transition-all duration-300"
                            sx={{
                              "&:hover": {
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                                backgroundColor: "rgba(248, 250, 252, 0.8)",
                              },
                            }}
                            onClick={() => goToInitiative(initiative)}
                          >
                            <CardContent className="p-4">
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(0, 1fr) auto",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {/* Left side: Avatar, Title, Description */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                                  <Avatar
                                    src={initiative.img}
                                    alt={initiative.title}
                                    sx={{ width: 48, height: 48, flexShrink: 0 }}
                                  />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="h6"
                                      className="font-bold text-gray-900 text-lg"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={initiative.title}
                                    >
                                      {initiative.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-gray-500 text-sm"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={initiative.description}
                                    >
                                      {initiative.description}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Right side: Date, Status Chip */}
                                <Box
                                  sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}
                                >
                                  <Typography variant="caption" className="text-gray-500 text-xs">
                                    {new Date(initiative.date).toLocaleDateString()}
                                  </Typography>
                                  <Chip
                                    label={initiative.state.toUpperCase()}
                                    size="small"
                                    sx={{
                                      backgroundColor: "primary.main",
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                  />
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  ) : (
                    <Typography>No hay iniciativas para mostrar.</Typography>
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  {votedInitiatives && votedInitiatives.length > 0 ? (
                    <Box
                      className="space-y-3"
                      sx={{
                        maxHeight: 380,
                        overflowY: "auto",
                        scrollbarGutter: "stable",
                        pr: 1,
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "primary.main",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "primary.main",
                        },
                      }}
                    >
                      {votedInitiatives.map((initiative, index) => (
                        <motion.div
                          key={initiative.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <Card
                            className="overflow-hidden cursor-pointer transition-all duration-300"
                            sx={{
                              "&:hover": {
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                                backgroundColor: "rgba(248, 250, 252, 0.8)",
                              },
                            }}
                            onClick={() => goToInitiative(initiative)}
                          >
                            <CardContent className="p-4">
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(0, 1fr) auto",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {/* Left side: Avatar, Title, Description */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                                  <Avatar
                                    src={initiative.img}
                                    alt={initiative.title}
                                    sx={{ width: 48, height: 48, flexShrink: 0 }}
                                  />
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="h6"
                                      className="font-bold text-gray-900 text-lg"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={initiative.title}
                                    >
                                      {initiative.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      className="text-gray-500 text-sm"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      title={initiative.description}
                                    >
                                      {initiative.description}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Right side: Date, Status Chip */}
                                <Box
                                  sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}
                                >
                                  <Typography variant="caption" className="text-gray-500 text-xs">
                                    {new Date(initiative.date).toLocaleDateString()}
                                  </Typography>
                                  <Chip
                                    label={initiative.state.toUpperCase()}
                                    size="small"
                                    sx={{
                                      backgroundColor: "primary.main",
                                      color: "white",
                                      fontWeight: "bold",
                                    }}
                                  />
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  ) : (
                    <Typography>No hay iniciativas votadas para mostrar.</Typography>
                  )}
                </Box>
              )}

              <Divider className="my-4" />

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  className="py-2"
                  component={motion.button}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate("/list")}
                >
                  Ver todas las iniciativas
                </Button>
              </motion.div>
            </Paper>

            {/* Estadísticas de actividad movidas abajo */}
            <Paper className="p-6 rounded-xl shadow-md">
              <Typography variant="h6" className="mb-4 font-bold text-primary">
                Estadísticas de Actividad
              </Typography>

              <Box className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activityStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card
                      className="p-4 text-center cursor-pointer transition-all duration-200"
                      sx={{
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                        border: `1px solid ${stat.color}20`,
                        "&:hover": {
                          boxShadow: `0 8px 25px ${stat.color}20`,
                        },
                      }}
                    >
                      <stat.icon sx={{ color: stat.color, fontSize: 28, mb: 1 }} />
                      <Typography variant="h5" className="font-bold" sx={{ color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600 text-xs">
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Paper>

            {isCommunity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Paper className="p-6 rounded-xl shadow-md mt-4">
                  <Typography variant="h6" className="mb-4">
                    Proyectos destacados
                  </Typography>
                  <Box className="flex flex-wrap -mx-2">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <Box key={index} className="w-full sm:w-1/2 p-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <Paper className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                              <Typography variant="subtitle1" className="font-bold">
                                Proyecto {index + 1}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600 mb-2">
                                Descripción breve del proyecto que ha creado o participado.
                              </Typography>
                              <Chip label="En progreso" size="small" className="bg-green-100 text-green-800" />
                            </Paper>
                          </motion.div>
                        </Box>
                      ))}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </motion.div>
        </Box>
      </Stack>
    </motion.div>
  )
}

export default function PageDashboardProfile() {
  return (
    <Routes>
      <Route path="/" element={<ProfileView isCommunity={false} />} />
      <Route path="community" element={<ProfileView isCommunity={true} />} />
      <Route path="edit" element={<PageDashboardProfileEdit />} />
    </Routes>
  )
}
