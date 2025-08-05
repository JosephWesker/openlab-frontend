import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  Stack,
  Chip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Alert,
  Autocomplete,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useAuthContext } from "@/hooks/useAuthContext"
import { Web, Twitter, GitHub, Instagram, Facebook, Close, LinkedIn, Chat } from "@mui/icons-material"
import { useSkillsStore } from "@/stores/skillsStore"
import { useApi } from "@/hooks/useApi"
import { API_PATH, AVATAR_USER_NOT_IMAGE, ROLES, SNACKBAR_MESSAGE } from "@/lib/constants"
import { useSnackbar } from "@/context/SnackbarContext"
import type { RoleEntity } from "@/interfaces/user"
import { profileEditSchema, type ProfileEditFormData } from "@/schemas/profile"
import { useShallow } from "zustand/react/shallow"
import { motion } from "motion/react"
import { FormTextField } from "@/components/initiative/steps/shared/FormTextField"
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload"
import { FullScreenLoader } from "@/components/ui/FullScreenLoader"
import { ValidationErrorDisplay } from "@/components/ui/ValidationErrorDisplay"
import { useAuth0 } from "@auth0/auth0-react"

interface SkillsDialogProps {
  open: boolean
  onClose: () => void
  onSave: (payload: { existing: string[]; new: string[] }) => void
  title: string
  type: "general" | "technical"
  initialSkills: string[]
}

