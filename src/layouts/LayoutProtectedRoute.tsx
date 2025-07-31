import { Outlet } from "react-router"
import { LoadingScreen } from "@/components/ui/LoadingTransition"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { NotificationProvider } from "@/context/NotificationApiContext"
// import { AuthCustomProvider } from "@/providers/ProviderAuth0"

export default function LayoutProtectedRoute() {
  const { isGuardReady } = useAuthGuard()

  if (!isGuardReady) {
    return <LoadingScreen />
  }

  return (
    // <AuthCustomProvider>
      <NotificationProvider>
        <Outlet />
      </NotificationProvider>
    // </AuthCustomProvider>
  )}