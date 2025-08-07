import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Box from "@mui/material/Box"
import { useTheme } from "@mui/material/styles"
import { useMediaQuery } from "@mui/material"
import Typography from "@mui/material/Typography"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Popover from "@mui/material/Popover"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MoodRounded from "@mui/icons-material/MoodRounded"
import StarsRounded from "@mui/icons-material/StarsRounded"
import ContactSupport from "@mui/icons-material/ContactSupport"
import { Whatsapp } from "../shared/IconsShared"
import { NotificationCenter } from "./NotificationCenter"
import { useLocation, useNavigate } from "react-router"
import { useNotifications } from "@/context/NotificationApiContext"
import { useEffect, useState } from "react"
import { useSkillsStore } from "@/stores/skillsStore"
import { useApi } from "@/hooks/useApi"
import { HEADER_ACTIONS, BREADCRUMB_STRUCTURE } from "@/lib/constants"
import slugify from "slugify"

export const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()
  const navigate = useNavigate()
  const { refetchNotifications } = useNotifications()
  const { setSkills } = useSkillsStore()
  const fetchApi = useApi()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleActionClick = (path: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(path, "_blank", "noopener,noreferrer")
    } else {
      navigate(path)
    }
    handleClose()
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  // Refetch notifications cuando cambie la ruta
  useEffect(() => {
    refetchNotifications()
  }, [location.pathname, refetchNotifications])

  useEffect(() => {
    setSkills(fetchApi)
  }, [])

  const createSlug = (title: string) => {
    let processedTitle = title

    // Detecta si está URL-encoded y decodifica
    if (title.includes("%")) {
      try {
        processedTitle = decodeURIComponent(title)
      } catch {
        // Si falla la decodificación, usa el título original
        processedTitle = title
      }
    }

    return slugify(processedTitle, {
      strict: true,
      locale: "es",
    })
  }

  // Función para generar breadcrumbs basado en la ruta actual
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean)

    const breadcrumbs: { label: string; path: string; isLast: boolean }[] = []

    if (pathSegments.length === 0) {
      breadcrumbs.push({
        label: "Inicio",
        path: "/",
        isLast: true,
      })
      return breadcrumbs
    }

    breadcrumbs.push({
      label: "Inicio",
      path: "/",
      isLast: false,
    })

    let currentPath = ""

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentLevel: any = BREADCRUMB_STRUCTURE

    pathSegments.forEach((segment: string, index: number) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      let label = segment

      if (currentLevel && currentLevel[segment]) {
        label = currentLevel[segment].title || segment
        currentLevel = currentLevel[segment].subpaths || undefined
      } else {
        currentLevel = undefined
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast,
      })
    })

    return breadcrumbs
  }

  const ActionButtons = () => {
    if (isMobile) {
      return (
        <>
          <Paper elevation={2} sx={{ borderRadius: 9999 }}>
            <Tooltip title="Ayuda y Soporte">
              <IconButton color="primary" onClick={handleOpen}>
                <ContactSupport sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>
          </Paper>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  width: "auto",
                  mt: 1,
                  borderRadius: 2,
                  p: 1,
                  backdropFilter: "blur(10px)",
                  backgroundColor: (theme) => `${theme.palette.background.paper}F5`,
                },
              },
            }}
          >
            <List sx={{ display: "flex", flexDirection: "row", p: 0 }}>
              {HEADER_ACTIONS.map((action) => (
                <ListItem
                  key={action.text}
                  onClick={() => handleActionClick(action.path, action.isExternal)}
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                      cursor: "pointer",
                    },
                    flexDirection: "column",
                    gap: 0.5,
                    minWidth: 100,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "primary.main",
                      justifyContent: "center",
                    }}
                  >
                    {action.icon === "StarsRounded" ? (
                      <StarsRounded sx={{ fontSize: 24 }} />
                    ) : action.icon === "MoodRounded" ? (
                      <MoodRounded sx={{ fontSize: 24 }} />
                    ) : (
                      <Whatsapp width={24} height={24} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={action.text}
                    primaryTypographyProps={{
                      variant: "caption",
                      color: "primary.main",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Popover>
        </>
      )
    }

    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        {HEADER_ACTIONS.map((action) => (
          <Box key={action.text} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <Paper elevation={2} sx={{ borderRadius: 9999 }}>
              <IconButton color="primary" onClick={() => handleActionClick(action.path, action.isExternal)}>
                {action.icon === "StarsRounded" ? (
                  <StarsRounded sx={{ fontSize: 24 }} />
                ) : action.icon === "MoodRounded" ? (
                  <MoodRounded sx={{ fontSize: 24 }} />
                ) : (
                  <Whatsapp width={24} height={24} />
                )}
              </IconButton>
            </Paper>
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
              {action.text}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        height: { xs: 72, md: 96 },
        width: { xs: "100%", md: "calc(100% - 160px)" },
        ml: { xs: 0, md: "160px" },
        display: "flex",
        justifyContent: "center",
        zIndex: { xs: 1000, md: (theme) => theme.zIndex.drawer + 1 },
        bgcolor: "background.paper",
        backdropFilter: "blur(10px)",
        backgroundColor: (theme) => `${theme.palette.background.paper}F5`, // 96% opacity
      }}
    >
      <Toolbar sx={{ height: "100%", px: 3 }}>
        {/* Logo y Breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexGrow: 1,
            ml: isMobile ? 6 : 0,
          }}
        >
          {/* Logo */}
          {/* <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => navigate("/")}>
            <img src={openLabLogo} alt="OpenLab Logo" style={{ height: "32px", width: "auto" }} />
          </Box> */}

          {/* Breadcrumbs */}
          <Breadcrumbs
            separator="/"
            sx={{
              display: { xs: "none", sm: "flex" },
              "& .MuiBreadcrumbs-separator": {
                color: "text.secondary",
                mx: 1,
              },
            }}
          >
            {getBreadcrumbs().map((crumb, index) =>
              crumb.isLast ? (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                >
                  {createSlug(crumb.label)}
                </Typography>
              ) : (
                <Typography
                  key={index}
                  variant="body2"
                  component="button"
                  onClick={() => navigate(crumb.path)}
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease-in-out",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {crumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ActionButtons />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <NotificationCenter />
            {!isMobile && (
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                Alertas
              </Typography>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
