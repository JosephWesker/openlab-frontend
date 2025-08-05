import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Fade,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Container,
  IconButton,
  Chip,
  Alert,
  Autocomplete,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import openLabLogo from "@/assets/images/logo.webp"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useOnboardingStore } from "@/stores/onboardingStore"
import { useApi } from "@/hooks/useApi"
import { API_PATH } from "@/lib/constants"
import { useSkillsStore } from "@/stores/skillsStore"
import { useShallow } from "zustand/react/shallow"
import type { RoleEntity } from "@/interfaces/user"
import collaboratorImage from "@/assets/images/onboarding/collaborator.png"
import leaderImage from "@/assets/images/onboarding/leader.png"
import investorImage from "@/assets/images/onboarding/investor.png"
import { communityEvents } from "@/lib/clarityEvents"

// Esquema de validación con Zod
const userProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
  roles: z.array(z.string()).optional(),
  skillsGeneral: z.array(z.string()).optional(),
})

// Tipos para los props de los componentes
interface StepProps {
  onContinue: () => void
  onBack?: () => void
  showBack?: boolean
}

// Componente de paso 1: Bienvenida
const Step1 = ({ onContinue, onBack, showBack, name }: StepProps & { name?: string }) => {
  const { data, updateData } = useOnboardingStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userProfileSchema.pick({ name: true })),
    defaultValues: { name: data.name || "" },
  })
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const onSubmit = async (formData: { name?: string }) => {
    try {
      setHasSubmitted(true)
      updateData({ name: formData.name })
      onContinue()
    } catch (error) {
      console.error(error)
    }
  }

  const onInvalidSubmit = () => {
    setHasSubmitted(true)
  }

  return (
    <Fade in={true} timeout={800}>
      <Box className="flex flex-col items-center justify-center max-w-2xl mx-auto">
        {showBack && (
          <Box className="self-start mb-4">
            <IconButton onClick={onBack} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Box>
        )}

        <Box className="w-full text-center mb-8">
          <Typography variant="h4" component="h1" className="font-bold my-6 px-10 text-primary">
            ¡Bienvenido/a a OpenLab, {name}!
          </Typography>

          <Typography variant="body1" className="my-4 text-center text-gray-700">
            Completa tu perfil para conectar con la comunidad, compartir tus ideas y colaborar en proyectos innovadores.
          </Typography>

          <Box className="my-6">
            <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="w-full">
              <Box className="mb-4">
                <Typography variant="body1" className="mb-2 text-left">
                  * Ingresa tu nombre
                </Typography>

                <TextField
                  fullWidth
                  placeholder="Nombre"
                  {...register("name")}
                  error={hasSubmitted && !!errors.name}
                  className="rounded-md mb-2"
                />

                {hasSubmitted && errors.name && (
                  <Alert severity="error" className="mt-1 mb-2 w-full">
                    {errors.name.message}
                  </Alert>
                )}
              </Box>

              <Box className="mt-8 flex flex-col gap-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  className="w-full py-3 rounded-md"
                >
                  Continuar
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

// Componente de paso 2: Roles de participación
const Step2 = ({ onContinue, onBack, showBack }: StepProps) => {
  const { data, updateData } = useOnboardingStore()
  const [selectedRoles, setSelectedRoles] = useState<string[]>(data.roles || [])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleRoleSelect = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
    if (error) setError("")
  }

  const roles = [
    {
      id: "COLLABORATOR",
      title: "Colaborador",
      description:
        "¿Listo para poner tus habilidades en acción? Explora proyectos interesantes que necesitan tu talento y contribuye directamente a su construcción junto a otros miembros de la comunidad.",
      image: collaboratorImage, // Placeholder para imagen
    },
    {
      id: "LEADER",
      title: "Líder/Fundador",
      description:
        "¿Tienes una gran idea? ¡Este es tu lugar! Propón tus proyectos innovadores, encuentra co-fundadores y lidera la creación de algo nuevo con el apoyo de la comunidad.",
      image: leaderImage, // Placeholder para imagen
    },
    {
      id: "INVESTOR",
      title: "Inversionista",
      description:
        "¿Buscas proyectos con potencial? Descubre iniciativas prometedoras en etapas tempranas y apoya su desarrollo para ser parte de su crecimiento y éxito futuro.",
      image: investorImage, // Placeholder para imagen
    },
  ]

  const handleSubmit = () => {
    setHasSubmitted(true)

    if (selectedRoles.length === 0) {
      setError("Por favor selecciona al menos un rol para continuar")
      return
    }

    updateData({ roles: selectedRoles })
    onContinue()
  }

  return (
    <Fade in={true} timeout={800}>
      <Box className="flex flex-col items-center max-w-4xl mx-auto relative mt-6">
        {showBack && (
          <Box className="absolute top-0 left-0">
            <IconButton onClick={onBack} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Box>
        )}

        <Typography variant="h4" component="h1" className="font-bold mb-6 text-center text-primary px-10">
          ¿Cómo te gustaría participar en OpenLab?
        </Typography>

        <Typography variant="body1" className="mb-8 text-center">
          Selecciona uno o varios roles que describan tu interés en la plataforma. Puedes elegir uno, dos o todos los
          roles.
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-2">
          {roles.map((role) => (
            <Paper
              key={role.id}
              elevation={selectedRoles.includes(role.id) ? 4 : 1}
              className={`p-6 cursor-pointer transition-all relative ${selectedRoles.includes(role.id) ? "border-2 border-blue-500" : ""} ${hasSubmitted && selectedRoles.length === 0 ? "border border-red-300" : ""}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              {selectedRoles.includes(role.id) && (
                <CheckCircleIcon className="absolute top-2 right-2 text-blue-500" fontSize="medium" />
              )}
              <Typography variant="h6" className="font-medium mb-2">
                {role.title}
              </Typography>

              <Box className="my-4 flex justify-center">
                <Box className="size-32 rounded-md flex items-center justify-center">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="aspect-square w-full h-full object-contain"
                    // style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.6))" }}
                  />
                </Box>
              </Box>

              <Typography variant="body2" className="text-gray-700">
                {role.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {hasSubmitted && error && (
          <Alert severity="error" className="mt-1 mb-4 w-full">
            {error}
          </Alert>
        )}

        <Box className="mt-4 flex flex-col gap-2 w-full max-w-xs">
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
            className="w-full py-3 rounded-md"
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Fade>
  )
}

// Componente de paso 3: Habilidades
const Step3 = ({ onContinue, onBack, showBack }: StepProps) => {
  const { data, updateData } = useOnboardingStore(
    useShallow((state) => ({ data: state.data, updateData: state.updateData })),
  )
  const [selectedSkills, setSelectedSkills] = useState<string[]>(data.skillsGeneral || [])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const skillsGeneral = useSkillsStore((state) => state.skills.general)

  const handleSubmit = () => {
    setHasSubmitted(true)

    if (selectedSkills.length === 0) {
      setError("Por favor selecciona al menos una habilidad para continuar")
      return
    }

    // const newlyCreated = selectedSkills.filter((skill) => !skillsGeneral.includes(skill))

    updateData({ skillsGeneral: selectedSkills })
    onContinue()
  }

  return (
    <Fade in={true} timeout={800}>
      <Box className="flex flex-col items-center max-w-2xl mx-auto relative">
        {showBack && (
          <Box className="absolute top-0 left-0">
            <IconButton onClick={onBack} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Box>
        )}

        <Typography variant="h4" component="h1" className="font-bold mb-6 text-center px-10 text-primary">
          Tus Habilidades Generales
        </Typography>

        <Typography variant="body1" className="mb-8 text-center">
          Comparte tus habilidades y áreas de interés para que otros colaboradores o líderes de proyecto puedan
          encontrarte para futuras colaboraciones.
        </Typography>

        <Box className="w-full">
          <Typography variant="body1" className="mb-2 text-left">
            Selecciona tus habilidades
          </Typography>

          <Autocomplete
            multiple
            open={autocompleteOpen}
            onOpen={() => setAutocompleteOpen(true)}
            onClose={() => setAutocompleteOpen(false)}
            options={skillsGeneral}
            value={selectedSkills}
            onChange={(_, newValue) => {
              const sanitized = newValue.map((skill) =>
                typeof skill === "string" ? skill.trim().toUpperCase() : skill,
              )
              setSelectedSkills([...new Set(sanitized)])
              if (error) setError("")
            }}
            freeSolo={false}
            disableCloseOnSelect
            noOptionsText="Selecciona de la lista"
            ListboxProps={{
              style: {
                maxHeight: "25vh",
              },
              sx: {
                // Scrollbar personalizado
                "&::-webkit-scrollbar": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.main",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Habilidades generales"
                placeholder="Haz clic para seleccionar"
                error={hasSubmitted && selectedSkills.length === 0}
                InputProps={{
                  ...params.InputProps,
                  readOnly: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  style: {
                    cursor: "pointer",
                    caretColor: "transparent",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    cursor: "pointer",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  },
                  "& .MuiInputBase-input": {
                    cursor: "pointer !important",
                    "&:hover": {
                      cursor: "pointer !important",
                    },
                  },
                  "& .MuiAutocomplete-inputRoot": {
                    cursor: "pointer",
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { ...tagProps } = getTagProps({ index })
                return (
                  <Chip
                    {...tagProps}
                    key={option}
                    label={option}
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      // Solo toggle dropdown si no se hizo clic en la X
                      const target = e.target as HTMLElement
                      if (!target.closest(".MuiChip-deleteIcon")) {
                        setAutocompleteOpen(!autocompleteOpen)
                      }
                    }}
                    onDelete={(e) => {
                      e.stopPropagation()
                      const newSelected = selectedSkills.filter((skill) => skill !== option)
                      setSelectedSkills(newSelected)
                      if (error) setError("")
                    }}
                    sx={{
                      "& .MuiChip-deleteIcon": {
                        color: "primary.main",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      },
                    }}
                  />
                )
              })
            }
          />

          {hasSubmitted && error && (
            <Alert severity="error" className="mt-1 mb-4 w-full">
              {error}
            </Alert>
          )}
        </Box>

        <Box className="mt-4 flex flex-col gap-2 w-full max-w-xs">
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
            className="w-full py-3 rounded-md"
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Fade>
  )
}

export default function PageOnBoarding() {
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { setUserFromApi, userFromApi } = useAuthContext()
  const setOnboardingCompleted = useOnboardingStore((state) => state.setOnboardingCompleted)
  const navigate = useNavigate()
  const fetchApi = useApi()
  const setSkills = useSkillsStore((state) => state.setSkills)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setSkills(fetchApi)
      } catch (err) {
        console.error("Error cargando skills:", err)
      }
    }

    loadSkills()
  }, [])

  const handleSetUserFromApi = () => {
    setOnboardingCompleted(true)
    navigate("/")
  }

  const completeOnboarding = async () => {
    setIsLoading(true)

    const { data: currentOnboardingData, clearData } = useOnboardingStore.getState()

    try {
      await Promise.all([
        currentOnboardingData.name
          ? fetchApi({
              path: API_PATH.USERS,
              init: {
                method: "PUT",
                body: JSON.stringify({
                  id: userFromApi?.id,
                  name: currentOnboardingData.name,
                }),
              },
            })
          : null,
        currentOnboardingData.roles?.length
          ? fetchApi({
              path: API_PATH.ROLE_UPDATE,
              init: {
                method: "PUT",
                body: JSON.stringify({
                  roleNames: currentOnboardingData.roles,
                }),
              },
            })
          : null,
        currentOnboardingData.skillsGeneral?.length
          ? fetchApi({
              path: API_PATH.USER_SKILL,
              init: {
                method: "PUT",
                body: JSON.stringify({
                  userId: userFromApi?.id,
                  skills: [
                    ...(userFromApi?.skills?.general || []),
                    ...(userFromApi?.skills?.technical || []),
                    ...currentOnboardingData.skillsGeneral,
                  ],
                }),
              },
            })
          : null,
      ])

      setUserFromApi({
        ...userFromApi!,
        name: currentOnboardingData.name ?? userFromApi!.name,
        roles: (currentOnboardingData.roles as RoleEntity[]) ?? userFromApi?.roles,
        skills: {
          ...userFromApi!.skills,
          general: [...(userFromApi?.skills?.general || []), ...(currentOnboardingData.skillsGeneral || [])],
        },
      })

      communityEvents.onboardingCompleted()

      clearData()
    } finally {
      setIsLoading(false)
      handleSetUserFromApi()
    }
  }

  const handleContinue = () => {
    if (activeStep === 2) {
      completeOnboarding()
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Step1 onContinue={handleContinue} onBack={handleBack} showBack={false} name={userFromApi?.name} />
      case 1:
        return <Step2 onContinue={handleContinue} onBack={handleBack} showBack={true} />
      case 2:
        return <Step3 onContinue={handleContinue} onBack={handleBack} showBack={true} />
      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" className="min-h-screen flex flex-col p-6">
      <Box className="flex justify-center mb-6">
        <img src={openLabLogo} alt="OpenLab Logo" className="h-12" />
      </Box>

      <Box>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Paso 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Paso 2</StepLabel>
          </Step>
          <Step>
            <StepLabel>Paso 3</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <Box className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <Box className="flex justify-center my-12">
            <CircularProgress />
          </Box>
        ) : (
          renderStep()
        )}
      </Box>

      <Box className="text-center pt-2">
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} OpenLab. All rights reserved.
        </Typography>
      </Box>
    </Container>
  )
}
