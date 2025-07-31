import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";
import Close from "@mui/icons-material/Close";
import Explore from "@mui/icons-material/Explore";
import Assignment from "@mui/icons-material/Assignment";
import ViewList from "@mui/icons-material/ViewList";
import GroupWork from "@mui/icons-material/GroupWork";
import EditNote from "@mui/icons-material/EditNote";
import TravelExplore from "@mui/icons-material/TravelExplore";
import NoteAdd from "@mui/icons-material/NoteAdd";
import AutoStories from "@mui/icons-material/AutoStories";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { useState, useRef, useCallback, useMemo } from "react"
import { useNavigate, useLocation } from "react-router"
import { useAuth0 } from "@auth0/auth0-react"

import { useAuthContext } from "@/hooks/useAuthContext"
// import { GOOGLE_FORMS_LINK } from "@/lib/constants"
import openLabLogo from "@/assets/images/logo.webp"

interface SubMenuItem {
  text: string
  icon: React.ReactNode
  path: string
  description?: string
}

interface MenuItem {
  text: string
  icon: React.ReactNode
  path?: string
  action?: string
  external?: string
  subItems?: SubMenuItem[]
}

// Elementos principales con subdivisiones
const mainMenuItems: MenuItem[] = [
  {
    text: "Explorar iniciativas",
    icon: <TravelExplore sx={{ fontSize: 28, color: "primary.main" }} />,
    path: "/",
    subItems: [
      {
        text: "Todas las iniciativas",
        icon: <Explore />,
        path: "/dashboard",
        description: "Ver todas las iniciativas disponibles",
      },
      {
        text: "Iniciativas populares",
        icon: <Explore />,
        path: "/dashboard",
        description: "Ver las iniciativas más populares",
      },
      {
        text: "Iniciativas recientes",
        icon: <Explore />,
        path: "/dashboard",
        description: "Ver las iniciativas más recientes",
      },
    ],
  },
  {
    text: "Proponer iniciativa",
    icon: <NoteAdd sx={{ fontSize: 28, color: "primary.main" }} />,
    path: "/add",
    subItems: [
      {
        text: "Nueva iniciativa",
        icon: <EditNote />,
        path: "/dashboard/add",
        description: "Crear una nueva propuesta",
      },
      {
        text: "Desde plantilla",
        icon: <Assignment />,
        path: "/dashboard/add/template",
        description: "Usar una plantilla existente",
      },
      {
        text: "Colaborativa",
        icon: <GroupWork />,
        path: "/dashboard/add/collaborative",
        description: "Crear con otros usuarios",
      },
    ],
  },
  {
    text: "Mis iniciativas",
    icon: <AutoStories sx={{ fontSize: 28, color: "primary.main" }} />,
    path: "/list",
    subItems: [
      {
        text: "Todas mis iniciativas",
        icon: <ViewList />,
        path: "/dashboard/list",
        description: "Ver todas mis iniciativas",
      },
      {
        text: "En progreso",
        icon: <ViewList />,
        path: "/dashboard/list2",
        description: "Iniciativas en desarrollo",
      },
      {
        text: "Completadas",
        icon: <ViewList />,
        path: "/dashboard/list3",
        description: "Iniciativas finalizadas",
      },
    ],
  },
  {
    text: "Panel de Admin",
    icon: <AdminPanelSettings sx={{ fontSize: 28, color: "primary.main" }} />,
    path: "/admin",
  },
]

// Elementos inferiores
const bottomMenuItems: MenuItem[] = [
  { text: "Cerrar sesión", icon: <Logout sx={{ fontSize: 28 }} className="text-other-1" />, action: "logout" },
]

