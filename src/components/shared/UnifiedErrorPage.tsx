import React from "react"
import { Box, Typography, Button, Paper } from "@mui/material"
import { motion } from "motion/react"
import HomeIcon from "@mui/icons-material/Home"
import RefreshIcon from "@mui/icons-material/Refresh"
import ReplayIcon from "@mui/icons-material/Replay"
import errorImage from "@/assets/images/error.webp"

// Tipos de error soportados
export type ErrorType = "404" | "javascript" | "network" | "permission"

// Configuración simple para cada tipo de error
interface ErrorConfig {
  title: string
  primaryAction: {
    label: string
    icon: React.ElementType
  }
  secondaryAction?: {
    label: string
    icon: React.ElementType
  }
  description?: string
}

// Configuraciones simplificadas por tipo de error
const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  "404": {
    title: "Error 404 (Página no encontrada)",
    primaryAction: {
      label: "Volver al Inicio",
      icon: HomeIcon,
    },
    secondaryAction: {
      label: "Volver a intentar",
      icon: RefreshIcon,
    },
    description: "La página que buscas no existe o fue movida.",
  },
  javascript: {
    title: "Error Inesperado (Fallo de sistema)",
    primaryAction: {
      label: "Volver al Inicio",
      icon: HomeIcon,
    },
    secondaryAction: {
      label: "Volver a intentar",
      icon: ReplayIcon,
    },
    description: "Ocurrió un error inesperado. El equipo técnico ha sido notificado.",
  },
  network: {
    title: "Error de Conexión (Sin internet)",
    primaryAction: {
      label: "Volver a intentar",
      icon: RefreshIcon,
    },
    description: "Revisa tu conexión a internet e intenta nuevamente.",
  },
  permission: {
    title: "Error de Permisos (Acceso denegado)",
    primaryAction: {
      label: "Volver al Inicio",
      icon: HomeIcon,
    },
    description: "Revisa tus permisos e intenta nuevamente.",
  },
}

export interface UnifiedErrorPageProps {
  errorType: ErrorType
  onPrimaryAction: () => void
  onSecondaryAction?: () => void
  customTitle?: string
}

const UnifiedErrorPage: React.FC<UnifiedErrorPageProps> = ({
  errorType,
  onPrimaryAction,
  onSecondaryAction,
  customTitle,
}) => {
  const config = ERROR_CONFIGS[errorType]
  const PrimaryIcon = config.primaryAction.icon
  const SecondaryIcon = config.secondaryAction?.icon
  const description = config.description

  const title = customTitle || config.title

  // Determinar si el error se muestra standalone (sin header/sidebar)
  const isStandalone = errorType === "javascript" || errorType === "network"

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to top, #3D7BFF80, transparent)",
        position: "relative",
        overflow: "hidden",
        minHeight: isStandalone ? "100dvh" : "calc(100vh - 120px)",
        borderRadius: isStandalone ? "0" : "24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 6 },
            maxWidth: 500,
            width: "100%",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
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
            },
            "& *": {
              outline: "none !important",
            },
          }}
        >
          {/* Imagen de error animada */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Box
              component="img"
              src={errorImage}
              alt="Error"
              sx={{
                width: "120px",
                height: "120px",
                mb: 3,
                mx: "auto",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              }}
            />
          </motion.div>

          {/* Título contextual */}
          <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
            {title}
          </Typography>

          {/* Información contextual simple por tipo de error */}
          {description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {description} Si el problema persiste, contacta con el equipo de soporte de OpenLab 🚀
            </Typography>
          )}

          {/* Botones de acción */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "center" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<PrimaryIcon />}
                onClick={onPrimaryAction}
                sx={{
                  borderRadius: "50px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  color: "white",
                  background: "primary.main",
                  "&:hover": {
                    background: "primary.dark",
                  },
                }}
              >
                {config.primaryAction.label}
              </Button>
            </motion.div>

            {config.secondaryAction && onSecondaryAction && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={SecondaryIcon && <SecondaryIcon />}
                  onClick={onSecondaryAction}
                  sx={{
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.dark",
                      color: "primary.dark",
                      bgcolor: "primary.light",
                    },
                  }}
                >
                  {config.secondaryAction.label}
                </Button>
              </motion.div>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default UnifiedErrorPage
