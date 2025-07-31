import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  Chip,
  Alert,
  Tabs,
  Tab,
  Stack,
  TextField,
  Autocomplete,
  Paper,
  // Divider,
} from "@mui/material"
import {
  Add,
  Delete,
  Group,
  ExpandMore,
  Edit,
  Handshake,
  People,
  CheckCircle,
  Cancel,
  // LightbulbRounded,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "motion/react"
import { useFormContext, useFieldArray } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
// import { useQuery } from "@tanstack/react-query"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"
import { FormTextField } from "./shared/FormTextField"
import { useSkillsStore } from "@/stores/skillsStore"
import { useShallow } from "zustand/react/shallow"
import { API_PATH, AVATAR_USER_NOT_IMAGE, AVATAR_PROFILE_POSTULATION } from "@/lib/constants"
import { isValidEmail } from "@/lib/emailSearch"
import { useApi } from "@/hooks/useApi"
import type { UserResponse } from "@/interfaces/api/user-response"
import { useInitiativeForm } from "@/context/InitiativeFormContext"
import type { Collaborator } from "@/interfaces/initiative"
// import { userMapperWithActivity } from "@/mapper/user-mapper"
// import type { UserEntityWithActivity } from "@/interfaces/user"
import { UserProfileModal } from "@/components/shared/UserProfileModal"
// import { useLocation, useNavigate } from "react-router"
// import { useAuthContext } from "@/hooks/useAuthContext"

interface Profile {
  id: string
  roles: string[]
  generalSkills: string[]
  technicalSkills: string[]
  avatar: string
  additionalDescription?: string
  // Campos para postulaciones existentes
  date?: string
  active?: boolean
}

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  onSave: (profile: Profile) => void
  initialProfile?: Profile
  isEditing?: boolean
  roleToCreate: "COLLABORATOR" | "COFOUNDER"
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  onSave,
  initialProfile,
  isEditing = false,
  roleToCreate,
}) => {
  const [selectedGeneralSkill, setSelectedGeneralSkill] = useState<string[]>([])
  const [selectedTechnicalSkills, setSelectedTechnicalSkills] = useState<string[]>([])
  const [additionalDescription, setAdditionalDescription] = useState("")
  const [error, setError] = useState("")
  const [currentAvatar, setCurrentAvatar] = useState<string>("")

  const { skillsGeneral, skillsTechnical } = useSkillsStore(
    useShallow((state) => ({
      skillsGeneral: state.skills.general,
      skillsTechnical: state.skills.technical,
    })),
  )

  // Efecto para inicializar los valores cuando se abre el modal
  useEffect(() => {
    if (open) {
      if (initialProfile && isEditing) {
        setSelectedGeneralSkill(initialProfile.generalSkills || [])
        setSelectedTechnicalSkills(initialProfile.technicalSkills || [])
        setAdditionalDescription(initialProfile.additionalDescription || "")
        setCurrentAvatar(initialProfile.avatar || AVATAR_PROFILE_POSTULATION)
      } else {
        // Limpiar para nuevo perfil
        setSelectedGeneralSkill([])
        setSelectedTechnicalSkills([])
        setAdditionalDescription("")
        // Usar siempre la misma imagen para nuevos perfiles
        setCurrentAvatar(AVATAR_PROFILE_POSTULATION)
      }
      setError("")
    }
  }, [open, initialProfile, isEditing])

  const handleSave = () => {
    // Validación
    if (roleToCreate.length === 0) {
      setError("Debes seleccionar al menos un rol")
      return
    }
    if (selectedGeneralSkill.length === 0) {
      setError("Debes seleccionar al menos una habilidad general")
      return
    }
    if (selectedTechnicalSkills.length === 0) {
      setError("Debes seleccionar al menos una habilidad técnica")
      return
    }
    if (roleToCreate === "COFOUNDER" && (!additionalDescription || additionalDescription.trim().length === 0)) {
      setError("La descripción adicional es requerida para un cofundador")
      return
    }

    const profile: Profile = {
      id: initialProfile?.id || `profile_${Date.now()}`,
      roles: [roleToCreate],
      generalSkills: selectedGeneralSkill,
      technicalSkills: selectedTechnicalSkills,
      avatar: currentAvatar,
      additionalDescription: additionalDescription.trim(),
    }

    onSave(profile)
    handleClose()
  }

  const handleClose = () => {
    setSelectedGeneralSkill([])
    setSelectedTechnicalSkills([])
    setAdditionalDescription("")
    setError("")
    setCurrentAvatar("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <Box sx={{ textAlign: "center", p: 2 }}>
        {/* Avatar centrado */}
        <Avatar
          src={currentAvatar}
          sx={{
            mx: "auto",
            mb: 1,
            border: "4px solid",
            borderColor: "primary.main",
          }}
          className="size-20 md:size-28"
        />

        {/* Título centrado */}
        <Typography variant="h6" fontWeight="700" color="primary.main" className="text-base md:text-lg">
          Perfil en OpenLab
        </Typography>

        {/* Selección de roles ahora es un display fijo */}
        <Box
          sx={{ my: 2, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}
        >
          <Typography variant="body1" fontWeight="600" sx={{ fontWeight: "bold", color: "primary.main" }}>
            Rol:{" "}
          </Typography>
          <Chip
            label={roleToCreate}
            color="primary"
            size="medium"
            sx={{ textTransform: "capitalize", fontSize: "1rem", fontWeight: "bold" }}
          />
        </Box>

        {/* Título habilidades generales */}
        <Typography variant="h6" fontWeight="700" color="primary.main" className="text-base md:text-lg">
          Habilidad general
        </Typography>

        {/* Habilidad general con Autocomplete */}
        <Autocomplete
          multiple
          freeSolo
          id="general-skill-autocomplete"
          options={skillsGeneral}
          value={selectedGeneralSkill}
          onChange={(_, newValue) => {
            if (newValue.length > 1) {
              newValue = newValue.slice(-1) // Keep only the last selected item
            }
            const newSkills = newValue.map((skill) => (typeof skill === "string" ? skill.toUpperCase() : skill))
            setSelectedGeneralSkill([...new Set(newSkills)])
            if (error) setError("")
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter((option) => option.toLowerCase().includes(params.inputValue.toLowerCase()))

            const isExisting = options.some((option) => option.toUpperCase() === params.inputValue.toUpperCase())
            if (params.inputValue !== "" && !isExisting) {
              filtered.push(params.inputValue)
            }

            return filtered
          }}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => {
            const isNew = !skillsGeneral.some((skill) => skill.toUpperCase() === option.toUpperCase())
            const { key, ...liProps } = props
            return (
              <li key={key} {...liProps}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {isNew ? `Agregar "${option.toUpperCase()}"` : option}
                </motion.div>
              </li>
            )
          }}
          noOptionsText="Escribe para agregar una nueva habilidad"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Habilidad general"
              placeholder={selectedGeneralSkill.length === 0 ? "Selecciona o escribe una habilidad" : ""}
              error={!!error && selectedGeneralSkill.length === 0}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...chipProps } = getTagProps({ index })
              return <Chip key={key} label={option} {...chipProps} />
            })
          }
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" fontWeight="700" color="primary.main" className="text-base md:text-lg">
          Habilidades técnicas
        </Typography>

        {/* Habilidades técnicas con Autocomplete */}
        <Autocomplete
          multiple
          freeSolo
          id="technical-skills-autocomplete"
          options={skillsTechnical}
          value={selectedTechnicalSkills}
          onChange={(_, newValue) => {
            const newSkills = newValue.map((skill) => (typeof skill === "string" ? skill.toUpperCase() : skill))
            setSelectedTechnicalSkills([...new Set(newSkills)])
            if (error) setError("")
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter((option) => option.toLowerCase().includes(params.inputValue.toLowerCase()))

            const isExisting = options.some((option) => params.inputValue.toUpperCase() === option)
            if (params.inputValue !== "" && !isExisting) {
              filtered.push(params.inputValue.toUpperCase())
            }

            return filtered
          }}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => {
            const isNew = !skillsTechnical.includes(option)
            const { key, ...liProps } = props
            return (
              <li key={key} {...liProps}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {isNew ? `Agregar "${option}"` : option}
                </motion.div>
              </li>
            )
          }}
          noOptionsText="Escribe para agregar una nueva habilidad"
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Habilidades técnicas"
              placeholder="Selecciona o escribe una habilidad"
              error={!!error && selectedTechnicalSkills.length === 0}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...chipProps } = getTagProps({ index })
              return <Chip key={key} label={option} {...chipProps} />
            })
          }
          sx={{ mb: 2 }}
        />

        {/* Descripción adicional mejorada */}

        {roleToCreate === "COFOUNDER" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="700" color={"primary.main"} className="text-base md:text-lg">
              Descripción del perfil buscado
            </Typography>
            <FormTextField
              label="Descripción adicional"
              register={{
                name: "additionalDescription",
                onChange: async (e) => {
                  setAdditionalDescription(e.target.value)
                  if (error) setError("")
                  return true
                },
                onBlur: async () => {
                  return true
                },
                ref: () => {},
              }}
              value={additionalDescription}
              maxLength={300}
              multiline
              minRows={2}
              maxRows={4}
              onClear={() => setAdditionalDescription("")}
              labelFontSize="1rem"
              legendFontSize="0.75rem"
              placeholder="Ej: Se busca alguien con experiencia en marketing digital, gestión de redes sociales y herramientas como Canva, Adobe Creative Suite."
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Botones centrados */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: 3,
              py: 1,
              fontSize: "1rem",
              fontWeight: "bold",
              background: "primary.main",
              "&:hover": {
                background: "primary.dark",
              },
            }}
          >
            {isEditing ? "Guardar Cambios" : "Agregar Perfil"}
          </Button>

          <Button
            onClick={handleClose}
            variant="text"
            fullWidth
            size="large"
            sx={{
              borderRadius: 3,
              py: 1,
              fontSize: "1rem",
              color: "text.secondary",
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

const ProfileCard = ({
  profile,
  onEdit,
  onDelete,
  disabled = false,
}: {
  profile: Profile
  onEdit?: (profile: Profile) => void
  onDelete?: (profileId: string) => void
  disabled?: boolean
}) => {
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

const ApplicationCard = ({ profile, onDelete }: { profile: Profile; onDelete: (profileId: string) => void }) => {
  const applicationDate = profile.date ? new Date(profile.date) : null
  const formattedDate = applicationDate
    ? applicationDate.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Fecha no disponible"

  // const onDeleteAnnouncementCoFounder = async (profileId: string) => {
  //   try {
  //     const response = await fetchApi({
  //       path: `${API_PATH.DELETE_ANNOUNCEMENT_COFOUNDER}/${profileId}`,
  //       init: {
  //         method: "DELETE",
  //       },
  //     })

  //     if (response.ok) {
  //       console.log("Perfil eliminado correctamente")
  //     }
  //   } catch (error) {
  //     console.error("Error al eliminar el perfil:", error)
  //   }
  // }

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

const CurrentTeamMemberCard = ({
  member,
  onClick,
}: {
  member: { id: number; name: string; profilePic: string }
  onClick: () => void
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Paper
      elevation={2}
      onClick={onClick}
      sx={{
        p: 1,
        px: 2,
        borderRadius: "50px", // Forma de píldora
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        transition: "all 0.2s ease",
        // minWidth: 180,
        "&:hover": {
          boxShadow: 4,
          backgroundColor: "action.hover",
        },
      }}
    >
      <Avatar src={member.profilePic} sx={{ width: 40, height: 40 }} />
      <Typography variant="body2" fontWeight={600} noWrap>
        {member.name}
      </Typography>
    </Paper>
  </motion.div>
)

const HorizontalTeamList = ({
  members,
  onMemberClick,
}: {
  members: Collaborator[]
  onMemberClick: (id: number) => void
}) => {
  if (!members || members.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", fontStyle: "italic" }}>
        No hay miembros en el equipo actual.
      </Typography>
    )
  }
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 1.5,
        "&::-webkit-scrollbar": { height: 8 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "grey.300", borderRadius: 3 },
      }}
    >
      <AnimatePresence>
        {members.map((member) => (
          <CurrentTeamMemberCard key={member.id} member={member} onClick={() => onMemberClick(member.id)} />
        ))}
      </AnimatePresence>
    </Box>
  )
}

const HorizontalProfileList = ({
  profiles,
  onEdit,
  onDelete,
  CardComponent,
  disabled = false,
}: {
  profiles: Profile[]
  onEdit?: (profile: Profile) => void
  onDelete?: (profileId: string) => void
  CardComponent: React.ElementType
  disabled?: boolean
}) => {
  if (profiles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        No hay perfiles en esta sección.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        overflowX: "auto",
        py: 2,
        px: 2, // Aumentado para más padding
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        },
      }}
    >
      <AnimatePresence>
        {profiles.map((profile) => (
          <CardComponent key={profile.id} profile={profile} onEdit={onEdit} onDelete={onDelete} disabled={disabled} />
        ))}
      </AnimatePresence>
    </Box>
  )
}