export const Sidebar = () => {
  const [open, setOpen] = useState(false)
  // const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  // const [showSubMenu, setShowSubMenu] = useState(false)
  // const [isTransitioning, setIsTransitioning] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)
  // Icono actualmente bajo el cursor (para evitar flicker en background)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  // const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth0()
  const { userFromApi } = useAuthContext()
  const isAdmin = userFromApi?.roles?.includes("ADMIN")

  // Filtrar elementos del menú basado en el rol del usuario
  const filteredMainMenuItems = useMemo(() => {
    return mainMenuItems.filter((item) => {
      // Solo mostrar "Panel de Admin" si el usuario es administrador
      if (item.text === "Panel de Admin") {
        return isAdmin
      }
      return true
    })
  }, [isAdmin])

  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
  }

  const handleNavigation = (path: string) => {
    // Cerrar submenu inmediatamente al navegar
    // setShowSubMenu(false)
    // setHoveredItem(null)
    // setIsTransitioning(false)

    if (!isActive(path)) {
      navigate(path)
      if (isMobile) {
        setTimeout(() => setOpen(false), 300)
      }
    } else if (isMobile) {
      setTimeout(() => setOpen(false), 300)
    }
  }

  const handleLogout = () => {
    // Cerrar submenu al hacer logout
    // setShowSubMenu(false)
    // setHoveredItem(null)
    // setIsTransitioning(false)

    setTimeout(() => setOpen(false), 200)
    localStorage.removeItem("openlab-onboarding-storage")
    localStorage.removeItem("initiative-storage")

    logout({ logoutParams: { returnTo: "https://openlab.mx" } })
  }

  const handleItemClick = (item: MenuItem) => {
    // Marcar el item como clickeado para prevenir hover inmediato
    setClickedItem(item.text)

    if (item.action === "logout") {
      handleLogout()
    } else if (item.path) {
      handleNavigation(item.path)
    }
  }

  // Manejo mejorado del hover con delays y transiciones suaves
  // const handleMouseEnter = useCallback(
  //   (itemText: string, hasSubItems: boolean) => {
  //     if (!hasSubItems || isMobile) return

  //     // Si el item fue clickeado recientemente, no mostrar submenu
  //     if (clickedItem === itemText) return

  //     // Limpiar cualquier timeout pendiente
  //     if (hideTimeoutRef.current) {
  //       clearTimeout(hideTimeoutRef.current)
  //       hideTimeoutRef.current = null
  //     }
  //     if (hoverTimeoutRef.current) {
  //       clearTimeout(hoverTimeoutRef.current)
  //       hoverTimeoutRef.current = null
  //     }

  //     // Si ya está mostrando el mismo submenu, no hacer nada
  //     if (showSubMenu && hoveredItem === itemText) {
  //       return
  //     }

  //     // Si está mostrando otro submenu diferente, cerrar primero y aplicar debounce
  //     if (showSubMenu && hoveredItem !== itemText) {
  //       setShowSubMenu(false)
  //     }

  //     // Usar delay (debounce) de 300 ms para mostrar cualquier submenu
  //     hoverTimeoutRef.current = setTimeout(() => {
  //       setHoveredItem(itemText)
  //       setShowSubMenu(true)
  //       setIsTransitioning(false)
  //     }, 300)
  //   },
  //   [hoveredItem, showSubMenu, isMobile, clickedItem],
  // )

  // Nueva bandera para saber si el mouse está sobre el icono o el sub-sidebar
  const mouseOverSidebarOrSub = useRef(false)

  // const handleMouseLeave = useCallback(() => {
  //   // Limpiar timeout de mostrar
  //   if (hoverTimeoutRef.current) {
  //     clearTimeout(hoverTimeoutRef.current)
  //     hoverTimeoutRef.current = null
  //   }
  //   // Marcar que el mouse ya no está sobre el icono
  //   mouseOverSidebarOrSub.current = false
  //   // Delay para ocultar - dar tiempo para entrar al submenu
  //   hideTimeoutRef.current = setTimeout(() => {
  //     if (!mouseOverSidebarOrSub.current) {
  //       setShowSubMenu(false)
  //       setTimeout(() => {
  //         setHoveredItem(null)
  //         setIsTransitioning(false)
  //       }, 150) // Sincronizado con el timeout de exit del Collapse
  //     }
  //   }, 100) // Delay más corto para mejor UX
  // }, [])

  const handleMouseEnterSidebarIcon = useCallback(() => {
    mouseOverSidebarOrSub.current = true
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  const handleSidebarIconMouseLeave = useCallback(
    (itemText: string) => {
      // Resetear estados al salir del icono
      setHoveredIcon(null)
      if (clickedItem === itemText) {
        setClickedItem(null)
      }
    },
    [clickedItem],
  )

  // const handleSubMenuMouseEnter = useCallback(() => {
  //   mouseOverSidebarOrSub.current = true
  //   // Cancelar el ocultamiento si el mouse entra al submenu
  //   if (hideTimeoutRef.current) {
  //     clearTimeout(hideTimeoutRef.current)
  //     hideTimeoutRef.current = null
  //   }
  //   if (hoverTimeoutRef.current) {
  //     clearTimeout(hoverTimeoutRef.current)
  //     hoverTimeoutRef.current = null
  //   }
  // }, [])

  // const handleSubMenuMouseLeave = useCallback(() => {
  //   mouseOverSidebarOrSub.current = false
  //   setTimeout(() => {
  //     if (!mouseOverSidebarOrSub.current) {
  //       setShowSubMenu(false)
  //       setTimeout(() => {
  //         setHoveredItem(null)
  //         setIsTransitioning(false)
  //       }, 150)
  //     }
  //   }, 100)
  // }, [])

  const SidebarItem = ({ item, isBottom = false }: { item: MenuItem; isBottom?: boolean }) => {
    const active = item.path ? isActive(item.path) : false
    const isHovered = hoveredIcon === item.text
    // const hasSubItems = Boolean(item.subItems && item.subItems.length > 0)

    // Si es un enlace externo, renderizar un Link
    if (item.external) {
      return (
        <Link
          href={item.external}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            handleMouseEnterSidebarIcon()
            setHoveredIcon(item.text)
          }}
          onMouseLeave={() => {
            handleSidebarIconMouseLeave(item.text)
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            px: 4,
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: 3,
            cursor: "pointer",
            transition: "background-color 0.15s ease-out",
            position: "relative",
            textDecoration: "none",
            "&:hover": {},
            color: "text.primary",
          }}
        >
          <Box
            sx={{
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              backgroundColor: isHovered ? "rgba(59, 130, 246, 0.06)" : "transparent",
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.06)",
              },
            }}
          >
            {item.icon}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 400,
              textAlign: "center",
              lineHeight: 1.2,
              fontSize: "0.75rem",
              mt: 0.5,
            }}
            className="text-primary"
          >
            {item.text}
          </Typography>
        </Link>
      )
    }

    return (
      <Box
        component="button"
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => {
          handleMouseEnterSidebarIcon()
          // handleMouseEnter(item.text, hasSubItems)
          setHoveredIcon(item.text)
        }}
        onMouseLeave={() => {
          handleSidebarIconMouseLeave(item.text)
          // handleMouseLeave()
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 1.5,
          px: 4,
          width: "100%",
          backgroundColor: "transparent",
          borderRadius: 3,
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.15s ease-out",
          position: "relative",
          "&:hover": {},
          color: active ? "#3b82f6" : isBottom && item.action === "logout" ? "#ef4444" : "text.primary",
        }}
      >
        <Box
          sx={{
            color: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            py: 0.75,
            borderRadius: 2,
            backgroundColor: active
              ? "rgba(59, 130, 246, 0.12)"
              : isHovered
                ? "rgba(59, 130, 246, 0.06)"
                : "transparent",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: active ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.06)",
            },
          }}
        >
          {item.icon}
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: active ? 600 : 400,
            textAlign: "center",
            lineHeight: 1.2,
            fontSize: "0.75rem",
            mt: 0.5,
          }}
          className={`${item.action === "logout" ? "text-other-1" : "text-primary"}`}
        >
          {item.text}
        </Typography>
      </Box>
    )
  }

  // Sidebar secundario mejorado con Collapse de Material UI
  // const SubMenuDrawer = () => {
  //   if (!hoveredItem || isMobile) return null

  //   const currentItem = mainMenuItems.find((item) => item.text === hoveredItem)
  //   if (!currentItem?.subItems) return null

  //   return (
  //     <Slide
  //       in={showSubMenu && !isTransitioning}
  //       direction="right"
  //       timeout={{ enter: 650, exit: 500 }}
  //       easing={{ enter: "cubic-bezier(0.25, 0.1, 0.25, 1)", exit: "cubic-bezier(0.4, 0, 0.2, 1)" }}
  //       mountOnEnter
  //       unmountOnExit
  //     >
  //       <Box
  //         onMouseEnter={handleSubMenuMouseEnter}
  //         onMouseLeave={handleSubMenuMouseLeave}
  //         sx={{
  //           position: "fixed",
  //           left: 160,
  //           top: { xs: 72, md: 96 },
  //           height: { xs: "calc(100vh - 72px)", md: "calc(100vh - 96px)" },
  //           // zIndex: (theme) => theme.zIndex.drawer,
  //           zIndex: 10,
  //           pointerEvents: "none",
  //           display: "flex",
  //           flexDirection: "column",
  //           overflow: "hidden",
  //         }}
  //       >
  //         <Paper
  //           elevation={3}
  //           sx={{
  //             width: 280,
  //             height: "100vh",
  //             borderTopRightRadius: 12,
  //             borderBottomRightRadius: 0,
  //             display: "flex",
  //             flexDirection: "column",
  //             overflow: "hidden",
  //             borderTopLeftRadius: 0,
  //             borderBottomLeftRadius: 0,
  //           }}
  //           className="bg-default"
  //         >
  //           {/* Header sin fade, aparece directamente */}
  //           <Box
  //             sx={{
  //               px: 2,
  //               py: 1.5,
  //               backgroundColor: "primary.main",
  //               color: "white",
  //               position: "relative",
  //               overflow: "hidden",
  //               "&::before": {
  //                 content: '""',
  //                 position: "absolute",
  //                 top: 0,
  //                 left: 0,
  //                 right: 0,
  //                 bottom: 0,
  //                 background: "linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 70%)",
  //                 transform: showSubMenu ? "translateX(0)" : "translateX(-100%)",
  //                 transition: "transform 0.8s ease-out 0.1s",
  //               },
  //             }}
  //           >
  //             <Typography
  //               variant="h6"
  //               sx={{
  //                 fontWeight: 700,
  //                 position: "relative",
  //                 zIndex: 1,
  //                 whiteSpace: "nowrap",
  //               }}
  //             >
  //               {currentItem.text}
  //             </Typography>
  //           </Box>

  //           {/* Lista de elementos sin fade, aparecen directamente con el collapse */}
  //           <Box
  //             sx={{
  //               flexGrow: 1,
  //               overflowY: "auto",
  //               overflowX: "hidden",
  //             }}
  //           >
  //             <List sx={{ p: 2 }}>
  //               {currentItem.subItems.map((subItem) => (
  //                 <ListItem
  //                   key={subItem.text}
  //                   component="button"
  //                   onClick={() => handleNavigation(subItem.path)}
  //                   sx={{
  //                     borderRadius: 2,
  //                     mb: 1,
  //                     transition: "background-color 0.2s ease",
  //                     "&:hover": {
  //                       bgcolor: "action.hover",
  //                     },
  //                     bgcolor: isActive(subItem.path) ? "primary.light" : "transparent",
  //                     color: isActive(subItem.path) ? "primary.contrastText" : "text.primary",
  //                     cursor: "pointer",
  //                   }}
  //                 >
  //                   <ListItemIcon
  //                     sx={{
  //                       color: "primary.main",
  //                       minWidth: 40,
  //                     }}
  //                   >
  //                     {subItem.icon}
  //                   </ListItemIcon>
  //                   <ListItemText
  //                     primary={subItem.text}
  //                     secondary={subItem.description}
  //                     primaryTypographyProps={{
  //                       fontWeight: isActive(subItem.path) ? 600 : 500,
  //                       color: isActive(subItem.path) ? "primary.main" : "text.primary",
  //                       noWrap: true,
  //                     }}
  //                     secondaryTypographyProps={{
  //                       fontSize: "0.75rem",
  //                       color: isActive(subItem.path) ? "primary.main" : "text.secondary",
  //                       noWrap: true,
  //                     }}
  //                   />
  //                 </ListItem>
  //               ))}
  //             </List>
  //           </Box>
  //         </Paper>
  //       </Box>
  //     </Slide>
  //   )
  // }

  // User profile section
  const UserProfileSection = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 1.5,
          width: "100%",
          borderRadius: 3,
          cursor: "pointer",
          // transition: "background-color 0.2s ease-in-out",
          // "&:hover": {
          //   backgroundColor: "rgba(59, 130, 246, 0.1)",
          // },
        }}
        onClick={() => navigate("/profile")}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderRadius: "25%",
            p: 1.5,
          }}
        >
          <Avatar
            src={userFromApi?.image}
            alt={userFromApi?.name}
            sx={{
              width: 32,
              height: 32,
              border: 2,
              borderColor: "divider",
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {userFromApi?.name?.substring(0, 20).concat("...") || "Usuario"}
        </Typography>
      </Box>
    )
  }

  const drawer = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        px: 1,
        py: isMobile ? 1 : 2.5,
        overflow: "hidden",
      }}
    >
      {/* Close button for mobile */}
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", pl: 2 }} onClick={() => navigate("/")}>
            <img src={openLabLogo} alt="OpenLab Logo" style={{ height: "32px", width: "auto" }} />
          </Box>

          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            <Close color="primary" />
          </IconButton>
        </Box>
      )}

      {/* Mobile User Profile - Horizontal */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            p: 1.5,
            width: "100%",
            borderRadius: 3,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            },
            backgroundColor: isActive("/profile") ? "rgba(59, 130, 246, 0.1)" : "transparent",
            mb: 2,
          }}
          onClick={() => {
            setOpen(false)
            navigate("/profile")
          }}
        >
          <Avatar
            src={userFromApi?.image}
            alt={userFromApi?.name}
            sx={{
              width: 40,
              height: 40,
              border: 2,
              borderColor: "divider",
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {userFromApi?.name || "Usuario"}
          </Typography>
        </Box>
      )}

      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 1 : 0,
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          // Personalización del scrollbar
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          },
          // Para Firefox
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.primary.main} transparent`,
        }}
      >
        {/* Mobile Content - Normal Flow */}
        {isMobile && (
          <>
            {/* Main Navigation for Mobile */}
            <Stack
              sx={{
                gap: 0.5,
                width: "100%",
                alignItems: "stretch",
              }}
            >
              {mainMenuItems.map((item) => (
                <Box key={item.text} sx={{ width: "100%" }}>
                  <Box
                    component="button"
                    onClick={() => handleItemClick(item)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      width: "100%",
                      backgroundColor: item.path && isActive(item.path) ? "rgba(59, 130, 246, 0.1)" : "transparent",
                      borderRadius: 2,
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor:
                          item.path && isActive(item.path) ? "rgba(59, 130, 246, 0.15)" : "rgba(0, 0, 0, 0.04)",
                      },
                      color: item.path && isActive(item.path) ? "#3b82f6" : "text.primary",
                      textAlign: "left",
                    }}
                  >
                    <Box
                      sx={{
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: item.path && isActive(item.path) ? 600 : 400,
                        fontSize: "0.875rem",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Bottom Navigation for Mobile */}
            <Stack
              sx={{
                width: "100%",
                alignItems: "stretch",
                gap: 0.5,
                mt: 2,
              }}
            >
              {bottomMenuItems.map((item) => (
                <Box key={item.text} sx={{ width: "100%" }}>
                  {item.external ? (
                    <Link
                      href={item.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        width: "100%",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "background-color 0.2s ease-in-out",
                        textDecoration: "none",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        color: "text.primary",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Link>
                  ) : (
                    <Box
                      component="button"
                      onClick={() => handleItemClick(item)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        width: "100%",
                        backgroundColor: item.path && isActive(item.path) ? "rgba(59, 130, 246, 0.1)" : "transparent",
                        borderRadius: 2,
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor:
                            item.path && isActive(item.path) ? "rgba(59, 130, 246, 0.15)" : "rgba(0, 0, 0, 0.04)",
                        },
                        color:
                          item.action === "logout"
                            ? "#ef4444"
                            : item.path && isActive(item.path)
                              ? "#3b82f6"
                              : "text.primary",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: item.path && isActive(item.path) ? 600 : 400,
                          fontSize: "0.875rem",
                        }}
                        className={`${item.action === "logout" ? "text-other-1" : ""}`}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </>
        )}

        {/* Desktop Content - Space Between Layout */}
        {!isMobile && (
          <>
            {/* Logo and User Profile for Desktop */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 4,
                mt: 1.5,
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <img
                  src={openLabLogo}
                  alt="OpenLab Logo"
                  style={{ height: "32px", width: "auto", objectFit: "contain" }}
                />
              </Box>
              <UserProfileSection />
            </Box>

            {/* Main Navigation for Desktop */}
            <Stack
              sx={{
                flexGrow: 1,
                gap: 0,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filteredMainMenuItems.map((item) => (
                <Box key={item.text} sx={{ width: "100%" }}>
                  <SidebarItem item={item} />
                </Box>
              ))}
            </Stack>

            {/* Bottom Navigation for Desktop */}
            <Stack
              sx={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 0,
                mb: 1,
              }}
            >
              {bottomMenuItems.map((item) => (
                <Box key={item.text} sx={{ width: "100%" }}>
                  <SidebarItem item={item} isBottom={true} />
                </Box>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1200,
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <IconButton onClick={() => setOpen(true)} color="primary">
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {isMobile ? (
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          disableBackdropTransition={false}
          disableDiscovery={false}
          SwipeAreaProps={{
            sx: { width: 30 },
          }}
          sx={{
            width: 240,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              boxShadow: 3,
              zIndex: 1100,
              border: "none",
            },
          }}
        >
          {drawer}
        </SwipeableDrawer>
      ) : (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 180,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 180,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: "width 0.25s ease-in-out",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Sidebar secundario para subdivisiones */}
      {/* <SubMenuDrawer /> */}
    </>
  )
}
