import React from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import { motion } from "motion/react"
import { ReportProblemOutlined, ErrorOutlineRounded } from "@mui/icons-material"

type ErrorStateContext = "loading" | "action-failed" | "general"

interface ErrorStateProps {
  context: ErrorStateContext
  actionButton?: () => void
  customTitle?: string
  customMessage?: string
}

const errorStateConfig = {
  loading: {
    icon: ReportProblemOutlined,
    title: "¡Ups! Algo falló",
    message: "No pudimos cargar tus datos. A veces, un pequeño tropiezo solo necesita un nuevo comienzo.",
  },
  "action-failed": {
    icon: ErrorOutlineRounded,
    title: "La operación falló",
    message: "No se pudo completar la acción solicitada. Por favor, inténtalo de nuevo más tarde.",
  },
  general: {
    icon: ReportProblemOutlined,
    title: "Ocurrió un error",
    message: "Algo salió mal. Estamos trabajando para solucionarlo.",
  },
}

export const ErrorState: React.FC<ErrorStateProps> = ({ context, actionButton, customTitle, customMessage }) => {
  const config = errorStateConfig[context]
  const IconComponent = config.icon

  const title = customTitle || config.title
  const message = customMessage || config.message

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: "16px",
            textAlign: "center",
            maxWidth: 450,
            background: "linear-gradient(145deg, #ffebee, #fce4ec)",
            border: "1px solid",
            borderColor: "error.light",
            outline: "none !important",
            "&:focus-visible, &:focus, &:active, &:hover": {
              outline: "none !important",
              border: "1px solid",
              borderColor: "error.light",
            },
            "& *": {
              outline: "none !important",
            },
          }}
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconComponent sx={{ fontSize: "60px", color: "error.dark" }} />
          </motion.div>
          <Typography variant="h5" fontWeight="bold" color="error.dark" sx={{ mt: 2, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {message}
          </Typography>
          {actionButton && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={actionButton}
                sx={{
                  borderRadius: "50px",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                  background: "linear-gradient(135deg, #d32f2f 0%, #c62828 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c62828 0%, #b71c1c 100%)",
                    boxShadow: "0 6px 16px rgba(211, 47, 47, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Intentar de Nuevo
              </Button>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  )
}
