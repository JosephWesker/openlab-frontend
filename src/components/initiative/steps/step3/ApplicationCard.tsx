import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Delete from "@mui/icons-material/Delete"
import { motion } from "motion/react"
import type { Profile } from "@/interfaces/profile"
import Stack from "@mui/material/Stack"
import Cancel from "@mui/icons-material/Cancel"
import CheckCircle from "@mui/icons-material/CheckCircle"

interface ApplicationCardProps {
  profile: Profile
  onDelete: (profileId: string) => void
}

export const ApplicationCard = ({ profile, onDelete }: ApplicationCardProps) => {
  const applicationDate = profile.date ? new Date(profile.date) : null
  const formattedDate = applicationDate
    ? applicationDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha no disponible"

  return (
    <motion.div
      layout
      key={profile.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{
        flexShrink: 0,
        width: "280px",
        minWidth: "280px",
      }}
    >
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          width: "100%",
          height: "fit-content",
          position: "relative",
          flexShrink: 0,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
            transition: "all 0.3s ease",
          },
        }}
      >
        <CardContent sx={{ p: 2.5, textAlign: "center" }}>
          <IconButton
            onClick={() => onDelete(profile.id)}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "background.paper",
              boxShadow: 1,
              "&:hover": { backgroundColor: "background.default" },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
          <Avatar
            src={profile.avatar}
            sx={{ width: 70, height: 70, mx: "auto", mb: 1.5, border: "3px solid", borderColor: "secondary.main" }}
          />
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {profile.active ? "Postulación Activa" : "Postulación Inactiva"}
            </Typography>
            {profile.active ? (
              <CheckCircle color="success" fontSize="small" />
            ) : (
              <Cancel color="error" fontSize="small" />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
            {formattedDate}
          </Typography>

          {/* Habilidades Generales */}
          {profile.generalSkills && profile.generalSkills.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, fontSize: "0.85rem" }}>
                Habilidad General:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                {profile.generalSkills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" color="primary" sx={{ fontSize: "0.7rem" }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Habilidades Técnicas */}
          {profile.technicalSkills && profile.technicalSkills.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, fontSize: "0.85rem" }}>
                Habilidades Técnicas:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                {profile.technicalSkills.slice(0, 3).map((skill) => (
                  <Chip key={skill} label={skill} size="small" color="secondary" sx={{ fontSize: "0.7rem" }} />
                ))}
                {profile.technicalSkills.length > 3 && (
                  <Chip
                    label={`+${profile.technicalSkills.length - 3}`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Descripción adicional */}
          {profile.additionalDescription && (
            <Box sx={{ mt: 1.5 }}>
              <Typography fontWeight="600" sx={{ mb: 1, fontSize: "0.85rem" }}>
                Descripción del perfil:
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  lineHeight: 1.3,
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                "{profile.additionalDescription}"
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
