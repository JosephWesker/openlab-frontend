import React from "react"
import { Box, Paper, Typography } from "@mui/material"
import { motion } from "motion/react"
import {
  RocketLaunchOutlined,
  PersonSearchRounded,
  WorkOutlineRounded,
  LightbulbRounded,
  DraftsRounded,
  CheckCircleRounded,
  TrendingUpRounded,
  SearchOffRounded,
  CampaignOutlined,
} from "@mui/icons-material"

type EmptyStateContext =
  | "initiatives"
  | "participations"
  | "participations-proposals"
  | "participations-in-process"
  | "participations-active"
  | "applications"
  | "portfolio"
  | "proposals"
  | "drafts"
  | "active"
  | "in-process"
  | "general"
  | "search"

interface EmptyStateProps {
  context: EmptyStateContext
  actionButton?: React.ReactNode
  customTitle?: string
  customMessage?: string
}

const emptyStateConfig = {
  initiatives: {
    icon: LightbulbRounded,
    title: "¡Tu lista de iniciativas está vacía!",
    message: "Este es el comienzo de algo increíble. ¡Tu primera iniciativa está a solo un clic de distancia!",
  },
  participations: {
    icon: CampaignOutlined,
    title: "¡Tu lista de participaciones como cofundador está vacía!",
    message:
      "Aún no participas como cofundador en ninguna iniciativa. ¡Únete a proyectos emocionantes y colabora con otros emprendedores!",
  },
  "participations-proposals": {
    icon: LightbulbRounded,
    title: "¡No tienes participaciones en propuestas!",
    message: "No participas como cofundador en ninguna iniciativa que esté en estado de propuesta.",
  },
  "participations-in-process": {
    icon: TrendingUpRounded,
    title: "¡No tienes participaciones en proceso!",
    message: "No participas como cofundador en ninguna iniciativa que esté siendo evaluada.",
  },
  "participations-active": {
    icon: CheckCircleRounded,
    title: "¡No tienes participaciones activas!",
    message: "No participas como cofundador en ninguna iniciativa que esté aprobada y activa.",
  },
  applications: {
    icon: PersonSearchRounded,
    title: "¡No hay postulaciones aún!",
    message: "Aún no tienes personas postulándose a tus iniciativas. ¡Comparte tus proyectos para atraer talento!",
  },
  portfolio: {
    icon: WorkOutlineRounded,
    title: "¡Tu portafolio está vacío!",
    message: "Aquí podrás ver todas tus iniciativas destacadas. ¡Comienza creando tu primera propuesta!",
  },
  proposals: {
    icon: RocketLaunchOutlined,
    title: "¡No tienes propuestas aún!",
    message: "¡Es el momento perfecto para lanzar esa idea que cambiará el mundo!",
  },
  drafts: {
    icon: DraftsRounded,
    title: "¡Tu lista de ideas está vacío!",
    message: "¡Guarda aquí tus próximos grandes proyectos como borradores!",
  },
  active: {
    icon: CheckCircleRounded,
    title: "¡No tienes iniciativas activas!",
    message: "Aún no tienes iniciativas aprobadas y activas. ¡Continúa trabajando en tus propuestas!",
  },
  "in-process": {
    icon: TrendingUpRounded,
    title: "¡No tienes iniciativas en proceso!",
    message: "Aún no tienes iniciativas siendo evaluadas. ¡Envía tus propuestas para comenzar el proceso!",
  },
  search: {
    icon: SearchOffRounded,
    title: "No se encontraron resultados",
    message: "No hemos encontrado nada que coincida con tu búsqueda. Intenta con otras palabras.",
  },
  general: {
    icon: RocketLaunchOutlined,
    title: "¡No hay contenido disponible!",
    message: "Este espacio está listo para ser llenado con contenido increíble.",
  },
}

export const EmptyState: React.FC<EmptyStateProps> = ({ context, actionButton, customTitle, customMessage }) => {
  const config = emptyStateConfig[context]
  const IconComponent = config.icon

  const title = customTitle || config.title
  const message = customMessage || config.message

  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, sm: 12 } }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 6 },
            maxWidth: 500,
            mx: "auto",
            borderRadius: "20px",
            background: "linear-gradient(to top, #e3f2fd, #ffffff)",
            border: "1px solid",
            borderColor: "primary.light",
            outline: "none !important",
            "&:focus-visible": {
              outline: "none !important",
            },
            "&:focus": {
              outline: "none !important",
            },
            "&:active": {
              outline: "none !important",
            },
            "&:hover": {
              outline: "none !important",
              border: "1px solid",
              borderColor: "primary.light",
            },
            "& *": {
              outline: "none !important",
            },
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconComponent sx={{ fontSize: "80px", color: "primary.main", mb: 2 }} />
          </motion.div>
          <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            {message}
          </Typography>
          {actionButton && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                component="div"
                sx={{
                  "& .MuiButton-root": {
                    borderRadius: "50px",
                    px: 5,
                    py: 1.5,
                    fontWeight: "bold",
                    color: "white",
                    background: "primary.main",
                    "&:hover": {
                      background: "primary.dark",
                    },
                  },
                }}
              >
                {actionButton}
              </Box>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}