const Step3Component: React.FC = () => {
  // React Hook Form context
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<InitiativeFormData>()
  const { isEditMode } = useInitiativeForm()
  const refAccordionCollaborators = useRef<HTMLDivElement>(null)

  // Efecto para scroll automático al accordion de colaboradores
  useEffect(() => {
    // Verificar si hay un hash en la URL que indique que debemos hacer scroll
    if (window.location.hash === "#collaborators-profile") {
      // Usar setTimeout para asegurar que el componente esté renderizado
      const timer = setTimeout(() => {
        const element = refAccordionCollaborators.current
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          // Limpiar el hash de la URL después del scroll
          window.history.replaceState(null, "", window.location.pathname)
        }
      }, 300) // Delay para asegurar que el componente esté completamente renderizado

      return () => clearTimeout(timer)
    }
  }, [])
  // const { userFromApi } = useAuthContext()

  // const isUserAdmin = useMemo(() => userFromApi?.roles?.includes("ADMIN"), [userFromApi?.roles])

  // const isDisabled = useMemo(() => {
  //   if (!isEditMode || !initiativeData?.state) return false
  //   if (isUserAdmin) return false

  //   const lockedStatus = ["inprocess", "approved"]
  //   return lockedStatus.includes(initiativeData.state)
  // }, [isEditMode, initiativeData?.state, isUserAdmin])

  // Field arrays para perfiles
  const {
    append: appendSeekingProfile,
    remove: removeSeekingProfile,
    update: updateSeekingProfile,
  } = useFieldArray({
    control,
    name: "seekingProfiles",
  })

  // Estados locales para UI
  const [coFoundersExpanded, setCoFoundersExpanded] = useState(true)
  const [collaboratorsExpanded, setCollaboratorsExpanded] = useState(true)
  const [coFoundersSeekingExpanded, setCoFoundersSeekingExpanded] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [roleForModal, setRoleForModal] = useState<"COLLABORATOR" | "COFOUNDER">("COLLABORATOR")
  const [cofounderTab, setCofounderTab] = useState(0)
  const [collaboratorTab, setCollaboratorTab] = useState(0)
  const [initialProfileIds, setInitialProfileIds] = useState<Set<string>>(new Set())
  const initialIdsSet = useRef(false)
  const [isTeamModalOpen, setTeamModalOpen] = useState(false)
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<number | null>(null)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null)

  const [emailSearchTerm, setEmailSearchTerm] = useState("")
  const [emailError, setEmailError] = useState("")
  const [emailInfo, setEmailInfo] = useState("")
  const [users, setUsers] = useState<string[]>([])
  const fetchApi = useApi()
  // const navigate = useNavigate()
  // const { state } = useLocation() as { state: { initiative: Initiative | null } }

  // Watch values from form
  const coFounderEmails = watch("coFounderEmails") || []
  const seekingProfiles = watch("seekingProfiles") || []
  const currentTeam = watch("collaborators") || []

  const { collaborators, cofounders } = useMemo(() => {
    const collabs: Profile[] = seekingProfiles.filter((p) => p.roles.includes("COLLABORATOR"))
    const cofunds: Profile[] = seekingProfiles.filter((p) => p.roles.includes("COFOUNDER"))
    return { collaborators: collabs, cofounders: cofunds }
  }, [seekingProfiles])

  const { collaboratorsFromBackend, collaboratorsToSeek } = useMemo((): {
    collaboratorsFromBackend: Profile[]
    collaboratorsToSeek: Profile[]
  } => {
    const fromBackend: Profile[] = isEditMode ? collaborators.filter((p) => initialProfileIds.has(p.id)) : []
    const toSeek: Profile[] = isEditMode ? collaborators.filter((p) => !initialProfileIds.has(p.id)) : collaborators
    return { collaboratorsFromBackend: fromBackend, collaboratorsToSeek: toSeek }
  }, [collaborators, isEditMode, initialProfileIds])

  const { cofoundersFromBackend, cofoundersToSeek } = useMemo((): {
    cofoundersFromBackend: Profile[]
    cofoundersToSeek: Profile[]
  } => {
    const fromBackend: Profile[] = cofounders
      .filter((p) => p.date)
      .sort((a, b) => {
        // Ordenar primero las activas (active: true) y luego las inactivas (active: false)
        if (a.active === true && b.active !== true) return -1
        if (a.active !== true && b.active === true) return 1
        return 0
      })
    const toSeek: Profile[] = cofounders.filter((p) => !p.date)
    return { cofoundersFromBackend: fromBackend, cofoundersToSeek: toSeek }
  }, [cofounders])

  const { currentCollaborators, currentCofounders } = useMemo(() => {
    const collabs = currentTeam.filter((m) => m.role === "COLLABORATOR")
    const cofunds = currentTeam.filter((m) => m.role === "COFOUNDER")
    return { currentCollaborators: collabs, currentCofounders: cofunds }
  }, [currentTeam])

  const handleCoFoundersAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setCoFoundersExpanded(isExpanded)
  }, [])

  const handleCollaboratorsAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setCollaboratorsExpanded(isExpanded)
  }, [])

  const handleCoFoundersSeekingAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setCoFoundersSeekingExpanded(isExpanded)
  }, [])

  const handleRemoveEmail = useCallback(
    (email: string) => {
      // if (isDisabled) return
      const newEmails = coFounderEmails.filter((contact) => contact !== email)
      setValue("coFounderEmails", newEmails, { shouldValidate: true })
    },
    [coFounderEmails, setValue],
  )

  const handleAddCustomEmail = useCallback(() => {
    // if (isDisabled) return
    const email = emailSearchTerm.trim().toLowerCase()

    if (email && !coFounderEmails.some((contact) => contact === email)) {
      if (isValidEmail(email)) {
        if (!users.includes(email)) {
          setEmailInfo(
            "Correo no encontrado en OpenLab: Invita a tu cofundador para que lo puedas agregar a tu iniciativa",
          )
          setEmailError("")
          return
        }

        setValue("coFounderEmails", [...coFounderEmails, email], { shouldValidate: true })

        setEmailSearchTerm("")
        setEmailError("")
        setEmailInfo("")
      } else {
        setEmailError("Email inválido")
        setEmailInfo("")
      }
    } else if (coFounderEmails.some((contact) => contact === email)) {
      setEmailError("Este email ya fue agregado")
      setEmailInfo("")
    } else if (!email) {
      setEmailError("Ingresa un email")
      setEmailInfo("")
    }
  }, [emailSearchTerm, coFounderEmails, setValue, users])

  const handleEmailSearchKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (isValidEmail(emailSearchTerm)) {
          handleAddCustomEmail()
        } else if (emailSearchTerm.trim()) {
          setEmailError("Email inválido")
          setEmailInfo("")
        }
      } else if (e.key === "Escape") {
        setEmailSearchTerm("")
        setEmailError("")
        setEmailInfo("")
      }
    },
    [emailSearchTerm, handleAddCustomEmail],
  )

  const handleSaveProfile = useCallback(
    (profile: Profile) => {
      if (editingProfile) {
        const index = seekingProfiles.findIndex((p) => p.id === profile.id)
        if (index !== -1) {
          updateSeekingProfile(index, profile)
        }
      } else {
        appendSeekingProfile(profile)
      }
      setEditingProfile(null)
      setModalOpen(false)
    },
    [editingProfile, seekingProfiles, updateSeekingProfile, appendSeekingProfile],
  )

  const handleEditProfile = useCallback((profile: Profile) => {
    // if (isDisabled) return
    setEditingProfile(profile)
    setRoleForModal(profile.roles[0] as "COLLABORATOR" | "COFOUNDER")
    setModalOpen(true)
  }, [])

  const handleDeleteProfile = useCallback(
    (profileId: string) => {
      // if (isDisabled) return
      const profile = seekingProfiles.find((p) => p.id === profileId)
      if (profile) {
        setProfileToDelete(profile)
        setConfirmationModalOpen(true)
      }
    },
    [seekingProfiles],
  )

  const handleConfirmDelete = async () => {
    if (profileToDelete) {
      const index = seekingProfiles.findIndex((p) => p.id === profileToDelete.id)

      if (index !== -1) {
        removeSeekingProfile(index)
        try {
          if (isEditMode && profileToDelete.roles.includes("COFOUNDER") && profileToDelete.date) {
            await fetchApi({
              path: `${API_PATH.DELETE_ANNOUNCEMENT_COFOUNDER}/${profileToDelete.id}`,
              init: {
                method: "DELETE",
              },
            })

            // navigate(".", {
            //   replace: true,
            //   state: {
            //     ...state,
            //     initiative: {
            //       ...state?.initiative,
            //       announcements: state?.initiative?.announcements?.filter((a) => a.id !== +profileToDelete.id),
            //     },
            //   } as { initiative: Initiative },
            // })
          }

          if (
            isEditMode &&
            profileToDelete.roles.includes("COLLABORATOR") &&
            !profileToDelete.id.startsWith("profile")
          ) {
            await fetchApi({
              path: API_PATH.DELETE_COLLABORATOR(profileToDelete.id),
              init: {
                method: "DELETE",
              },
            })
          }
        } catch (error) {
          console.error("Error al eliminar el perfil:", error)
        }
      }
    }
    setProfileToDelete(null)
    setConfirmationModalOpen(false)
  }

  const handleCloseConfirmationModal = () => {
    setProfileToDelete(null)
    setConfirmationModalOpen(false)
  }

  const handleOpenModal = useCallback((role: "COLLABORATOR" | "COFOUNDER") => {
    // if (isDisabled) return
    setEditingProfile(null)
    setRoleForModal(role)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setEditingProfile(null)
    setModalOpen(false)
  }, [])

  const handleOpenTeamMemberModal = useCallback((id: number) => {
    setSelectedTeamMemberId(id)
    setTeamModalOpen(true)
  }, [])

  const handleCloseTeamMemberModal = useCallback(() => {
    setSelectedTeamMemberId(null)
    setTeamModalOpen(false)
  }, [])

  const renderTabLabel = (text: string, count: number) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2 }}>
      <Typography component="span" sx={{ textTransform: "none", fontWeight: 500 }}>
        {text}
      </Typography>
      <Chip label={count} size="small" color="primary" />
    </Stack>
  )

  // Estilos consistentes para accordions
  const accordionSx = {
    borderRadius: 2,
    "&:before": { display: "none" },
    border: "1px solid",
    borderColor: "divider",
    "&:not(:last-child)": {
      borderBottom: "1px solid",
      borderBottomColor: "divider",
    },
    "&.Mui-expanded": {
      margin: 0,
    },
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const responseUsers = (await fetchApi({ path: API_PATH.USERS })) as UserResponse[]
      const usersData = responseUsers.map((user) => user.email)
      setUsers(usersData)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    // Solo registrar los IDs iniciales una vez cuando el componente se carga en modo edición
    if (isEditMode && seekingProfiles.length > 0 && !initialIdsSet.current) {
      setInitialProfileIds(new Set(seekingProfiles.map((p) => p.id)))
      initialIdsSet.current = true
    }
  }, [isEditMode, seekingProfiles])

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Tu Equipo Clave y Necesidades
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Define tu equipo actual y los perfiles que buscas para llevar tu iniciativa al siguiente nivel.
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        {/* Cofundadores Actuales */}
        <Accordion expanded={coFoundersExpanded} onChange={handleCoFoundersAccordion} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Group color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Cofundadores Actuales ({coFounderEmails.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega los correos de tus cofundadores. Un equipo sólido es clave.
            </Typography>
            {coFounderEmails.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {coFounderEmails.map((contact) => (
                  <motion.div key={contact} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Chip
                      avatar={<Avatar src={AVATAR_USER_NOT_IMAGE} sx={{ width: 24, height: 24 }} />}
                      label={contact}
                      onDelete={() => handleRemoveEmail(contact)}
                      color="primary"
                      variant="filled"
                      // disabled={isDisabled}
                    />
                  </motion.div>
                ))}
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box sx={{ flex: 1, position: "relative" }}>
                <FormTextField
                  register={{
                    name: "emailSearch",
                    onChange: async (e) => {
                      setEmailSearchTerm(e.target.value)
                      setEmailError("")
                      setEmailInfo("")
                      return true
                    },
                    onBlur: async () => true,
                    ref: () => {},
                  }}
                  label="Email de cofundador"
                  placeholder="Ingresar email"
                  value={emailSearchTerm}
                  onClear={() => {
                    setEmailSearchTerm("")
                    setEmailError("")
                    setEmailInfo("")
                  }}
                  onKeyPress={handleEmailSearchKeyPress}
                  error={emailError ? { message: emailError, type: "validation" } : undefined}
                  // disabled={isDisabled}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleAddCustomEmail}
                disabled={!emailSearchTerm.trim() || coFounderEmails.length >= 10}
                sx={{ height: "56px" }}
                className="text-white bg-primary"
                startIcon={<Add />}
              >
                Agregar
              </Button>
            </Box>

            {/* Alerta informativa para correos no encontrados */}
            {emailInfo && (
              <Alert
                severity="warning"
                sx={{
                  mt: 1,
                  backgroundColor: "#fff3e0",
                  "& .MuiAlert-icon": {
                    color: "#e65100",
                  },
                  "& .MuiAlert-message": {
                    color: "#e65100",
                  },
                }}
              >
                <Typography variant="body2" fontWeight="500" sx={{ color: "#e65100" }}>
                  {emailInfo}
                </Typography>
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
        {errors.coFounderEmails && (
          <Typography variant="caption" color="error">
            {errors.coFounderEmails.message}
          </Typography>
        )}

        {/* Perfil de Cofundadores */}
        <Accordion expanded={coFoundersSeekingExpanded} onChange={handleCoFoundersSeekingAccordion} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Handshake color="primary" />
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Perfil de Cofundadores
              </Typography>
              {!isEditMode && <Chip label={cofounders.length} size="small" color="primary" variant="outlined" />}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, position: "relative" }}>
            {isEditMode ? (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Equipo Actual
                    </Typography>
                    <HorizontalTeamList members={currentCofounders} onMemberClick={handleOpenTeamMemberModal} />
                  </Box>
                </motion.div>
                <Tabs
                  value={cofounderTab}
                  onChange={(_, newValue) => setCofounderTab(newValue)}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab label={renderTabLabel("Agregar Perfiles", cofoundersToSeek.length)} />
                  <Tab label={renderTabLabel("Postulaciones Realizadas", cofoundersFromBackend.length)} />
                </Tabs>
                <Box sx={{ minHeight: 180 }}>
                  {/* Pestaña de Agregar Vacante */}
                  <Box hidden={cofounderTab !== 0}>
                    <Box sx={{ p: 2, pt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Publica una vacante para encontrar al cofundador ideal que comparta tu visión.
                      </Typography>
                      <Button
                        onClick={() => handleOpenModal("COFOUNDER")}
                        variant="contained"
                        startIcon={<Add />}
                        // disabled={isDisabled}
                      >
                        Agregar Perfil
                      </Button>
                    </Box>
                    <HorizontalProfileList
                      profiles={cofoundersToSeek}
                      onEdit={handleEditProfile}
                      onDelete={handleDeleteProfile}
                      CardComponent={ProfileCard}
                      // disabled={isDisabled}
                    />
                  </Box>
                  {/* Pestaña de Postulaciones Recibidas */}
                  <Box hidden={cofounderTab !== 1}>
                    <HorizontalProfileList
                      profiles={cofoundersFromBackend}
                      CardComponent={ApplicationCard}
                      onDelete={handleDeleteProfile}
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Publica una vacante para encontrar al cofundador ideal que comparta tu visión.
                  </Typography>
                  <Button
                    onClick={() => handleOpenModal("COFOUNDER")}
                    variant="contained"
                    startIcon={<Add />}
                    // disabled={isDisabled}
                  >
                    Agregar Vacante
                  </Button>
                </Box>
                <HorizontalProfileList
                  profiles={cofounders}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteProfile}
                  CardComponent={ProfileCard}
                  // disabled={isDisabled}
                />
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Perfil de Colaboradores */}
        <Accordion
          ref={refAccordionCollaborators}
          id="collaborators-profile"
          expanded={collaboratorsExpanded}
          onChange={handleCollaboratorsAccordion}
          sx={accordionSx}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <People color="primary" />
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Perfil de Colaboradores
              </Typography>
              {!isEditMode && <Chip label={collaborators.length} size="small" color="primary" variant="outlined" />}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, position: "relative" }}>
            {isEditMode ? (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Equipo Actual
                    </Typography>
                    <HorizontalTeamList members={currentCollaborators} onMemberClick={handleOpenTeamMemberModal} />
                  </Box>
                </motion.div>
                <Tabs
                  value={collaboratorTab}
                  onChange={(_, newValue) => setCollaboratorTab(newValue)}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab label={renderTabLabel("Agregar Perfiles", collaboratorsToSeek.length)} />
                  <Tab label={renderTabLabel("Postulaciones Realizadas", collaboratorsFromBackend.length)} />
                </Tabs>
                <Box sx={{ minHeight: 180 }}>
                  {/* Pestaña de Agregar Perfil */}
                  <Box hidden={collaboratorTab !== 0}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Define los perfiles de colaboradores que necesitas para tu equipo.
                      </Typography>
                      <Button
                        onClick={() => handleOpenModal("COLLABORATOR")}
                        variant="contained"
                        startIcon={<Add />}
                        // disabled={isDisabled}
                      >
                        Agregar Perfil
                      </Button>
                    </Box>
                    <HorizontalProfileList
                      profiles={collaboratorsToSeek}
                      onEdit={handleEditProfile}
                      onDelete={handleDeleteProfile}
                      CardComponent={ProfileCard}
                      // disabled={isDisabled}
                    />
                  </Box>
                  {/* Pestaña de Postulaciones Recibidas */}
                  <Box hidden={collaboratorTab !== 1}>
                    <HorizontalProfileList
                      profiles={collaboratorsFromBackend}
                      // Sin onEdit ni onDelete para ocultar botones
                      CardComponent={ProfileCard}
                      onDelete={handleDeleteProfile}
                      // disabled={isDisabled}
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Define los perfiles de colaboradores que necesitas para tu equipo.
                  </Typography>
                  <Button
                    onClick={() => handleOpenModal("COLLABORATOR")}
                    variant="contained"
                    startIcon={<Add />}
                    // disabled={isDisabled}
                  >
                    Agregar Perfil
                  </Button>
                </Box>
                <HorizontalProfileList
                  profiles={collaborators}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteProfile}
                  CardComponent={ProfileCard}
                  // disabled={isDisabled}
                />
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {errors.seekingProfiles && <Alert severity="error">{errors.seekingProfiles.message}</Alert>}
      </motion.div>

      {/* Modal para agregar/editar perfiles */}
      <ProfileModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
        initialProfile={editingProfile || undefined}
        isEditing={!!editingProfile}
        roleToCreate={roleForModal}
      />
      <UserProfileModal userId={selectedTeamMemberId} open={isTeamModalOpen} onClose={handleCloseTeamMemberModal} />
      <ConfirmationModal
        open={confirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
        variant="delete"
        context="seekingProfile"
        details={{
          name: profileToDelete?.generalSkills[0],
        }}
      />
    </Box>
  )
}

export default Step3Component
