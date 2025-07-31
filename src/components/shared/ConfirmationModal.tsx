import React from "react"
import { Modal, Box, Paper, Typography, Button, Backdrop, Stack, useTheme, Fade, Avatar, Chip } from "@mui/material"
import { motion } from "motion/react"

export type ConfirmationContext =
  | "initiative"
  | "objective"
  | "roadmap"
  | "update"
  | "application"
  | "general"
  | "seekingProfile"
  | "deactivate"

interface ConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  variant: "delete" | "confirm"
  context: ConfirmationContext
  details?: {
    name?: string
    image?: string
    skill?: string
    initiativeTitle?: string
  }
}

const modalConfig = {
  delete: {
    initiative: {
      title: "Eliminar Iniciativa",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar la iniciativa <strong>{details?.name || "seleccionada"}</strong>? Esta
          acción es permanente y no se puede deshacer.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    objective: {
      title: "Eliminar Objetivo",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar el objetivo <strong>"{details?.name || "seleccionado"}"</strong>? Esta
          acción no se puede deshacer.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    update: {
      title: "Eliminar Actualización",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar la actualización <strong>"{details?.name || "seleccionada"}"</strong>?
          Esta acción no se puede deshacer.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    roadmap: {
      title: "Eliminar Fase del Roadmap",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar la fase <strong>"{details?.name || "seleccionada"}"</strong>? Esta
          acción no se puede deshacer.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    seekingProfile: {
      title: "Eliminar Perfil Buscado",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar la postulación del perfil con habilidad general{" "}
          <strong>{details?.name || "seleccionada"}</strong>? Esta acción es permanente.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    application: {
      title: "Eliminar Postulación",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres eliminar la postulación de{" "}
          <strong>{details?.name || "este usuario"}</strong> para el cargo de{" "}
          <strong>{details?.skill || "colaborador"}</strong> en la iniciativa{" "}
          <strong>"{details?.initiativeTitle || "seleccionada"}"</strong>?
          <br />
          <br />
          Esta acción es permanente y no se puede deshacer.
        </>
      ),
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    // Añadir otros contextos de delete aquí si es necesario
    general: {
      title: "Confirmar Eliminación",
      body: () => <>¿Estás seguro de que quieres continuar? Esta acción no se puede deshacer.</>,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "primary" as const,
    },
    deactivate: {
      title: "Desactivar Iniciativa",
      body: (details?: ConfirmationModalProps["details"]) => (
        <>
          ¿Estás seguro de que quieres desactivar la iniciativa <strong>{details?.name || "seleccionada"}</strong>? Una
          vez desactivada, no estará disponible para los usuarios.
        </>
      ),
      confirmButtonText: "Desactivar",
      confirmButtonColor: "primary" as const,
    },
  },
  confirm: {
    application: {
      title: "Aceptar Cofundador",
      body: (details?: ConfirmationModalProps["details"]) => (
        <Stack spacing={2} sx={{ textAlign: "left" }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}
          >
            <Avatar src={details?.image} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {details?.name}
              </Typography>
              <Typography color="text.secondary">
                para la iniciativa <strong>{details?.initiativeTitle}</strong>
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <Typography sx={{ pt: 1 }}>Se unirá como</Typography>
            <Box sx={{ pt: 1 }}>
              <Chip
                label={details?.skill?.replace(/_/g, " ") ?? "Cofundador"}
                size="small"
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          </Box>
          <Typography color="text.secondary" sx={{ pt: 1 }}>
            Al confirmar, formará parte de la iniciativa. ¿Estás seguro?
          </Typography>
        </Stack>
      ),
      confirmButtonText: "Aceptar",
      confirmButtonColor: "primary" as const,
    },
    general: {
      title: "Confirmar Acción",
      body: () => <>¿Estás seguro de que quieres realizar esta acción?</>,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "primary" as const,
    },
  },
}

// Variantes para animaciones por lote dentro del modal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  variant,
  context,
  details,
}) => {
  const theme = useTheme()
  // @ts-expect-error No todos los contextos existen en ambas variantes, lo cual es esperado.
  const config = modalConfig[variant]?.[context] ?? modalConfig[variant].general

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: "blur(1.5px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 450,
            outline: "none",
          }}
        >
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{ color: theme.palette.primary.main, textAlign: "center" }}
            >
              {config.title}
            </Typography>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {React.Children.map(config.body(details) as React.ReactNode, (child, idx) => (
                  <motion.div variants={itemVariants} key={idx} style={{ width: "100%" }}>
                    {child}
                  </motion.div>
                ))}
              </motion.div>
            </Box>
            <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
              <Button onClick={onClose} variant="outlined" color="secondary">
                Cancelar
              </Button>
              <Button onClick={handleConfirm} variant="contained" color={config.confirmButtonColor} autoFocus>
                {config.confirmButtonText}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  )
}
