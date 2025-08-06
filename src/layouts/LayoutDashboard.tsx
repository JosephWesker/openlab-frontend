import { Navigate, Outlet } from "react-router"
import { Box, Paper } from "@mui/material"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Header } from "@/components/dashboard/Header"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useOnboardingStore } from "@/stores/onboardingStore"
// import WhatsAppFloatingButton from "@/components/shared/WhatsAppFloatingButton"

const LayoutDashboard = () => {
  const { userFromApi } = useAuthContext()
  const onboardingCompleted = useOnboardingStore((state) => state.onboardingCompleted)

  if (!userFromApi?.skills?.general.length && !userFromApi?.roles?.length && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar tradicional */}
      <Sidebar />

      {/* Contenedor principal con header y contenido */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header />

        {/* Contenido principal */}
        <Paper
          elevation={3}
          component="main"
          sx={{
            mb: { xs: 2, md: 3 },
            mr: { xs: 2, md: 3 },
            mt: { xs: 10, md: 13 },
            ml: { xs: 0, md: 1 },
            p: {
              xs: 2,
              md: 2,
            },
            overflowY: "unset", // warning: setting to scroll will affect the padding
            borderRadius: "32px",
            backgroundColor: "white",
            flex: 1,
            scrollbarGutter: "stable",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
            },
          }}
        >
          {/* <div className="relative w-full min-h-full flex flex-1 pl-1 flex-col pt-15 [@media(min-width:900px)]:pt-26 bg-green-500"> */}
          {/* <Paper
            elevation={4}
            sx={{
              borderRadius: "32px",
              width: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              scrollbarGutter: "stable",
              pt: {
                xs: 15,
                md: 26,
              },
            }}
          > */}
          <Outlet />
          {/* </Paper> */}
          {/* </div> */}
        </Paper>
      </Box>
    </Box>
  )
}

export default LayoutDashboard
