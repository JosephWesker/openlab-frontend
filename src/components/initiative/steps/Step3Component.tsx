import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Stack from "@mui/material/Stack"
import Add from "@mui/icons-material/Add"
import Group from "@mui/icons-material/Group"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Handshake from "@mui/icons-material/Handshake"
import People from "@mui/icons-material/People"
import { motion } from "motion/react"
import { useFormContext, useFieldArray } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"
import { FormTextField } from "./shared/FormTextField"
import { API_PATH, AVATAR_USER_NOT_IMAGE } from "@/lib/constants"
import { isValidEmail } from "@/lib/emailSearch"
import { useApi } from "@/hooks/useApi"
import { useInitiativeForm } from "@/context/InitiativeFormContext"
import { UserProfileModal } from "@/components/shared/UserProfileModal"
import { ProfileModal } from "./step3/ProfileModal"
import { HorizontalProfileList } from "./step3/HorizontalProfileList"
import { ProfileCard } from "./step3/ProfileCard"
import HorizontalTeamList from "./step3/HorizontalTeamList"
import { ApplicationCard } from "./step3/ApplicationCard"
import type { Profile } from "@/interfaces/profile"
import type { UserResponse } from "@/interfaces/api/user-response"

const Step3Component = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<InitiativeFormData>()
  const { isEditMode } = useInitiativeForm()
  const refAccordionCollaborators = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash === "#collaborators-profile") {
      const timer = setTimeout(() => {
        const element = refAccordionCollaborators.current
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          window.history.replaceState(null, "", window.location.pathname)
        }
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [])

  const {
    append: appendSeekingProfile,
    remove: removeSeekingProfile,
    update: updateSeekingProfile,
  } = useFieldArray({
    control,
    name: "seekingProfiles",
  })

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
                  <Button onClick={() => handleOpenModal("COLLABORATOR")} variant="contained" startIcon={<Add />}>
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