// Componente para editar habilidades
const SkillsDialog = ({ open, onClose, onSave, title, type, initialSkills }: SkillsDialogProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { skillsGeneral, skillsTechnical } = useSkillsStore(
    useShallow((state) => ({
      skillsGeneral: state.skills.general,
      skillsTechnical: state.skills.technical,
    })),
  )

  // Sincronizar con las habilidades iniciales cuando cambie el tipo
  useEffect(() => {
    setSelectedSkills(initialSkills)
    setHasSubmitted(false)
    setError("")
  }, [initialSkills, open])

  const handleSave = () => {
    setHasSubmitted(true)

    if (selectedSkills.length === 0) {
      setError("Por favor selecciona al menos una habilidad")
      return
    }

    const existing = selectedSkills.filter((skill) => skillsGeneral.includes(skill))
    const newlyCreated = selectedSkills.filter((skill) => !skillsGeneral.includes(skill))

    onSave({ existing, new: newlyCreated })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Fade} transitionDuration={400}>
      <DialogTitle component="div" className="flex justify-between items-center">
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="mb-6">
          <Typography variant="body1" className="mb-4">
            Comparte tus habilidades y áreas de interés para que otros colaboradores o líderes de proyecto puedan
            encontrarte para futuras colaboraciones.
          </Typography>

          {type === "general" && (
            <Box className="mt-4">
              <Autocomplete
                multiple
                freeSolo
                options={skillsGeneral}
                value={selectedSkills}
                onChange={(_, newValue) => {
                  const sanitized = newValue.map((skill) =>
                    typeof skill === "string" ? skill.trim().toUpperCase() : skill,
                  )
                  setSelectedSkills([...new Set(sanitized)])
                  if (error) setError("")
                }}
                filterOptions={(options, params) => {
                  const filtered = options.filter((option) =>
                    option.toLowerCase().includes(params.inputValue.toLowerCase()),
                  )
                  const isExisting = options.some(
                    (option) => params.inputValue.toUpperCase() === option || params.inputValue === option,
                  )
                  if (params.inputValue !== "" && !isExisting) {
                    filtered.push(params.inputValue.toUpperCase())
                  }
                  return filtered
                }}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const isNew = !skillsGeneral.includes(option)
                  return (
                    <li {...props}>
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
                    label="Habilidades generales"
                    placeholder="Selecciona o escribe una habilidad"
                    error={hasSubmitted && selectedSkills.length === 0}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index })
                    return <Chip label={option} color="primary" size="small" {...tagProps} />
                  })
                }
              />
            </Box>
          )}

          {hasSubmitted && error && (
            <Alert severity="error" className="mt-1 mb-4 w-full">
              {error}
            </Alert>
          )}

          {type === "technical" && (
            <Box className="mt-4">
              <Autocomplete
                multiple
                freeSolo
                options={skillsTechnical}
                value={selectedSkills}
                onChange={(_, newValue) => {
                  const sanitized = newValue.map((skill) =>
                    typeof skill === "string" ? skill.trim().toUpperCase() : skill,
                  )
                  setSelectedSkills([...new Set(sanitized)])
                  if (error) setError("")
                }}
                filterOptions={(options, params) => {
                  const filtered = options.filter((option) =>
                    option.toLowerCase().includes(params.inputValue.toLowerCase()),
                  )
                  const isExisting = options.some(
                    (option) => params.inputValue.toUpperCase() === option || params.inputValue === option,
                  )
                  if (params.inputValue !== "" && !isExisting) {
                    filtered.push(params.inputValue.toUpperCase())
                  }
                  return filtered
                }}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const isNew = !skillsTechnical.includes(option)
                  return (
                    <li {...props}>
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
                    error={hasSubmitted && selectedSkills.length === 0}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index })
                    return <Chip label={option} {...tagProps} />
                  })
                }
              />
            </Box>
          )}
        </Box>

        <Box className="flex justify-center gap-4 mt-6">
          <Button variant="contained" color="primary" onClick={handleSave} className="py-2 px-6">
            Guardar
          </Button>
          <Button variant="text" color="inherit" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default function PageDashboardProfileEdit() {
  const navigate = useNavigate()
  const { userFromApi, setUserFromApi } = useAuthContext()
  const [openSkillsDialog, setOpenSkillsDialog] = useState(false)
  const [skillsDialogType, setSkillsDialogType] = useState<"general" | "technical">("general")
  const [selectedRoles, setSelectedRoles] = useState<RoleEntity[]>(userFromApi?.roles || [])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [generalSkills, setGeneralSkills] = useState<string[]>(userFromApi?.skills?.general || [])
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(userFromApi?.skills?.technical || [])
  const [newlyCreatedGeneralSkills, setNewlyCreatedGeneralSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<string | undefined>(userFromApi?.image || undefined)
  const fetchApi = useApi()
  const { showSnackbar } = useSnackbar()
  const { user: auth0User } = useAuth0()

  // Configuración de React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: userFromApi?.name.trim() || "",
      email: userFromApi?.email.trim() || "",
      discord: userFromApi?.social?.discord?.trim() || "",
      github: userFromApi?.social?.github?.trim() || "",
      linkedin: userFromApi?.social?.linkedIn?.trim() || "",
      facebook: userFromApi?.social?.facebook?.trim() || "",
      twitter: userFromApi?.social?.twitter?.trim() || "",
      instagram: userFromApi?.social?.instagram?.trim() || "",
      other: userFromApi?.social?.other?.trim() || "",
      roles: userFromApi?.roles || [],
      description: userFromApi?.description?.trim() || "",
    },
    mode: "onSubmit",
  })

  // Observar los valores del formulario para los botones "X"
  const watchedValues = watch()

  const handleAction = (path: string) => {
    navigate(path)
  }

  // Handler para la imagen de perfil
  const handleProfileImageSelect = (url: string | undefined) => {
    setProfileImage(url)
  }

  // Función para manejar el envío del formulario
  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      setIsSubmitting(true)

      // Creando habilidad general nueva
      if (newlyCreatedGeneralSkills.length > 0) {
        await fetchApi({
          path: API_PATH.USER_SKILL,
          init: {
            method: "POST",
            body: JSON.stringify({
              skills: newlyCreatedGeneralSkills,
            }),
          },
        })
      }

      // Enviar datos al backend
      await Promise.all([
        fetchApi({
          path: API_PATH.USERS,
          init: {
            method: "PUT",
            body: JSON.stringify({
              id: userFromApi?.id,
              name: data.name?.trim(),
              profilePic: profileImage || auth0User?.picture || AVATAR_USER_NOT_IMAGE,
              github: data.github?.trim(),
              linkd: data.linkedin?.trim(),
              discord: data.discord?.trim(),
              facebook: data.facebook?.trim(),
              twitter: data.twitter?.trim(),
              instagram: data.instagram?.trim(),
              other: data.other?.trim(),
              description: data.description?.trim(),
            }),
          },
        }),

        selectedRoles.length > 0 &&
          fetchApi({
            path: API_PATH.ROLE_UPDATE,
            init: {
              method: "PUT",
              body: JSON.stringify({ roleNames: selectedRoles }),
            },
          }),

        (generalSkills.length > 0 || technicalSkills.length > 0) &&
          fetchApi({
            path: API_PATH.USER_SKILL,
            init: {
              method: "PUT",
              body: JSON.stringify({
                userId: userFromApi?.id,
                skills: [...generalSkills, ...technicalSkills],
              }),
            },
          }),
      ])

      setUserFromApi({
        ...userFromApi!,
        name: data.name?.trim(),
        email: data.email?.trim(),
        image: profileImage || auth0User?.picture || AVATAR_USER_NOT_IMAGE, // Actualizar la imagen en el contexto
        social: {
          ...userFromApi?.social,
          github: data.github?.trim() || null,
          linkedIn: data.linkedin?.trim() || null,
          discord: data.discord?.trim() || null,
          facebook: data.facebook?.trim() || null,
          twitter: data.twitter?.trim() || null,
          instagram: data.instagram?.trim() || null,
          other: data.other?.trim() || null,
        },
        description: data.description?.trim() || null,
        roles: selectedRoles || [],
        skills: {
          general: generalSkills,
          technical: technicalSkills,
        },
      })

      showSnackbar(SNACKBAR_MESSAGE.USER_UPDATED)

      handleAction("/profile")
    } catch{
      showSnackbar(SNACKBAR_MESSAGE.USER_UPDATED_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveSkills = (payload: { existing: string[]; new: string[] }) => {
    const allSkills = [...payload.existing, ...payload.new]
    if (skillsDialogType === "general") {
      setGeneralSkills(allSkills)
      setNewlyCreatedGeneralSkills(payload.new)
    } else {
      setTechnicalSkills(allSkills)
      // Podrías añadir un estado similar para las habilidades técnicas si es necesario
    }
    setOpenSkillsDialog(false)
  }

  const handleOpenSkillsDialog = (type: "general" | "technical") => {
    setSkillsDialogType(type)
    setOpenSkillsDialog(true)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleRoleToggle = (role: RoleEntity) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const isMenuOpen = Boolean(anchorEl)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <FullScreenLoader isLoading={isSubmitting} />
      <Box className="flex justify-between items-center mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-primary">
          Editar Perfil
        </Typography>
        <IconButton
          className="bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => handleAction("/profile")}
          disabled={isSubmitting}
        >
          <Close />
        </IconButton>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <Paper className="p-8 rounded-xl shadow-md">
          {/* Sección de imagen de perfil */}
          <Box className="flex flex-col items-center mb-8">
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.15rem" }} color="primary.main">
              Imagen de Perfil
            </Typography>
            <ProfileImageUpload
              profileImage={profileImage}
              onImageSelect={handleProfileImageSelect}
              disabled={isSubmitting}
            />
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} style={{ border: "none" }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: "1.15rem" }} color="primary.main">
                    Roles
                  </Typography>
                  <FormControl fullWidth className="mb-1">
                    <Box
                      className={`flex flex-wrap justify-center items-center p-2 border rounded-md gap-1 min-h-[56px] ${
                        !isSubmitting ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                      } border-gray-300`}
                      onClick={!isSubmitting ? handleOpenMenu : undefined}
                    >
                      {selectedRoles.length > 0 ? (
                        <>
                          {selectedRoles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              onDelete={() => handleRoleToggle(role)}
                              color="primary"
                              size="small"
                              className="m-0.5 !capitalize"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ))}
                          <Box className="ml-auto flex items-center">
                            <ExpandMoreIcon />
                          </Box>
                        </>
                      ) : (
                        <Box className="flex items-center text-gray-500 w-full justify-between">
                          <span>Selecciona uno o más roles</span>
                          <ExpandMoreIcon />
                        </Box>
                      )}
                    </Box>

                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleCloseMenu}
                      slotProps={{
                        paper: {
                          style: {
                            maxHeight: 300,
                            width: anchorEl?.clientWidth,
                          },
                          elevation: 3,
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      {ROLES.map((role) => (
                        <MenuItem
                          key={role}
                          onClick={() => handleRoleToggle(role)}
                          selected={selectedRoles.includes(role)}
                          sx={{
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={selectedRoles.includes(role)}
                            color="primary"
                            size="small"
                            sx={{ marginRight: 1 }}
                          />
                          <Typography variant="body1" className="!capitalize">
                            {role}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </FormControl>
                </Box>

                {/* Información Personal */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.15rem" }} color="primary.main">
                    Información Personal
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr" },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <FormTextField
                        register={register("name")}
                        label="Nombre del usuario"
                        placeholder="Nombre"
                        value={watchedValues.name || ""}
                        error={errors.name}
                        onClear={() => setValue("name", "", { shouldValidate: true })}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.name} />
                    </Box>

                    <Box>
                      <FormTextField
                        register={register("email")}
                        label="Correo electrónico"
                        placeholder="Email"
                        value={watchedValues.email || ""}
                        error={errors.email}
                        onClear={() => setValue("email", "", { shouldValidate: true })}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={true}
                      />
                      <ValidationErrorDisplay error={errors.email} />
                    </Box>

                    {/* Descripción */}
                    <Box>
                      <FormTextField
                        register={register("description")}
                        label="Descripción"
                        placeholder="Describe un poco sobre ti y tus intereses"
                        value={watchedValues.description || ""}
                        error={errors.description}
                        onClear={() => setValue("description", "", { shouldValidate: true })}
                        multiline={true}
                        rows={4}
                        maxLength={255}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.description} />
                    </Box>
                  </Box>
                </Box>

                {/* Redes Sociales */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.15rem" }} color="primary.main">
                    Redes sociales
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <FormTextField
                        register={register("discord")}
                        label="Discord"
                        placeholder="https://discord.com/users/usuario"
                        value={watchedValues.discord || ""}
                        error={errors.discord}
                        onClear={() => setValue("discord", "", { shouldValidate: true })}
                        icon={Chat}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.discord} />
                    </motion.div>

                    <motion.div
                      id="github-input-container" // ID para el contenedor más externo
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <FormTextField
                        register={register("github")}
                        label="GitHub"
                        placeholder="https://github.com/usuario"
                        value={watchedValues.github || ""}
                        error={errors.github}
                        onClear={() => setValue("github", "", { shouldValidate: true })}
                        icon={GitHub}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        inputProps={{ id: "github-input-field" }} // ID para el <input> interno
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.github} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <FormTextField
                        register={register("linkedin")}
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/usuario"
                        value={watchedValues.linkedin || ""}
                        error={errors.linkedin}
                        onClear={() => setValue("linkedin", "", { shouldValidate: true })}
                        icon={LinkedIn}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.linkedin} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <FormTextField
                        register={register("facebook")}
                        label="Facebook"
                        placeholder="https://facebook.com/usuario"
                        value={watchedValues.facebook || ""}
                        error={errors.facebook}
                        onClear={() => setValue("facebook", "", { shouldValidate: true })}
                        icon={Facebook}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.facebook} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <FormTextField
                        register={register("twitter")}
                        label="Twitter"
                        placeholder="https://twitter.com/usuario"
                        value={watchedValues.twitter || ""}
                        error={errors.twitter}
                        onClear={() => setValue("twitter", "", { shouldValidate: true })}
                        icon={Twitter}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.twitter} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <FormTextField
                        register={register("instagram")}
                        label="Instagram"
                        placeholder="https://instagram.com/usuario"
                        value={watchedValues.instagram || ""}
                        error={errors.instagram}
                        onClear={() => setValue("instagram", "", { shouldValidate: true })}
                        icon={Instagram}
                        labelFontSize="1.15rem"
                        legendFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.instagram} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <FormTextField
                        register={register("other")}
                        label="Web/Otros"
                        placeholder="https://mi-sitio-web.com"
                        value={watchedValues.other || ""}
                        error={errors.other}
                        onClear={() => setValue("other", "", { shouldValidate: true })}
                        icon={Web}
                        labelFontSize="0.875rem"
                        disabled={isSubmitting}
                      />
                      <ValidationErrorDisplay error={errors.other} />
                    </motion.div>
                  </Box>
                </Box>

                <Box>
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="h6" sx={{ fontSize: "1.15rem" }} color="primary.main">
                      Habilidades generales
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenSkillsDialog("general")}
                      className="!font-medium !px-4 !py-2"
                      disabled={isSubmitting}
                    >
                      ✏️ Editar
                    </Button>
                  </Box>
                  <Box className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md min-h-[56px]">
                    {generalSkills.length > 0 ? (
                      generalSkills.map((skill) => (
                        <Chip key={skill} label={skill} color="primary" size="small" className="m-0.5 !capitalize" />
                      ))
                    ) : (
                      <Typography variant="body2" className="text-gray-500 p-2">
                        No hay habilidades generales seleccionadas
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="h6" sx={{ fontSize: "1.15rem" }} color="primary.main">
                      Habilidades técnicas
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenSkillsDialog("technical")}
                      className="!font-medium !px-4 !py-2"
                      disabled={isSubmitting}
                    >
                      ✏️ Editar
                    </Button>
                  </Box>
                  <Box className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-md min-h-[56px]">
                    {technicalSkills.length > 0 ? (
                      technicalSkills.map((skill) => (
                        <Chip key={skill} label={skill} color="secondary" size="small" className="m-0.5 !capitalize" />
                      ))
                    ) : (
                      <Typography variant="body2" className="text-gray-500 p-2">
                        No hay habilidades técnicas seleccionadas
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </fieldset>
            <Box className="flex gap-4 mt-8 justify-center">
              <Button
                id="save-profile-button"
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="py-3 px-8 rounded-lg"
                sx={{
                  backgroundColor: "primary.main",
                  "&:disabled": {
                    color: "white",
                    backgroundColor: "primary.main",
                  },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
              <Button
                type="button"
                variant="text"
                color="inherit"
                size="large"
                className="py-3 px-8 rounded-lg"
                onClick={() => handleAction("/profile")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>

      {/* Diálogo para editar habilidades */}
      <SkillsDialog
        open={openSkillsDialog}
        onClose={() => setOpenSkillsDialog(false)}
        onSave={handleSaveSkills}
        title={
          skillsDialogType === "general"
            ? "Selecciona tus habilidades generales"
            : "Selecciona tus habilidades técnicas"
        }
        type={skillsDialogType}
        initialSkills={skillsDialogType === "general" ? generalSkills : technicalSkills}
      />
    </motion.div>
  )
}
