import { Navigate, Outlet } from "react-router"
import { Box } from "@mui/material"
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
      {/* <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column",
      overflow: "hidden" }}> */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header />

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: { xs: 2, md: 0.5 },
            pr: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
            // overflowY: "auto",
            // overflowX: "hidden",
            position: "relative",
            scrollbarGutter: "stable",
          }}
        >
          <div className="relative w-full min-h-full flex flex-col pt-15 [@media(min-width:900px)]:pt-24">
            <div
              style={{
                borderRadius: "24px",
                backgroundColor: "white",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
                width: "100%",
                minHeight: "calc(100vh - 180px)",
              }}
            >
              <Outlet />
            </div>
          </div>
        </Box>
      </Box>
      {/* <WhatsAppFloatingButton /> */}
    </Box>
  )
}

export default LayoutDashboard
