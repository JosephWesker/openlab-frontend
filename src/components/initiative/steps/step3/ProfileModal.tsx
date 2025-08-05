import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import { motion } from "motion/react"
import { useSkillsStore } from "@/stores/skillsStore"
import { useShallow } from "zustand/react/shallow"
import { AVATAR_PROFILE_POSTULATION } from "@/lib/constants"
import { FormTextField } from "../shared/FormTextField"

interface Profile {
  id: string
  roles: string[]
  generalSkills: string[]
  technicalSkills: string[]
  avatar: string
  additionalDescription?: string
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

export const ProfileModal = ({
  open,
  onClose,
  onSave,
  initialProfile,
  isEditing = false,
  roleToCreate,
}: ProfileModalProps) => {
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

  useEffect(() => {
    if (open) {
      if (initialProfile && isEditing) {
        setSelectedGeneralSkill(initialProfile.generalSkills || [])
        setSelectedTechnicalSkills(initialProfile.technicalSkills || [])
        setAdditionalDescription(initialProfile.additionalDescription || "")
        setCurrentAvatar(initialProfile.avatar || AVATAR_PROFILE_POSTULATION)
      } else {
        setSelectedGeneralSkill([])
        setSelectedTechnicalSkills([])
        setAdditionalDescription("")
        setCurrentAvatar(AVATAR_PROFILE_POSTULATION)
      }
      setError("")
    }
  }, [open, initialProfile, isEditing])

  const handleSave = () => {
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
        <Typography variant="h6" fontWeight="700" color="primary.main" className="text-base md:text-lg">
          Perfil en OpenLab
        </Typography>
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
        <Typography variant="h6" fontWeight="700" color="primary.main" className="text-base md:text-lg">
          Habilidad general
        </Typography>
        <Autocomplete
          multiple
          freeSolo
          id="general-skill-autocomplete"
          options={skillsGeneral}
          value={selectedGeneralSkill}
          onChange={(_, newValue) => {
            if (newValue.length > 1) {
              newValue = newValue.slice(-1)
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

