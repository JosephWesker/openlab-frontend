import React, { useState, useMemo, useEffect, useCallback } from "react"
// Material-UI Components
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TablePagination from "@mui/material/TablePagination"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Popover from "@mui/material/Popover"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import CircularProgress from "@mui/material/CircularProgress"
import Stack from "@mui/material/Stack"
import Modal from "@mui/material/Modal"
import Divider from "@mui/material/Divider"
import Fade from "@mui/material/Fade"
import Backdrop from "@mui/material/Backdrop"

// Material-UI Icons
import Search from "@mui/icons-material/Search"
import MoreVert from "@mui/icons-material/MoreVert"
import Edit from "@mui/icons-material/Edit"
import Delete from "@mui/icons-material/Delete"
import Visibility from "@mui/icons-material/Visibility"
import ViewColumn from "@mui/icons-material/ViewColumn"
import VideoLibrary from "@mui/icons-material/VideoLibrary"
import ImageIcon from "@mui/icons-material/Image"
import WorkOutlineRounded from "@mui/icons-material/WorkOutlineRounded"
import PersonSearchRounded from "@mui/icons-material/PersonSearchRounded"
import LightbulbRounded from "@mui/icons-material/LightbulbRounded"
import UnfoldMore from "@mui/icons-material/UnfoldMore"
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"
import FilterList from "@mui/icons-material/FilterList"
import StarBorder from "@mui/icons-material/StarBorder"
import Web from "@mui/icons-material/Web"
import Twitter from "@mui/icons-material/Twitter"
import GitHub from "@mui/icons-material/GitHub"
import Instagram from "@mui/icons-material/Instagram"
import Facebook from "@mui/icons-material/Facebook"
import LinkedIn from "@mui/icons-material/LinkedIn"
import Chat from "@mui/icons-material/Chat"
import Close from "@mui/icons-material/Close"
import HowToVote from "@mui/icons-material/HowToVote"
import Comment from "@mui/icons-material/Comment"
import Category from "@mui/icons-material/Category"
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded"
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded"
import CampaignOutlined from "@mui/icons-material/CampaignOutlined"
import Block from "@mui/icons-material/Block"
import EditNote from "@mui/icons-material/EditNote"
import FormatListBulleted from "@mui/icons-material/FormatListBulleted"
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined"

// Framer Motion
import { motion, AnimatePresence } from "motion/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type Column,
  type HeaderGroup,
  type Row,
  type Cell,
  type SortingState,
} from "@tanstack/react-table"
import { useApi } from "@/hooks/useApi"
import { API_PATH, AVATAR_PROFILE_POSTULATION, INITIATIVE_FALLBACK_IMAGE } from "@/lib/constants"
import { LoadingScreen } from "@/components/ui/LoadingTransition"
import { useNavigate, useSearchParams } from "react-router"
import { useSnackbar } from "@/context/SnackbarContext"
import type { Initiative } from "@/interfaces/initiative"
import type { Application } from "@/interfaces/application"
import { userMapperWithActivity } from "@/mapper/user-mapper"
import type { UserResponseWithActivity } from "@/interfaces/api/user-response"
import type { UserEntityWithActivity } from "@/interfaces/user"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { MyParticipations } from "@/components/initiative/cofounder/MyParticipations"
import { useSlugNavigation } from "@/hooks/useSlugNav"
import { UserProfileModal } from "@/components/shared/UserProfileModal"

// Types
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Interfaz para la postulación con datos aumentados
interface ApplicationWithDetails extends Application {
  userName: string
  image: string
  // email: string
  title: string
  initiativeImg: string
}

interface AugmentedApplication extends Application {
  userImage: string
  // userEmail: string
  initiativeTitle: string
  initiativeImage: string
}

const TabPanel = React.memo(function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" style={{ display: value === index ? "block" : "none" }} {...other}>
      {value === index && <Box sx={{ py: 3, pointerEvents: "auto" }}>{children}</Box>}
    </div>
  )
})

const PostulationCard = ({
  postulation,
  onAccept,
  onViewProfile,
  onDelete,
  groupKey,
  skillBorderColor,
}: {
  postulation: AugmentedApplication
  onAccept: (postulation: AugmentedApplication) => void
  onViewProfile: (userId: number) => void
  onDelete: (postulation: AugmentedApplication) => void
  groupKey?: keyof AugmentedApplication | ""
  skillBorderColor?: string
}) => {
  // --- HELPERS ---
  const hideUserSection = groupKey === "userName" // || groupKey === "userEmail"
  const chipColor = useMemo(() => {
    if (groupKey === "gSkills" && skillBorderColor) {
      return skillBorderColor
    }
    if (postulation.gSkills) {
      const skillHash = postulation.gSkills.split("").reduce((hash, char) => {
        return char.charCodeAt(0) + ((hash << 5) - hash)
      }, 0)
      const professionalColors = [
        "#2E7D32",
        "#1565C0",
        "#6A1B9A",
        "#C62828",
        "#EF6C00",
        "#0277BD",
        "#388E3C",
        "#7B1FA2",
        "#D32F2F",
        "#F57C00",
        "#1976D2",
        "#388E3C",
        "#512DA8",
        "#C2185B",
        "#FF8F00",
      ]
      const colorIndex = Math.abs(skillHash) % professionalColors.length
      return professionalColors[colorIndex]
    }
    return "primary.main"
  }, [groupKey, skillBorderColor, postulation.gSkills])

  // --- STYLES ---
  const gridTemplateColumns =
    groupKey === "gSkills"
      ? "minmax(0, 3fr) minmax(0, 5fr) minmax(0, 2fr)" // [User, Description, Actions]
      : hideUserSection
        ? "minmax(0, 4fr) minmax(0, 6fr) minmax(0, 2.5fr)" // [Initiative, Description, Actions]
        : "minmax(0, 2.5fr) minmax(0, 4fr) minmax(0, 3.5fr) minmax(0, 1.5fr)" // [User, Initiative, Description, Actions]

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 4,
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ display: "grid", alignItems: "center", gap: 2, gridTemplateColumns }}>
        {/* === VISTA DE HABILIDAD GENERAL (`gSkills`) === */}
        {groupKey === "gSkills" ? (
          <>
            {/* Col 1: User */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar src={postulation.userImage} sx={{ width: 56, height: 56, border: "3px solid #1976d2" }} />
              <Box minWidth={0}>
                <Typography variant="body1" fontWeight={700} noWrap>
                  {postulation.userName}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary" noWrap>
                  {postulation.userEmail}
                </Typography> */}

                {/* Hard Skills chips debajo del correo */}
                {postulation.hardSkills && postulation.hardSkills.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {postulation.hardSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor: chipColor,
                          opacity: 0.9,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Stack>

            {/* Col 2: Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {postulation.description}
            </Typography>

            {/* Col 3: Actions */}
            <Stack direction={{ xs: "row", sm: "column" }} spacing={1} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<StarBorder />}
                sx={{ borderRadius: 10 }}
                size="small"
                fullWidth
                onClick={() => onViewProfile(postulation.userId)}
              >
                Ver perfil
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutline />}
                size="small"
                sx={{ borderRadius: 10 }}
                fullWidth
                onClick={() => onAccept(postulation)}
              >
                Aceptar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                size="small"
                sx={{
                  borderRadius: 10,
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    borderColor: "error.dark",
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}
                fullWidth
                onClick={() => onDelete(postulation)}
              >
                Eliminar
              </Button>
            </Stack>
          </>
        ) : (
          <>
            {/* === VISTA NORMAL (TODAS LAS DEMÁS) === */}
            {/* Col 1: User (Condicional) */}
            {!hideUserSection && (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar src={postulation.userImage} sx={{ width: 56, height: 56, border: "3px solid #1976d2" }} />
                <Box minWidth={0}>
                  <Typography variant="body1" fontWeight={700} noWrap>
                    {postulation.userName}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary" noWrap>
                    {postulation.userEmail}
                  </Typography> */}
                </Box>
              </Stack>
            )}

            {/* Col 2: Initiative & Role */}
            <Stack direction="row" spacing={1.5} alignItems="center" p={1} borderRadius={2}>
              <Avatar src={postulation.initiativeImage} variant="rounded" sx={{ width: 48, height: 48 }} />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label="COFOUNDER"
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                      background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      color: "white",
                      boxShadow: "0 2px 4px rgba(25, 118, 210, 0.3)",
                    }}
                    size="small"
                  />
                  <Chip
                    label={postulation.gSkills?.toUpperCase().split("_").join(" ") ?? "HABILIDAD"}
                    sx={{
                      fontWeight: "bold",
                      borderWidth: 2,
                      borderColor: chipColor,
                      color: "white",
                      background: chipColor,
                      "&:hover": { background: chipColor, borderColor: chipColor, opacity: 0.8 },
                    }}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 1 }}>
                  Iniciativa: <span className="font-semibold text-primary">{postulation.initiativeTitle}</span>
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Postulado:{" "}
                  <span className="font-medium">
                    {new Date(postulation.applicationDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
                  </span>
                </Typography>
              </Box>
            </Stack>

            {/* Col 3: Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {postulation.description}
            </Typography>

            {/* Col 4: Actions */}
            <Stack direction={{ xs: "row", sm: "column" }} spacing={1} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<StarBorder />}
                sx={{ borderRadius: 10 }}
                size="small"
                fullWidth
                onClick={() => onViewProfile(postulation.userId)}
              >
                Ver perfil
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleOutline />}
                size="small"
                sx={{ borderRadius: 10 }}
                fullWidth
                onClick={() => onAccept(postulation)}
              >
                Aceptar
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                size="small"
                sx={{
                  borderRadius: 10,
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    borderColor: "error.dark",
                    backgroundColor: "error.main",
                    color: "white",
                  },
                }}
                fullWidth
                onClick={() => onDelete(postulation)}
              >
                Eliminar
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Paper>
  )
}

