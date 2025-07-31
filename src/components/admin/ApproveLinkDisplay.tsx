import { motion } from "motion/react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Link from "@mui/material/Link"
import IconButton from "@mui/material/IconButton"
import ContentCopy from "@mui/icons-material/ContentCopy"
import OpenInNew from "@mui/icons-material/OpenInNew"

export interface LinkDisplayProps {
  label: string
  url: string | null
  icon: React.ElementType
  onCopy: (text: string, message: string) => void
  description?: string
  isAddressOnly?: boolean
}

export const LinkDisplay = ({
  label,
  url,
  icon: Icon,
  onCopy,
  description,
  isAddressOnly = false,
}: LinkDisplayProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Icon sx={{ color: "primary.main" }} />
        <Box>
          <Typography variant="body1" fontWeight={500} color="primary.main">
            {label}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      {url ? (
        <Paper
          elevation={1}
          sx={{
            p: 1,
            pl: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "white",
          }}
        >
          {isAddressOnly ? (
            <Typography
              sx={{
                wordBreak: "break-all",
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {url}
            </Typography>
          ) : (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                wordBreak: "break-all",
                textDecoration: "none",
                color: "text.primary",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {url}
            </Link>
          )}
          <Box sx={{ ml: "auto", display: "flex" }}>
            <IconButton size="small" onClick={() => onCopy(url, `${isAddressOnly ? 'Dirección' : 'Enlace'} de ${label} copiado`)} title={`Copiar ${isAddressOnly ? 'dirección' : 'enlace'}`}>
              <ContentCopy fontSize="small" />
            </IconButton>
            {!isAddressOnly && (
              <IconButton
                size="small"
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir enlace"
              >
                <OpenInNew fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: 1, pl: 2, display: "flex", alignItems: "center", gap: 1, bgcolor: "action.hover" }}
        >
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            No se encontró URL
          </Typography>
        </Paper>
      )}
    </motion.div>
  )
}
