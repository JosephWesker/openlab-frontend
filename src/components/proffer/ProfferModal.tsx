import React, { useState, useEffect, useRef } from "react"
import { Dialog, Box, Avatar, Typography, Button, Chip, CircularProgress, useTheme } from "@mui/material"
import { Star, CheckCircle } from "@mui/icons-material"
import { motion, AnimatePresence } from "motion/react"
import ReactConfetti from "react-confetti"
import { useWindowSize } from "react-use"

// Reutilizamos el FormTextField desde la ruta compartida
import { FormTextField } from "../initiative/steps/shared/FormTextField"

// Tipo de persona (mismo que en PageDashboardProposal)
interface Person {
  name: string
  role: string
  avatar: string
  generalSkill: string
  technicalSkills: string[]
  description: string
}

interface ProfferModalProps {
  open: boolean
  onClose: () => void
  person: Person | null
}

// Modal de postulación
export const ProfferModal: React.FC<ProfferModalProps> = ({ open, onClose, person }) => {
  const theme = useTheme()
  const { width, height } = useWindowSize()
  const [presentation, setPresentation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState(0)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  // Función de cierre unificada para animaciones
  const handleClose = () => {
    // 1. Apagar el confeti
    setConfettiPieces(0)

    // 2. Iniciar la secuencia de cierre y la animación de salida
    setIsClosing(true)
    setSubmitted(false)

    // 3. Cerrar el Dialog DESPUÉS de que la animación termine
    closeTimer.current = setTimeout(() => {
      onClose()
    }, 1000)
  }

  // Limpiar estados y timers si el modal se cierra desde fuera
  useEffect(() => {
    if (!open) {
      setPresentation("")
      setIsSubmitting(false)
      setSubmitted(false)
      setIsClosing(false)
      setConfettiPieces(0)
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
      }
    }
  }, [open])

  // Limpiar el timer al desmontar
  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
      }
    }
  }, [])

  if (!person) return null

  // Enviar la postulación
  const handleSubmit = () => {
    if (isSubmitting || submitted) return
    setIsSubmitting(true)

    // Simulación de petición
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setConfettiPieces(500) // Menos piezas para un efecto más suave

      // Iniciar el proceso de cierre automático
      closeTimer.current = setTimeout(() => {
        handleClose()
      }, 5000) // <-- 5 segundos para disfrutar de la lluvia
    }, 1500)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <Box sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {!submitted && !isClosing ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
              transition={{ duration: 0.4 }}
            >
              {/* Encabezado */}
              <Typography variant="h6" fontWeight="700" color="primary.main" sx={{ mb: 2 }}>
                Postulación
              </Typography>

              {/* Mensaje informativo tipo LinkedIn */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                Tu postulación se enviará al líder del proyecto junto con tu perfil. Escribe un mensaje breve que
                explique por qué eres la persona ideal para este rol.
              </Typography>

              {/* Avatar */}
              <Avatar
                src={person.avatar}
                sx={{ width: 70, height: 70, mx: "auto", mb: 2, border: "3px solid", borderColor: "primary.main" }}
              />

              {/* Rol */}
              <Box sx={{ mb: 1.5, display: "flex", justifyContent: "center", gap: 1, alignItems: "center" }}>
                <Typography variant="subtitle2" fontWeight="600">
                  Rol:
                </Typography>
                <Chip label={person.role} size="small" color="primary" sx={{ textTransform: "capitalize" }} />
              </Box>

              {/* Habilidad general */}
              <Box sx={{ mb: 1.5, display: "flex", justifyContent: "center", gap: 1, alignItems: "center" }}>
                <Typography variant="subtitle2" fontWeight="600">
                  Habilidad General:
                </Typography>
                <Chip label={person.generalSkill} size="small" color="primary" />
              </Box>

              {/* Habilidades técnicas */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                  Habilidades Técnicas:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                  {person.technicalSkills.slice(0, 3).map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="secondary" sx={{ fontSize: "0.7rem" }} />
                  ))}
                  {person.technicalSkills.length > 3 && (
                    <Chip
                      label={`+${person.technicalSkills.length - 3}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  )}
                </Box>
              </Box>

              {/* Descripción */}
              {person.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                    Descripción del perfil:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", lineHeight: 1.3, mx: "auto", maxWidth: 400 }}
                  >
                    "{person.description}"
                  </Typography>
                </Box>
              )}

              {/* Campo de presentación */}
              <Box sx={{ mb: 3 }}>
                <FormTextField
                  register={{
                    name: "presentation",
                    onChange: async (e) => {
                      setPresentation(e.target.value)
                      return true
                    },
                    onBlur: async () => true,
                    ref: () => {},
                  }}
                  label="Presentación"
                  placeholder="Cuéntale al equipo por qué eres la mejor opción"
                  value={presentation}
                  multiline
                  minRows={2}
                  maxRows={4}
                  maxLength={300}
                  legendFontSize="0.82rem"
                  labelFontSize="1rem"
                />
              </Box>

              {/* Botón para enviar */}
              <Button
                variant="contained"
                fullWidth
                startIcon={!isSubmitting && <Star />}
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                  },
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.25 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    <Typography variant="body2" fontWeight="600" color="white">
                      Postulando...
                    </Typography>
                  </Box>
                ) : (
                  "Postularse"
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
              transition={{ duration: 0.4 }}
            >
              <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={confettiPieces}
                gravity={0.15} // Gravedad más baja para una caída lenta
                confettiSource={{
                  x: 0,
                  y: 0,
                  w: width,
                  h: 0,
                }} // Origen: toda la parte superior
                colors={[
                  theme.palette.primary.main,
                  theme.palette.secondary.light,
                  theme.palette.success.main,
                  "#FFC700",
                  "#FF5A5F",
                ]}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1299,
                }}
              />
              <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                ¡Gracias por postularte!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: "auto" }}>
                Hemos recibido tu postulación y la revisaremos pronto. Te notificaremos en caso de avanzar al siguiente
                paso.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Dialog>
  )
}
