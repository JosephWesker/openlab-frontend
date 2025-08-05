import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { motion } from "motion/react";
import type { Profile } from "@/interfaces/profile";

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  onDelete?: (profileId: string) => void;
  disabled?: boolean;
}

export const ProfileCard = ({
  profile,
  onEdit,
  onDelete,
  disabled = false,
}: ProfileCardProps) => {
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
          width: { xs: 280, md: "100%" },
          maxWidth: { xs: 280, md: 320 },
          minWidth: 280,
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
        {/* Botones de acción (condicional) */}
        {(onEdit || onDelete) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
              zIndex: 1,
            }}
          >
            {onEdit && (
              <IconButton
                onClick={() => onEdit(profile)}
                color="primary"
                size="small"
                disabled={disabled}
                sx={{
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { backgroundColor: "background.default" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                onClick={() => onDelete(profile.id)}
                color="error"
                size="small"
                disabled={disabled}
                sx={{
                  backgroundColor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { backgroundColor: "background.default" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        <CardContent sx={{ p: 2.5, textAlign: "center" }}>
          {/* Avatar */}
          <Avatar
            src={profile.avatar}
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              mb: 1.5,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />

          {/* Título */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
            Perfil buscado
          </Typography>

          {/* Roles */}
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "center", gap: 1 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Rol:
            </Typography>
            <Chip
              key={profile.roles[0]}
              label={profile.roles[0]}
              size="small"
              color="primary"
              sx={{ textTransform: "capitalize", fontSize: "0.75rem" }}
            />
          </Box>

          {/* Habilidades Generales */}
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Habilidad General:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
              <Chip
                key={profile.generalSkills[0]}
                label={profile.generalSkills[0]}
                size="small"
                color="primary"
                sx={{ fontSize: "0.7rem" }}
              />
            </Box>
          </Box>

          {/* Habilidades Técnicas */}
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
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

          {/* Descripción adicional con subtítulo */}
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
                  WebkitLineClamp: 2,
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

