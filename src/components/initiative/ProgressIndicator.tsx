import React from "react"
import { Box, Typography, LinearProgress, Chip, alpha, useTheme } from "@mui/material"
import { CheckCircle } from "@mui/icons-material"
import { motion } from "motion/react"
import { useStepLogic } from "../../hooks/useStepLogic"

const ProgressIndicator: React.FC = () => {
  const theme = useTheme()
  const { getOverallProgress, getCompletedStepsCount, hasStartedNavigation } = useStepLogic()

  const overallProgress = getOverallProgress()
  const stepsCount = getCompletedStepsCount()

  // Si no ha empezado la navegación, mostrar progreso inicial
  if (!hasStartedNavigation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 pb-4"
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CheckCircle color="primary" />
            <Typography variant="h6" fontWeight="700" color="primary">
              Progreso General
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="0/6 pasos"
              color="default"
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                height: 32,
              }}
            />
            <Typography variant="h5" fontWeight="800" color="text.secondary">
              0%
            </Typography>
          </Box>
        </Box>

        {/* Barra de progreso inicial */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: alpha(theme.palette.divider, 0.2),
              "& .MuiLinearProgress-bar": {
                borderRadius: 6,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          />
        </Box>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 pb-4"
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CheckCircle color="primary" />
          <Typography variant="h6" fontWeight="700" color="primary">
            Progreso General
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`${stepsCount.completed}/${stepsCount.total} pasos`}
            color="primary"
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              height: 32,
            }}
          />
          <Typography variant="h5" fontWeight="800" color="primary">
            {Math.round(overallProgress)}%
          </Typography>
        </Box>
      </Box>

      {/* Barra de progreso principal */}
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: alpha(theme.palette.divider, 0.2),
            "& .MuiLinearProgress-bar": {
              borderRadius: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        />
      </Box>
    </motion.div>
  )
}

export default ProgressIndicator
