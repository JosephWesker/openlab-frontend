import Typography from "@mui/material/Typography"
import Fade from "@mui/material/Fade"
import Box from "@mui/material/Box"
import ErrorIcon from "@mui/icons-material/Error"
import { useTheme } from "@mui/material/styles"
import { motion } from "motion/react"
import type { FieldError } from "react-hook-form"

interface ValidationErrorDisplayProps {
  error?: FieldError
  sx?: object
}

export const ValidationErrorDisplay = ({ error, sx = {} }: ValidationErrorDisplayProps) => {
  const theme = useTheme()

  if (!error?.message) {
    return null
  }

  return (
    <Fade in={!!error?.message} timeout={300}>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            backgroundColor: theme.palette.error.main + "08", // 8% opacity
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            ...sx,
          }}
        >
          <ErrorIcon
            sx={{
              color: theme.palette.error.main,
              fontSize: "1.1rem",
              mt: 0.1, // Slight adjustment for better alignment
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.error.main,
              fontSize: "0.875rem",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            {error.message}
          </Typography>
        </Box>
      </motion.div>
    </Fade>
  )
}