// Header para cada grupo en la vista agrupada
const GroupHeader = ({
  groupName,
  groupKey,
  postulations,
}: {
  groupName: string
  groupKey: keyof AugmentedApplication
  postulations: AugmentedApplication[]
}) => {
  const firstPostulation = postulations[0]
  if (!firstPostulation) return null

  let content: React.ReactNode

  switch (groupKey) {
    case "initiativeTitle": {
      content = (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={firstPostulation.initiativeImage} variant="rounded" sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {groupName}
          </Typography>
        </Stack>
      )
      break
    }
    case "userName": {
      // case "userEmail": {
      // const isEmailFilter = groupKey === "userEmail"

      const PrimaryComponent = () => (
        <Typography
          variant="h6"
          color="primary.main"
          fontWeight={700}
          sx={{ overflowWrap: "break-word", wordBreak: "break-all" }}
        >
          {/* {isEmailFilter ? firstPostulation.userEmail : firstPostulation.userName} */}
          {firstPostulation.userName}
        </Typography>
      )

      const SecondaryComponent = () => (
        <Typography
          variant="body1"
          color="text.secondary"
          fontWeight={400}
          sx={{ overflowWrap: "break-word", wordBreak: "break-all" }}
        >
          {/* {!isEmailFilter ? firstPostulation.userEmail : firstPostulation.userName} */}
          {firstPostulation.userName}
        </Typography>
      )

      content = (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={firstPostulation.userImage} sx={{ width: 48, height: 48 }} />
          <Box sx={{ minWidth: 0 }}>
            <PrimaryComponent />
            <SecondaryComponent />
          </Box>
        </Stack>
      )
      break
    }
    case "gSkills": {
      content = (
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {groupName
            .split("_")
            .join(" ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </Typography>
      )
      break
    }
    case "applicationDate": {
      content = (
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {groupName}
        </Typography>
      )
      break
    }
    default: {
      content = (
        <Typography variant="h6" fontWeight={600}>
          {groupName}
        </Typography>
      )
      break
    }
  }
  return (
    <Box
      sx={{
        p: 2,
        flexShrink: 0,
        width: { xs: "100%", md: 240 }, // Ancho reducido para dar más espacio a las tarjetas
        position: "sticky",
        top: 16,
        alignSelf: "flex-start",
      }}
    >
      {content}
    </Box>
  )
}

// Vista para un grupo de postulaciones
const GroupedPostulationView = ({
  groupName,
  postulations,
  groupKey,
  onAccept,
  onViewProfile,
  onDelete,
}: {
  groupName: string
  postulations: AugmentedApplication[]
  groupKey: keyof AugmentedApplication
  onAccept: (application: AugmentedApplication) => void
  onViewProfile: (userId: number) => void
  onDelete: (application: AugmentedApplication) => void
}) => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <Paper
      sx={{
        borderRadius: 4,
        p: 1,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 1,
        overflow: "hidden",
      }}
    >
      <GroupHeader groupName={groupName} groupKey={groupKey} postulations={postulations} />
      <Box sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
        <Stack spacing={2}>
          {postulations.map((p) => (
            <motion.div layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PostulationCard
                postulation={p}
                onAccept={onAccept}
                onViewProfile={onViewProfile}
                onDelete={onDelete}
                groupKey={groupKey}
              />
            </motion.div>
          ))}
        </Stack>
      </Box>
    </Paper>
  </motion.div>
)

// Componente genérico para manejar Popovers de filtros/ordenamiento
const PopoverManager = ({
  options,
  onSelect,
  buttonLabel,
  buttonIcon,
  activeFilter,
  isFilterActive,
  disabled,
}: {
  options: { label: string; field: keyof AugmentedApplication }[]
  onSelect: (option: { label: string; field: keyof AugmentedApplication | "" }) => void
  buttonLabel: string
  buttonIcon: React.ReactElement
  activeFilter: string
  isFilterActive: boolean
  disabled?: boolean
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleSelect = (option: { label: string; field: keyof AugmentedApplication }) => {
    onSelect(option)
    handleClose()
  }

  return (
    <>
      <Button
        variant={isFilterActive ? "contained" : "outlined"}
        startIcon={buttonIcon}
        onClick={handleOpen}
        size="small"
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List dense>
          {options.map((option) => (
            <MenuItem key={option.field} onClick={() => handleSelect(option)} selected={activeFilter === option.label}>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </List>
      </Popover>
    </>
  )
}

const PostulationsPanel = ({
  onSubTabChange,
  initialFilter,
}: {
  onSubTabChange: (newValue: number) => void
  initialFilter?: string
}) => {
  const fetchApi = useApi()
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [activeFilter, setActiveFilter] = useState("Todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    field: keyof AugmentedApplication | ""
    direction: "asc" | "desc"
  }>({ field: "", direction: "asc" })
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isProfileModalOpen, setProfileModalOpen] = useState(false)
  const [applicationToConfirm, setApplicationToConfirm] = useState<AugmentedApplication | null>(null)
  const [applicationToDelete, setApplicationToDelete] = useState<AugmentedApplication | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  // Aplicar filtro inicial proveniente de la URL
  useEffect(() => {
    if (initialFilter === "general-skills") {
      setActiveFilter("Habilidad General")
      setSortConfig({ field: "gSkills", direction: "asc" })
    }
  }, [initialFilter])

  // Mutación para aceptar una aplicación
  const acceptApplicationMutation = useMutation({
    mutationFn: (applicationId: number) => {
      return fetchApi({
        path: API_PATH.ACCEPT_APPLICATION,
        init: {
          method: "POST",
          body: JSON.stringify({ applicationId, accept: true }),
        },
      })
    },
    onSuccess: () => {
      showSnackbar({
        title: "Éxito",
        message: "La postulación ha sido aceptada.",
        severity: "success",
      })
      // Invalidar y refetchear la query de aplicaciones para actualizar la lista, con la key completa.
      queryClient.invalidateQueries({ queryKey: ["initiativesApplications", proposalIds] })
    },
    onError: (error) => {
      showSnackbar({
        title: "Error",
        message: error.message || "No se pudo aceptar la postulación.",
        severity: "error",
      })
    },
  })

  // Mutación para eliminar una aplicación
  const deleteApplicationMutation = useMutation({
    mutationFn: (applicationId: number) => {
      return fetchApi({
        path: `${API_PATH.INITIATIVE_APPLICATIONS}/${applicationId}`,
        init: {
          method: "DELETE",
        },
      })
    },
    onSuccess: () => {
      showSnackbar({
        title: "Éxito",
        message: "La postulación ha sido eliminada.",
        severity: "success",
      })
      // Invalidar y refetchear la query de aplicaciones para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ["initiativesApplications", proposalIds] })
      setDeleteModalOpen(false)
      setApplicationToDelete(null)
    },
    onError: (error) => {
      showSnackbar({
        title: "Error",
        message: error.message || "No se pudo eliminar la postulación.",
        severity: "error",
      })
    },
  })

  const handleAcceptApplication = (application: AugmentedApplication) => {
    setApplicationToConfirm(application)
  }

  const handleDeleteApplication = (application: AugmentedApplication) => {
    setApplicationToDelete(application)
    setDeleteModalOpen(true)
  }

  const handleConfirmAcceptance = () => {
    if (applicationToConfirm) {
      acceptApplicationMutation.mutate(applicationToConfirm.id)
      // Cambiar al subtab "Todas" después de aceptar
      onSubTabChange(0)
    }
  }

  const handleConfirmDeletion = () => {
    if (applicationToDelete) {
      deleteApplicationMutation.mutate(applicationToDelete.id)
    }
  }

  // --- Lógica unificada para manejar filtros y ordenación ---
  const handleFilterSelection = (option: { label: string; field: keyof AugmentedApplication | "" }) => {
    // Si el usuario vuelve a hacer clic en el mismo campo, se invierte la dirección.
    // Si es un campo nuevo, se establece en ascendente.
    if (sortConfig.field === option.field) {
      setSortConfig((prev) => ({ ...prev, direction: prev.direction === "asc" ? "desc" : "asc" }))
    } else {
      setSortConfig({ field: option.field, direction: "asc" })
    }
    // Sincronizar el filtro activo (para los chips)
    setActiveFilter(option.label)
  }

  // 1. Obtener todas las iniciativas del usuario
  const { data: userInitiatives = [], isLoading: isLoadingInitiatives } = useQuery<Initiative[]>({
    queryKey: ["userInitiativesForApplications"],
    queryFn: () => {
      // console.log("HICE LA QUERY DE TRAER LAS INICIATIVAS")
      return fetchApi({ path: API_PATH.INITIATIVE_USER })
    },
    staleTime: 0,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  })

  // 2. Filtrar por `state: "proposal"` y obtener los IDs
  const proposalIds = useMemo(() => {
    return userInitiatives.filter((i) => i.state !== "draft").map((i) => i.id)
  }, [userInitiatives])

  // 3. Obtener todas las aplicaciones para esas iniciativas
  const {
    data: applications = [],
    isLoading: isLoadingApplications,
    error,
  } = useQuery<AugmentedApplication[]>({
    queryKey: ["initiativesApplications", proposalIds],
    queryFn: async () => {
      const applicationPromises = proposalIds.map(async (id) => {
        try {
          const apps = (await fetchApi({
            path: `${API_PATH.INITIATIVE_APPLICATIONS}/${id}`,
          })) as ApplicationWithDetails[]
          // 4. Aumentar los datos con la info de la iniciativa y el usuario
          return apps.map((app) => ({
            ...app,
            userImage: app.image || AVATAR_PROFILE_POSTULATION, // Usar imagen de usuario si existe
            // userEmail: app.email, // Usar email de usuario
            initiativeTitle: app.title, // Usar título de la iniciativa
            initiativeImage: app.initiativeImg || INITIATIVE_FALLBACK_IMAGE, // Usar imagen de la iniciativa si existe
          }))
        } catch {
          return [] // Si una iniciativa no tiene aplicaciones, devuelve array vacío
        }
      })
      const results = await Promise.all(applicationPromises)
      return results.flat() // Unificar todos los resultados en un solo array
    },
    enabled: proposalIds.length > 0, // Solo ejecutar si hay IDs de propuestas
    staleTime: 0,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
  })

  const noApplications = !isLoadingApplications && applications.length === 0

  // 5. Lógica de filtrado y ordenamiento
  const filteredAndSortedPostulations = useMemo(() => {
    let result = [...applications]

    // Búsqueda
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.userName.toLowerCase().includes(lowerQuery) ||
          // p.userEmail.toLowerCase().includes(lowerQuery) ||
          p.initiativeTitle.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.gSkills.toLowerCase().includes(lowerQuery) ||
          (p.hardSkills && p.hardSkills.some((s: string) => s.toLowerCase().includes(lowerQuery))),
      )
    }

    // Ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        const field = sortConfig.field as keyof AugmentedApplication
        let valA = a[field]
        let valB = b[field]

        // Manejar fechas
        if (field === "applicationDate") {
          valA = new Date(valA as string).getTime()
          valB = new Date(valB as string).getTime()
          return sortConfig.direction === "asc"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number)
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return 0
      })
    }

    return result
  }, [applications, searchQuery, sortConfig])

  // Lógica de agrupación simple
  const simpleGroupedPostulations = useMemo(() => {
    if (!sortConfig.field || sortConfig.field === "gSkills" || searchQuery) {
      return null
    }

    const groupKey = sortConfig.field
    return filteredAndSortedPostulations.reduce(
      (acc, postulation) => {
        let key = postulation[groupKey] as string | number

        if (groupKey === "applicationDate" && typeof key === "string") {
          key = new Date(key).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })
        }

        if (typeof key !== "string" && typeof key !== "number") {
          key = "Sin categoría"
        }

        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(postulation)
        return acc
      },
      {} as Record<string | number, AugmentedApplication[]>,
    )
  }, [filteredAndSortedPostulations, sortConfig, searchQuery])

  // Lógica de agrupación anidada (Iniciativa -> Habilidad General)
  const nestedGroupedPostulations = useMemo(() => {
    // Solo se activa cuando el filtro es "Habilidad General" y no hay búsqueda
    if (activeFilter !== "Habilidad General" || searchQuery) {
      return null
    }

    // 1. Agrupar por Título de Iniciativa
    const groupedByInitiative = filteredAndSortedPostulations.reduce(
      (acc, postulation) => {
        const key = postulation.initiativeTitle
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(postulation)
        return acc
      },
      {} as Record<string, AugmentedApplication[]>,
    )

    // 2. Para cada iniciativa, sub-agrupar por Habilidad General
    const nestedResult = Object.entries(groupedByInitiative).reduce(
      (acc, [initiativeTitle, postulations]) => {
        const groupedBySkill = postulations.reduce(
          (skillAcc, postulation) => {
            const skillKey = postulation.gSkills?.split("_").join(" ") ?? "Sin Habilidad Especificada"
            if (!skillAcc[skillKey]) {
              skillAcc[skillKey] = []
            }
            skillAcc[skillKey].push(postulation)
            return skillAcc
          },
          {} as Record<string, AugmentedApplication[]>,
        )

        acc[initiativeTitle] = {
          initiativeImage: postulations[0]?.initiativeImage || INITIATIVE_FALLBACK_IMAGE,
          skills: groupedBySkill,
        }

        return acc
      },
      {} as Record<string, { initiativeImage: string; skills: Record<string, AugmentedApplication[]> }>,
    )

    return nestedResult
  }, [filteredAndSortedPostulations, activeFilter, searchQuery])

  // ----- Encabezados dinámicos de columnas -----
  const headerConfig = useMemo(() => {
    switch (activeFilter) {
      case "Iniciativa":
        return {
          titles: ["Iniciativa", "Postulante", "Perfil a buscar", "Presentación del postulante"],
          grid: "minmax(0, 2fr) minmax(0, 2fr) minmax(0, 3fr) minmax(0, 2.5fr)",
        }
      case "Habilidad General":
        return {
          titles: ["Iniciativa", "Habilidad buscada", "Postulante", "Presentación del postulante"],
          grid: "minmax(0, 2fr) minmax(0, 2fr) minmax(0, 2fr) minmax(0, 3fr)",
        }
      case "Nombre de Usuario":
        // case "Email":
        return {
          titles: ["Postulante", "Perfil a buscar", "Presentación del postulante"],
          grid: "minmax(0, 2fr) minmax(0, 3fr) minmax(0, 4.5fr)",
        }
      case "Fecha de Aplicación":
        return {
          titles: ["Fecha", "Postulante", "Perfil a buscar", "Presentación del postulante"],
          grid: "minmax(0, 2.5fr) minmax(0, 2.5fr) minmax(0, 3fr) minmax(0, 3fr)",
        }
      default:
        return {
          titles: ["Postulante", "Perfil a buscar", "Presentación del postulante"],
          grid: "minmax(0, 2.5fr) minmax(0, 4fr) minmax(0, 3.5fr)",
        }
    }
  }, [activeFilter])

  const isLoading = isLoadingInitiatives || isLoadingApplications

  const handleViewProfile = (userId: number) => {
    setSelectedUserId(userId)
    setProfileModalOpen(true)
  }

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false)
    setSelectedUserId(null)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", width: "100%" }}>
        <LoadingScreen noFixed />
      </Box>
    )
  }
  if (error) return <Typography color="error">Error al cargar las postulaciones.</Typography>

  const filterChips = [
    { label: "Todas", icon: <PersonSearchRounded />, field: "" },
    { label: "Iniciativa", icon: <LightbulbRounded />, field: "initiativeTitle" },
    { label: "Habilidad General", icon: <Category />, field: "gSkills" },
  ]

  const sortOptions: { label: string; field: keyof AugmentedApplication }[] = [
    { label: "Nombre de Usuario", field: "userName" },
    // { label: "Email", field: "userEmail" },
    { label: "Habilidad General", field: "gSkills" },
    { label: "Iniciativa", field: "initiativeTitle" },
    { label: "Fecha de Aplicación", field: "applicationDate" },
  ]

  const itemAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  }

  const isGroupView = (simpleGroupedPostulations || nestedGroupedPostulations) && !searchQuery
  const isNestedGroupView = nestedGroupedPostulations && !searchQuery
  const isPopoverFilterActive = activeFilter !== "Todas" && !filterChips.some((chip) => chip.label === activeFilter)

  const ColumnHeaders: React.FC = () => {
    const buttonColumnGrid = `${headerConfig.grid} minmax(0, 1.5fr)` // Espacio reducido para botones de acción
    return (
      <Paper
        elevation={2}
        sx={{
          display: "grid",
          gridTemplateColumns: buttonColumnGrid,
          gap: 0,
          py: 1.5,
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {headerConfig.titles.map((title, index) => (
          <Box
            key={title}
            sx={{
              borderRight: index < headerConfig.titles.length - 1 ? "1px solid #dee2e6" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: "black", textAlign: "center" }}>
              {title}
            </Typography>
          </Box>
        ))}
        {/* Columna vacía para alinear con los botones de acción */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            borderLeft: "1px solid #dee2e6",
          }}
        />
      </Paper>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Contenedor de Filtros (Izquierda en Desktop) */}
        <Box
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            p: 0.5,
            display: "inline-flex",
            gap: 0.5,
            flexWrap: "wrap",
            order: { xs: 2, md: 1 },
          }}
        >
          {filterChips.map(({ label, icon, field }) => (
            <Button
              key={label}
              variant="text"
              onClick={() => handleFilterSelection({ label, field: field as keyof AugmentedApplication | "" })}
              disabled={isLoadingApplications || (noApplications && label !== "Todas")}
              sx={{
                textTransform: "none",
                borderRadius: 99,
                px: 2.5,
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
                minWidth: "auto",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease-in-out",
                color: activeFilter === label ? "white" : "text.primary",
                backgroundColor: activeFilter === label ? "primary.main" : "#f0f2f5",
                "&:hover": {
                  backgroundColor: activeFilter === label ? "primary.main" : "#e0e0e0",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                {icon}
              </Box>
              {label}
            </Button>
          ))}
        </Box>

        {/* Contenedor de Controles (Derecha en Desktop) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            order: { xs: 1, md: 2 }, // Arriba en móvil, segundo en desktop
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-start" },
          }}
        >
          <PopoverManager
            options={sortOptions}
            onSelect={handleFilterSelection}
            buttonLabel="Filtros"
            buttonIcon={<FilterList />}
            activeFilter={activeFilter}
            isFilterActive={isPopoverFilterActive}
            disabled={isLoadingApplications || noApplications}
          />
          <TextField
            placeholder="Buscar perfil..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              // Si el usuario busca, se cancela la agrupación
              if (e.target.value) {
                setSortConfig({ field: "", direction: "asc" })
                setActiveFilter("Todas")
              }
            }}
            size="small"
            sx={{ flexGrow: 1, minWidth: { sm: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            disabled={isLoadingApplications || noApplications}
          />
        </Box>
      </Box>

      {/* Mensaje informativo con UI mejorada */}
      {filteredAndSortedPostulations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              mb: 2,
              mt: 2,
              borderRadius: 3,
              background: "white",
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <CampaignOutlined sx={{ fontSize: 28, color: "primary.main" }} />
            <Box>
              <Typography variant="body1" fontWeight={600} color="primary.main">
                ¡Tienes postulaciones esperando! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cada postulación incluye el perfil del candidato, información de iniciativa y la habilidad que busca.
                Puedes aceptar a las personas interesadas en unirse a tus iniciativas como cofundadores.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Contenedor Sticky solo para los encabezados */}
      <Box sx={{ position: "sticky", top: "90px", zIndex: 1, bgcolor: "transparent", py: 2 }}>
        <ColumnHeaders />
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={isGroupView ? "grouped" : "list"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {isGroupView ? (
            <Stack spacing={4}>
              {isNestedGroupView
                ? Object.entries(nestedGroupedPostulations).map(([initiativeTitle, { initiativeImage, skills }]) => (
                    <NestedInitiativeGroupView
                      key={initiativeTitle}
                      initiativeTitle={initiativeTitle}
                      initiativeImage={initiativeImage}
                      skillsGroup={skills}
                      onAccept={handleAcceptApplication}
                      onViewProfile={handleViewProfile}
                      onDelete={handleDeleteApplication}
                    />
                  ))
                : Object.entries(simpleGroupedPostulations!).map(([groupName, postulationsInGroup]) => (
                    <GroupedPostulationView
                      key={groupName}
                      groupName={groupName}
                      postulations={postulationsInGroup}
                      groupKey={sortConfig.field as keyof AugmentedApplication}
                      onAccept={handleAcceptApplication}
                      onViewProfile={handleViewProfile}
                      onDelete={handleDeleteApplication}
                    />
                  ))}
            </Stack>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {filteredAndSortedPostulations.length > 0 ? (
                  filteredAndSortedPostulations.map((postulation) => (
                    <motion.div
                      key={postulation.id}
                      variants={itemAnimation}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <PostulationCard
                        postulation={postulation}
                        onAccept={handleAcceptApplication}
                        onViewProfile={handleViewProfile}
                        onDelete={handleDeleteApplication}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState
                    context={searchQuery ? "search" : "applications"}
                    customMessage={
                      searchQuery
                        ? `No se encontraron postulaciones para "${searchQuery}".`
                        : "Aún no tienes personas postulándose a tus iniciativas. ¡Comparte tus proyectos para atraer talento!"
                    }
                  />
                )}
              </AnimatePresence>
            </Stack>
          )}
        </motion.div>
      </AnimatePresence>

      <UserProfileModal userId={selectedUserId} open={isProfileModalOpen} onClose={handleCloseProfileModal} />

      {applicationToConfirm && (
        <ConfirmationModal
          open={!!applicationToConfirm}
          onClose={() => setApplicationToConfirm(null)}
          onConfirm={handleConfirmAcceptance}
          variant="confirm"
          context="application"
          details={{
            name: applicationToConfirm.userName,
            image: applicationToConfirm.userImage,
            skill: applicationToConfirm.gSkills,
            initiativeTitle: applicationToConfirm.initiativeTitle,
          }}
        />
      )}

      {/* Modal de confirmación para eliminar postulaciones */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setApplicationToDelete(null)
        }}
        onConfirm={handleConfirmDeletion}
        variant="delete"
        context="application"
        details={{
          name: applicationToDelete?.userName,
          image: applicationToDelete?.userImage,
          skill: applicationToDelete?.gSkills,
          initiativeTitle: applicationToDelete?.initiativeTitle,
        }}
      />
    </Box>
  )
}

// Componente de perfil ANTIGUO (será reemplazado pronto)
export const ProfileModalOld = ({
  userId,
  open,
  onClose,
}: {
  userId: number | null
  open: boolean
  onClose: () => void
}) => {
  const fetchApi = useApi()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<UserEntityWithActivity>({
    queryKey: ["userProfileWithActivity", userId],
    queryFn: async () => {
      const response = (await fetchApi({
        path: `${API_PATH.USER}/${userId}`,
      })) as UserResponseWithActivity
      return userMapperWithActivity(response)
    },
    enabled: !!userId && open, // Solo fetchear si el modal está abierto y hay un userId
  })

  // All skills are now in a single array
  const skills = user?.skills || []

  // Configuración de redes sociales con renderizado condicional
  const socials = [
    { id: 1, icon: GitHub, url: user?.social.github, label: "GitHub", color: "#333" },
    { id: 2, icon: LinkedIn, url: user?.social.linkedIn, label: "LinkedIn", color: "#0077b5" }, // Usar linkd
    { id: 3, icon: Facebook, url: user?.social.facebook, label: "Facebook", color: "#1877f2" },
    { id: 4, icon: Instagram, url: user?.social.instagram, label: "Instagram", color: "#e4405f" },
    { id: 5, icon: Twitter, url: user?.social.twitter, label: "Twitter", color: "#1da1f2" },
    { id: 6, icon: Chat, url: user?.social.discord, label: "Discord", color: "#7289da" },
    { id: 7, icon: Web, url: user?.social.other, label: "Web", color: "#6366f1" },
  ].filter((social) => social.url)

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 },
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: 4,
            p: 4,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <Close />
          </IconButton>

          {isLoading && <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}
          {isError && <Typography color="error">Error al cargar el perfil.</Typography>}

          {user && (
            <Stack spacing={3} alignItems="center">
              <Avatar src={user.image} sx={{ width: 100, height: 100, fontSize: "3rem" }}>
                {getInitials(user.name)}
              </Avatar>

              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">
                  {user.name}
                </Typography>
                {/* <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography> */}
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ width: "100%" }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-around",
                    textAlign: "center",
                    backgroundColor: "action.hover",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {user.initiatives}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LightbulbRounded fontSize="small" color="primary" />
                      {user.initiatives === 1 ? "Iniciativa" : "Iniciativas"}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {user.votes}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <HowToVote fontSize="small" color="primary" />
                      {user.votes === 1 ? "Voto" : "Votos"}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {user.comments}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Comment fontSize="small" color="primary" />
                      {user.comments === 1 ? "Comentario" : "Comentarios"}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                {user.description || "Este usuario no ha proporcionado una descripción."}
              </Typography>

              <Box width="100%">
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
                  Habilidades
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {skills.length > 0 ? (
                    skills.map((skill: string) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay habilidades especificadas.
                    </Typography>
                  )}
                </Stack>
              </Box>

              {socials.length > 0 && (
                <Box width="100%">
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
                    {socials.map(
                      (social) =>
                        social.url && (
                          <IconButton
                            key={social.id}
                            component="a"
                            href={social.url}
                            target="_blank"
                            sx={{
                              color: social.color,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: social.color,
                                color: "white",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <social.icon />
                          </IconButton>
                        ),
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Paper>
      </Fade>
    </Modal>
  )
}

// Vista para la subdivisión por Habilidad
const SkillSubgroupView = ({
  skillName,
  postulations,
  onAccept,
  onViewProfile,
  onDelete,
}: {
  skillName: string
  postulations: AugmentedApplication[]
  onAccept: (application: AugmentedApplication) => void
  onViewProfile: (userId: number) => void
  onDelete: (application: AugmentedApplication) => void
}) => {
  // Generar un color consistente basado en el nombre de la habilidad para el borde
  // Usar el mismo algoritmo que en PostulationCard para consistencia
  const borderColor = useMemo(() => {
    const skillHash = skillName.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash)
    }, 0)

    // Paleta de colores profesionales y sobrios (misma que en PostulationCard)
    const professionalColors = [
      "#2E7D32", // Verde oscuro
      "#1565C0", // Azul oscuro
      "#6A1B9A", // Púrpura oscuro
      "#C62828", // Rojo oscuro
      "#EF6C00", // Naranja oscuro
      "#0277BD", // Azul marino
      "#388E3C", // Verde bosque
      "#7B1FA2", // Púrpura
      "#D32F2F", // Rojo
      "#F57C00", // Naranja
      "#1976D2", // Azul
      "#388E3C", // Verde
      "#512DA8", // Púrpura oscuro
      "#C2185B", // Rosa oscuro
      "#FF8F00", // Ámbar
    ]

    const colorIndex = Math.abs(skillHash) % professionalColors.length
    return professionalColors[colorIndex]
  }, [skillName])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${borderColor}`,
          borderLeft: `5px solid ${borderColor}`,
          bgcolor: "rgba(0, 0, 0, 0.02)",
          my: 1,
          // Mantener el borde con el color diferenciador en hover
          "&:hover": {
            border: `1px solid ${borderColor}`,
            borderLeft: `5px solid ${borderColor}`,
            boxShadow: `0 4px 12px ${borderColor}20`,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            width: { xs: "100%", md: 220 },
            flexShrink: 0,
            position: "sticky",
            // top: "190px",
            alignSelf: "flex-start",
            zIndex: 1,
            bgcolor: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ color: borderColor, textTransform: "capitalize" }}>
            {skillName.toLowerCase()}
          </Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 1, md: 1.5 },
            borderTop: { xs: "1px solid", md: "none" },
            borderColor: "divider",
          }}
        >
          <Stack spacing={2}>
            {postulations.map((p) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
              >
                <PostulationCard
                  postulation={p}
                  onAccept={onAccept}
                  onViewProfile={onViewProfile}
                  onDelete={onDelete}
                  groupKey="gSkills"
                  skillBorderColor={borderColor}
                />
              </motion.div>
            ))}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  )
}

// Vista para el grupo principal de Iniciativa en la vista anidada
const NestedInitiativeGroupView = ({
  initiativeTitle,
  initiativeImage,
  skillsGroup,
  onAccept,
  onViewProfile,
  onDelete,
}: {
  initiativeTitle: string
  initiativeImage: string
  skillsGroup: Record<string, AugmentedApplication[]>
  onAccept: (application: AugmentedApplication) => void
  onViewProfile: (userId: number) => void
  onDelete: (application: AugmentedApplication) => void
}) => {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Paper
        sx={{
          borderRadius: 4,
          p: 1,
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
          overflow: "hidden",
        }}
      >
        {/* Header de la Iniciativa (igual que GroupHeader) */}
        <Box
          sx={{
            p: 2,
            flexShrink: 0,
            width: { xs: "100%", md: 240 },
            position: "sticky",
            // top: 16,
            alignSelf: "flex-start",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={initiativeImage} variant="rounded" sx={{ width: 48, height: 48 }} />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {initiativeTitle}
            </Typography>
          </Stack>
        </Box>
        {/* Contenedor para los subgrupos de habilidades */}
        <Box sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
          <Stack spacing={3}>
            {Object.entries(skillsGroup).map(([skillName, postulationsInSkill]) => (
              <SkillSubgroupView
                key={skillName}
                skillName={skillName}
                postulations={postulationsInSkill}
                onAccept={onAccept}
                onViewProfile={onViewProfile}
                onDelete={onDelete}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  )
}

// Componente genérico para manejar Popovers de filtros/ordenamiento
const columnHelper = createColumnHelper<Initiative>()

export default function PageDashboardList() {
  const fetchApi = useApi()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  // Filtro inicial para el panel de postulaciones (null si no se establece)
  const [initialPostulationFilter, setInitialPostulationFilter] = useState<string | null>(null)
  const { goToInitiative } = useSlugNavigation()

  // States
  const [mainTab, setMainTab] = useState(0)
  const [subTab, setSubTab] = useState(0)
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<Initiative | null>(null)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [showUpdateLoader, setShowUpdateLoader] = useState(false)

  // Stable callback for setGlobalFilter to prevent infinite loops in child components
  const stableSetGlobalFilter = useCallback((value: string) => {
    setGlobalFilter(value)
  }, [])

  const deleteMutation = useMutation<
    unknown,
    Error,
    number,
    { previousData: Array<{ queryKey: readonly unknown[]; data: Initiative[] | undefined }> }
  >({
    mutationFn: (initiativeId: number) => {
      return fetchApi({
        path: `${API_PATH.INITIATIVE}/${initiativeId}`,
        init: { method: "DELETE" },
      })
    },
    // --- OPTIMISTIC UPDATE ---
    onMutate: async (initiativeId: number) => {
      await queryClient.cancelQueries({ queryKey: ["initiatives"] })

      // Capturar todos los queries que comiencen con "initiatives"
      const queries = queryClient.getQueryCache().findAll({ queryKey: ["initiatives"] })

      const previousData = queries.map((q) => ({
        queryKey: q.queryKey,
        data: q.state.data as Initiative[] | undefined,
      }))

      // Remover optimistamente la iniciativa
      previousData.forEach(({ queryKey, data }) => {
        if (Array.isArray(data)) {
          queryClient.setQueryData(
            queryKey,
            data.filter((i) => i.id !== initiativeId),
          )
        }
      })

      return { previousData }
    },
    onError: (error, _initiativeId, context) => {
      // Revertir si hay error
      context?.previousData.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data)
      })
      showSnackbar({
        message: `Error: ${error.message || "La iniciativa no se pudo eliminar."}`,
        severity: "error",
        title: "Error de eliminación",
      })
    },
    onSuccess: () => {
      showSnackbar({
        message: "Iniciativa eliminada correctamente",
        severity: "success",
        title: "Éxito",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["initiatives"] })
    },
  })

  // Reset pagination when tabs change
  const handleMainTabChange = (newValue: number) => {
    setMainTab(newValue)
    setSubTab(0) // Reset subtab cuando cambie main tab
  }

  const handleSubTabChange = (newValue: number) => {
    setSubTab(newValue)
  }

  useEffect(() => {
    // Reset pagination and filters when changing tabs
    setPagination({ pageIndex: 0, pageSize: 10 })
    setGlobalFilter("")
  }, [mainTab, subTab]) // Trigger this whenever the tab changes

  // Sincroniza el subTab con el parámetro de la URL (?tab=)
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    const subtabParam = searchParams.get("subtab")
    if (!tabParam) return

    if (tabParam === "my-initiatives") {
      setMainTab(0)
      if (subtabParam === "all") setSubTab(0)
      else if (subtabParam === "proposal") setSubTab(1)
      else if (subtabParam === "inprocess") setSubTab(2)
      else if (subtabParam === "approved") setSubTab(3)
      else if (subtabParam === "draft") setSubTab(4)
      else setSubTab(0) // default "Todas"
    } else if (tabParam === "my-participations") {
      setMainTab(1)
      if (subtabParam === "all") setSubTab(0)
      else if (subtabParam === "proposal") setSubTab(1)
      else if (subtabParam === "inprocess") setSubTab(2)
      else if (subtabParam === "approved") setSubTab(3)
      else setSubTab(0) // default "Todas"
    } else if (tabParam === "postulations") {
      setMainTab(3)
      // Guardar filtro inicial para el panel de postulaciones
      if (subtabParam === "general-skills") {
        setInitialPostulationFilter("general-skills")
      } else {
        setInitialPostulationFilter(null)
      }
    }
  }, [searchParams])

  // React Query para "Mis iniciativas" (mainTab === 0)
  const {
    data: initiatives = [],
    isLoading: isLoadingInitiatives,
    isFetching: isFetchingInitiatives,
    error: errorInitiatives,
    refetch: refetchInitiatives,
  } = useQuery<Initiative[]>({
    queryKey: ["initiatives", mainTab, "general"],
    queryFn: async ({ signal }): Promise<Initiative[]> => {
      try {
        const response = await fetchApi({
          path: API_PATH.INITIATIVE_USER,
          init: {
            method: "GET",
            signal,
          },
        })

        return response as Initiative[]
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return []
        }
        throw error
      }
    },
    enabled: mainTab === 0,
    staleTime: 0,
  })

  // React Query para "Mis Participaciones" (mainTab === 1)
  const {
    data: participations = [],
    isLoading: isLoadingParticipations,
    isFetching: isFetchingParticipations,
    error: errorParticipations,
    refetch: refetchParticipations,
  } = useQuery<Initiative[]>({
    queryKey: ["participations", "cofounder"],
    queryFn: async ({ signal }): Promise<Initiative[]> => {
      try {
        const response = await fetchApi({
          path: API_PATH.INITIATIVE_USER_COFOUNDER,
          init: {
            method: "GET",
            signal,
          },
        })

        return response as Initiative[]
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return []
        }
        throw error
      }
    },
    enabled: mainTab === 1,
    staleTime: 0,
  })

  // Estados unificados basados en el tab activo
  const isLoading = mainTab === 0 ? isLoadingInitiatives : mainTab === 1 ? isLoadingParticipations : false
  const isFetching = mainTab === 0 ? isFetchingInitiatives : mainTab === 1 ? isFetchingParticipations : false
  const error = mainTab === 0 ? errorInitiatives : mainTab === 1 ? errorParticipations : null
  const refetch = mainTab === 0 ? refetchInitiatives : mainTab === 1 ? refetchParticipations : () => {}

  // Show loader on update
  useEffect(() => {
    if (searchParams.get("updated") === "true") {
      setShowUpdateLoader(true)
    }
  }, [searchParams])

  // Hide loader after fetching is complete
  useEffect(() => {
    if (showUpdateLoader && !isFetching) {
      setShowUpdateLoader(false)
      // Clean the URL
      navigate(location.pathname, { replace: true })
    }
  }, [isFetching, showUpdateLoader, navigate])

  // Filter data for "Mis Iniciativas"
  const filteredInitiatives = useMemo(() => {
    let filtered: Initiative[] = initiatives

    switch (subTab) {
      case 0: // Todas
        filtered = initiatives
        break
      case 1: // Propuestas
        filtered = initiatives.filter((item: Initiative) => item.state?.toLowerCase() === "proposal")
        break
      case 2: // En proceso
        filtered = initiatives.filter((item: Initiative) => item.state?.toLowerCase() === "inprocess")
        break
      case 3: // Activas (aprobadas)
        filtered = initiatives.filter((item: Initiative) => item.state?.toLowerCase() === "approved")
        break
      case 4: // Borradores
        filtered = initiatives.filter((item: Initiative) => item.state?.toLowerCase() === "draft")
        break
      default:
        filtered = initiatives
    }

    return filtered
  }, [initiatives, subTab])

  // Filter data for "Mis Participaciones"
  const filteredParticipations = useMemo(() => {
    let filtered: Initiative[] = participations

    switch (subTab) {
      case 0: // Todas
        filtered = participations
        break
      case 1: // Propuestas
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "proposal")
        break
      case 2: // En proceso
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "inprocess")
        break
      case 3: // Activas (aprobadas)
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "approved")
        break
      default:
        filtered = participations
    }

    return filtered
  }, [participations, subTab])

  // Table columns
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "visual_number", // Cambiado para reflejar que es el número visual
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>N°</Box>,
        size: 45,
        minSize: 45,
        maxSize: 50,
        enableSorting: false,
        cell: (props) => {
          // Índice global basado en paginación
          const { pageIndex, pageSize } = props.table.getState().pagination
          const pageRows = props.table.getRowModel().rows
          const rowIndexOnPage = pageRows.findIndex((pagedRow) => pagedRow.id === props.row.id)
          return pageIndex * pageSize + rowIndexOnPage + 1
        },
      }),
      columnHelper.accessor("title", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Título</Box>,
        size: 350,
        minSize: 300,
        maxSize: 400,
        cell: ({ row, getValue }: { row: { original: Initiative }; getValue: () => string }) => {
          const imageUrl = row.original.img

          // Función para detectar si es video (basada en ImageSlider.tsx)
          const isVideo = (url: string): boolean => {
            if (!url) return false
            // Detectar por extensión en la URL
            const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv", "video"]
            const urlLower = url.toLowerCase()
            return videoExtensions.some((ext) => urlLower.includes(ext))
          }

          // Función para generar thumbnail de video de Cloudinary
          const getVideoThumbnail = (url: string): string => {
            if (!url || !url.includes("cloudinary.com") || !isVideo(url)) {
              return url
            }

            // Para generar una miniatura de un video, insertamos transformaciones
            // de imagen y cambiamos la extensión a .jpg, pero MANTENEMOS el
            // tipo de recurso como /video/.
            try {
              const transformations = "so_2.0,w_80,h_80,c_fill,q_auto,f_auto"

              // Cambiamos la extensión a .jpg
              let thumbnailUrl = url.replace(/\.\w+$/, ".jpg")

              // Insertamos las transformaciones después de /upload/
              thumbnailUrl = thumbnailUrl.replace("/upload/", `/upload/${transformations}/`)

              return thumbnailUrl
            } catch (error) {
              console.warn("Error generating video thumbnail:", error)
              return url // Devolver URL original si algo falla
            }
          }

          const mediaUrl = imageUrl
          const isVideoFile = isVideo(mediaUrl)
          const previewUrl = isVideoFile ? getVideoThumbnail(mediaUrl) : mediaUrl

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, maxWidth: 400 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    "& img": {
                      objectFit: "cover",
                    },
                  }}
                >
                  {getValue().charAt(0).toUpperCase()}
                </Avatar>
                {/* Indicador de tipo de media como subíndice */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: isVideoFile ? "#e74c3c" : "#3498db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    zIndex: 1,
                  }}
                >
                  {isVideoFile ? (
                    <VideoLibrary sx={{ fontSize: "10px", color: "white" }} />
                  ) : (
                    <ImageIcon sx={{ fontSize: "10px", color: "white" }} />
                  )}
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight="600" noWrap title={getValue()}>
                  {getValue()}
                </Typography>
                {/* Mostrar motto en lugar del indicador de video */}
                {row.original.motto && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem", fontWeight: 400 }}
                    noWrap
                    title={row.original.motto}
                  >
                    {row.original.motto}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        },
      }),
      columnHelper.accessor("description", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Descripción</Box>,
        size: 300,
        minSize: 250,
        maxSize: 350,
        cell: ({ getValue }: { getValue: () => string }) => {
          const description = getValue() || "Sin descripción"
          return (
            <Box sx={{ maxWidth: 350 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                  fontSize: "0.875rem",
                }}
                title={description}
              >
                {description}
              </Typography>
            </Box>
          )
        },
      }),
      columnHelper.accessor("state", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Estado</Box>,
        size: 130,
        minSize: 120,
        maxSize: 150,
        cell: ({ getValue }: { getValue: () => string }) => {
          const state = getValue()

          const getStateConfig = (state: string) => {
            switch (state?.toLowerCase()) {
              case "proposal":
                return {
                  label: "Propuesta",
                  bg: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                  color: "white",
                  icon: <LightbulbRounded fontSize="small" />,
                }
              case "inprocess":
                return {
                  label: "En Proceso",
                  bg: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
                  color: "white",
                  icon: <TrendingUpRounded fontSize="small" />,
                }
              case "approved":
                return {
                  label: "Aprobada",
                  bg: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
                  color: "white",
                  icon: <CheckCircleRounded fontSize="small" />,
                }
              case "draft":
                return {
                  label: "Borrador",
                  bg: "linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%)",
                  color: "#e17055",
                  icon: <EditNote fontSize="small" />,
                }
              default:
                return {
                  label: "Sin estado",
                  bg: "#f8f9fa",
                  color: "#6c757d",
                  icon: <Block fontSize="small" />,
                }
            }
          }

          const config = getStateConfig(state)
          return (
            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {config.icon}
                  <span>{config.label}</span>
                </Box>
              }
              size="small"
              sx={{
                background: config.bg,
                color: config.color,
                fontWeight: 600,
                fontSize: "0.75rem",
                border: "none",
                "& .MuiChip-label": {
                  px: 1.5,
                  py: 0.5,
                },
              }}
            />
          )
        },
      }),
      columnHelper.accessor("tags", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Tags</Box>,
        size: 120,
        minSize: 100,
        maxSize: 140,
        cell: ({ getValue }: { getValue: () => string[] }) => {
          const tags = getValue() || []

          if (tags.length === 0) {
            return (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                Sin tags
              </Typography>
            )
          }

          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center" }}>
              {tags.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    height: 20,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                    // Ocultar segundo chip en móvil
                    display: { xs: index === 0 ? "flex" : "none", sm: "flex" },
                  }}
                />
              ))}
              {tags.length > 2 && (
                <Chip
                  label={`+${tags.length - 2}`}
                  size="small"
                  sx={{
                    backgroundColor: "grey.300",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    height: 20,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                    // En móvil mostrar +N desde el segundo tag
                    display: { xs: tags.length > 1 ? "flex" : "none", sm: "flex" },
                  }}
                />
              )}
              {/* En móvil, mostrar +N si hay más de 1 tag */}
              {tags.length > 1 && (
                <Chip
                  label={`+${tags.length - 1}`}
                  size="small"
                  sx={{
                    backgroundColor: "grey.300",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    height: 20,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                    display: { xs: "flex", sm: "none" },
                  }}
                />
              )}
            </Box>
          )
        },
      }),
      columnHelper.accessor("date", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Fecha</Box>,
        size: 100,
        minSize: 100,
        maxSize: 120,
        cell: ({ getValue }: { getValue: () => string }) => (
          <Typography variant="body2" color="text.secondary">
            {new Date(getValue()).toLocaleDateString(undefined, { timeZone: "UTC" })}
          </Typography>
        ),
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date).getTime()
          const dateB = new Date(rowB.original.date).getTime()
          return dateA - dateB
        },
      }),
      columnHelper.accessor((row) => (row.votesInFavor ?? 0) + (row.votesAgainst ?? 0), {
        id: "votes",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Votos</Box>,
        size: 110,
        minSize: 110,
        maxSize: 120,
        cell: ({ row, getValue }) => {
          const total = getValue() as number
          const inFavor = (row.original as Initiative).votesInFavor ?? 0
          const against = (row.original as Initiative).votesAgainst ?? 0
          return (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" fontWeight={700}>
                {total}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                <Typography variant="caption" color="success.main">
                  👍 {inFavor}
                </Typography>
                <Typography variant="caption" color="error.main">
                  👎 {against}
                </Typography>
              </Box>
            </Box>
          )
        },
        sortingFn: (rowA, rowB) => {
          const totalA = (rowA.original.votesInFavor ?? 0) + (rowA.original.votesAgainst ?? 0)
          const totalB = (rowB.original.votesInFavor ?? 0) + (rowB.original.votesAgainst ?? 0)
          return totalA - totalB
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}></Box>,
        size: 40,
        minSize: 40,
        maxSize: 40,
        enableSorting: false,
        cell: ({ row }: { row: { original: Initiative } }) => (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(e) => {
                setAnchorEl(e.currentTarget)
                setSelectedRow(row.original)
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        ),
      }),
    ],
    [],
  )

  // Table instance
  const table = useReactTable({
    data: filteredInitiatives,
    columns,
    state: {
      globalFilter,
      pagination,
      columnVisibility,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Handlers
  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleAction = (action: string) => {
    if (!selectedRow) return
    const { state } = selectedRow

    switch (action) {
      case "view":
        {
          if (state !== "draft") {
            goToInitiative(selectedRow)
          } else {
            showSnackbar({
              message: "No se puede ver una iniciativa en borrador",
              severity: "warning",
              title: "Advertencia",
            })
          }
        }
        break
      case "edit":
        navigate("/update", { state: { initiative: selectedRow } })
        break
      case "delete":
        setDeleteModalOpen(true)
        break
    }
    // No cerramos el menú aquí para la opción de borrado,
    // el modal se encargará de ello
    if (action !== "delete") {
      handleMenuClose()
    }
  }

  const handleDeleteInitiative = () => {
    if (!selectedRow) {
      throw new Error("No hay ninguna iniciativa seleccionada para eliminar.")
    }
    deleteMutation.mutate(selectedRow.id)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    handleMenuClose() // Asegúrate de cerrar el menú de acciones también
  }

  const visibleColumns = table
    .getAllColumns()
    .filter((col: Column<Initiative, unknown>) => col.getCanHide() && col.id !== "actions")

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, mx: "auto", py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: "auto" }}
      >
        {/* Main Tabs */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: "transparent",
            borderRadius: 10,
            px: 4,
            py: 1,
            display: "inline-flex",
            gap: 0.5,
            // mb: 2,
          }}
        >
          {[
            { label: "Mis iniciativas", icon: <RocketLaunchOutlined /> },
            { label: "Mis Participaciones", icon: <CampaignOutlined /> },
            { label: "Portafolio", icon: <WorkOutlineRounded /> },
            { label: "Postulaciones", icon: <PersonSearchRounded /> },
          ].map((tab, index) => (
            <Button
              key={index}
              variant="text"
              onClick={() => handleMainTabChange(index)}
              disabled={isLoading && mainTab === 0 && mainTab !== index} // Solo deshabilitar si está cargando "Mis iniciativas" y no es el tab actual
              sx={{
                textTransform: "none",
                color: "text.secondary",
                px: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
                "& .icon-container": {
                  borderRadius: 99, // Para forma de píldora
                  px: 3, // Más padding horizontal
                  py: 1, // Padding vertical
                  transition: "all 0.2s ease-in-out",
                  backgroundColor: mainTab === index ? "primary.main" : "", // Un fondo sutil para inactivos
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: mainTab === index ? "primary.main" : "action.hover",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: mainTab === index ? "white" : "text.secondary",
                  fontSize: "1.3rem",
                  transition: "transform 0.2s ease-in-out",
                  transform: mainTab === index ? "scale(1.1)" : "scale(1)",
                },
                "& .tab-label": {
                  fontSize: "0.875rem",
                  fontWeight: mainTab === index ? 600 : 500,
                  color: mainTab === index ? "text.primary" : "text.secondary",
                  transition: "color 0.2s ease-in-out",
                },
              }}
            >
              <Box className="icon-container">{tab.icon}</Box>
              <Typography className="tab-label">{tab.label}</Typography>
            </Button>
          ))}
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={mainTab} index={0}>
          {/* --- Contenedor Principal para Subtabs y Controles --- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            {/* Contenedor de Subtabs (Izquierda en Desktop) */}
            <Box
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                p: 0.5,
                display: "inline-flex",
                gap: 0.5,
                flexWrap: "wrap",
                order: { xs: 2, md: 1 }, // Abajo en móvil, primero en desktop
              }}
            >
              {[
                { label: "Todas", icon: <FormatListBulleted /> },
                { label: "Propuestas", icon: <LightbulbRounded /> },
                { label: "En Proceso", icon: <TrendingUpRounded /> },
                { label: "Aprobadas", icon: <CheckCircleRounded /> },
                { label: "Borradores", icon: <EditNote /> },
              ].map((tab, index) => (
                <Button
                  key={index}
                  variant="text" // Usar text para poder controlar el fondo manualmente
                  onClick={() => handleSubTabChange(index)}
                  disabled={isLoading && subTab !== index} // Prevenir clicks durante carga
                  sx={{
                    textTransform: "none",
                    borderRadius: 99,
                    px: 2.5,
                    py: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    minWidth: "auto",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease-in-out",
                    color: subTab === index ? "white" : "text.primary",
                    backgroundColor: subTab === index ? "primary.main" : "#f0f2f5",
                    "&:hover": {
                      backgroundColor: subTab === index ? "primary.main" : "#e0e0e0",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  <Box component="span" sx={{ mr: 1 }}>
                    {tab.icon}
                  </Box>
                  {tab.label}
                </Button>
              ))}
            </Box>

            {/* Contenedor de Controles de Tabla (Derecha en Desktop) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                order: { xs: 1, md: 2 }, // Arriba en móvil, segundo en desktop
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-start" },
              }}
            >
              {/* Column Visibility */}
              <Button
                variant="outlined"
                startIcon={<ViewColumn />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                size="small"
                sx={{ height: "40px" }}
              >
                Columnas
              </Button>

              {/* Search */}
              <TextField
                placeholder="Buscar iniciativas..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                size="small"
                sx={{
                  flexGrow: 1,
                  minWidth: { sm: 250 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Popover
            open={Boolean(filterAnchor)}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List sx={{ minWidth: 200 }}>
              {visibleColumns.map((column: Column<Initiative, unknown>) => (
                <ListItem key={column.id} dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        size="small"
                      />
                    }
                    label={typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                  />
                </ListItem>
              ))}
            </List>
          </Popover>

          {/* --- Fin del Contenedor Principal --- */}

          {/* Table or Loading/Error/Empty states */}
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                width: "100%",
              }}
            >
              <LoadingScreen noFixed />
            </Box>
          ) : error ? (
            <ErrorState context="loading" actionButton={() => refetch()} />
          ) : filteredInitiatives.length === 0 ? (
            <EmptyState
              context={
                subTab === 1
                  ? "proposals"
                  : subTab === 4
                    ? "drafts"
                    : subTab === 2
                      ? "in-process"
                      : subTab === 3
                        ? "active"
                        : "initiatives"
              }
              actionButton={
                (subTab === 0 || subTab === 1 || subTab === 4) && (
                  <Button onClick={() => navigate("/add")} variant="contained" size="large">
                    Crear mi primera iniciativa
                  </Button>
                )
              }
            />
          ) : (
            <Box sx={{ position: "relative" }}>
              {(deleteMutation.isPending || (showUpdateLoader && isFetching)) && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    borderRadius: 2,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <CircularProgress />
                  <Typography variant="body1" sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}>
                    Procesando...
                  </Typography>
                </Box>
              )}
              {/* Table */}
              <Paper sx={{ overflow: "hidden", borderRadius: 2, opacity: deleteMutation.isPending ? 0.5 : 1 }}>
                <motion.div
                  key={`${mainTab}-${subTab}-${pagination.pageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableContainer
                    sx={{
                      overflow: "auto",
                      // Responsive scroll behavior
                      "&::-webkit-scrollbar": {
                        height: 8,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "grey.100",
                        borderRadius: 1,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "grey.400",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "grey.500",
                        },
                      },
                    }}
                  >
                    <Table
                      stickyHeader
                      sx={{
                        minWidth: { xs: 800, sm: 1000 },
                        tableLayout: "fixed", // Fija el ancho de las columnas
                        width: "100%",
                      }}
                    >
                      <TableHead>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<Initiative>) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableCell
                                key={header.id}
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "grey.50",
                                  cursor: header.column.getCanSort() ? "pointer" : "default",
                                  borderBottom: "1px solid",
                                  borderColor: "divider",
                                  width: header.getSize(),
                                  maxWidth: header.getSize(),
                                  minWidth: header.getSize(),
                                  "&:hover": header.column.getCanSort()
                                    ? {
                                        backgroundColor: "grey.100",
                                      }
                                    : {},
                                }}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                  {header.column.getCanSort() && (
                                    <Box
                                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", ml: 0.5 }}
                                    >
                                      {header.column.getIsSorted() === "asc" ? (
                                        <KeyboardArrowUp sx={{ fontSize: "16px", color: "primary.main" }} />
                                      ) : header.column.getIsSorted() === "desc" ? (
                                        <KeyboardArrowDown sx={{ fontSize: "16px", color: "primary.main" }} />
                                      ) : (
                                        <UnfoldMore sx={{ fontSize: "14px", color: "text.secondary", opacity: 0.6 }} />
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableHead>
                      <TableBody>
                        {table.getRowModel().rows.map((row: Row<Initiative>, index: number) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: {
                                duration: 0.2,
                                delay: index * 0.03,
                                ease: [0.4, 0, 0.2, 1],
                              },
                            }}
                            style={{
                              display: "table-row",
                            }}
                          >
                            {row.getVisibleCells().map((cell: Cell<Initiative, unknown>) => (
                              <TableCell
                                key={cell.id}
                                sx={{
                                  borderBottom: "1px solid",
                                  borderColor: "divider",
                                  width: cell.column.getSize(),
                                  maxWidth: cell.column.getSize(),
                                  minWidth: cell.column.getSize(),
                                  // Solo aplicar overflow y ellipsis a columnas que no sean acciones
                                  ...(cell.column.id !== "actions" && {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }),
                                  "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                                  },
                                }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </motion.div>

                {/* Pagination */}
                <TablePagination
                  component="div"
                  count={table.getFilteredRowModel().rows.length}
                  page={pagination.pageIndex}
                  onPageChange={(_, page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
                  rowsPerPage={pagination.pageSize}
                  onRowsPerPageChange={(e) =>
                    setPagination((prev) => ({ ...prev, pageSize: parseInt(e.target.value, 10) }))
                  }
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
              </Paper>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={mainTab} index={1}>
          <MyParticipations
            subTab={subTab}
            onSubTabChange={handleSubTabChange}
            globalFilter={globalFilter}
            setGlobalFilter={stableSetGlobalFilter}
            data={filteredParticipations}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
          />
        </TabPanel>

        <TabPanel value={mainTab} index={2}>
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              pointerEvents: "auto", // Asegurar que las interacciones funcionen
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Portafolio - Próximamente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Esta sección estará disponible pronto.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                textTransform: "none",
                pointerEvents: "auto", // Asegurar que el botón sea clickeable
              }}
              // onClick={() => console.log("Portafolio clicked")}
            >
              Explorar portafolio
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={mainTab} index={3}>
          <PostulationsPanel onSubTabChange={setSubTab} initialFilter={initialPostulationFilter || undefined} />
        </TabPanel>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* Ver Iniciativa */}
          <MenuItem onClick={() => handleAction("view")} disabled={selectedRow?.state === "draft"}>
            <Visibility fontSize="small" sx={{ mr: 1 }} />
            Ver Iniciativa
          </MenuItem>
          <MenuItem onClick={() => handleAction("edit")}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem onClick={() => handleAction("delete")} sx={{ color: "error.main" }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>
        {selectedRow && (
          <ConfirmationModal
            open={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteInitiative}
            variant="delete"
            context="initiative"
            details={{ name: selectedRow.title }}
          />
        )}
      </motion.div>
    </Container>
  )
}
