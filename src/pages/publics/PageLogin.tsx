import { LoadingScreen } from "@/components/ui/LoadingTransition"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"

export default function PageLogin() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const [hasRedirected, setHasRedirected] = useState(false)
  // const { state } = useLocation()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      loginWithRedirect({
        appState: { returnTo: location.state?.from || "/" },
        authorizationParams: {
          redirect_uri: window.location.origin,
          prompt: "select_account",
        },
      })
    }
  }, [isLoading, isAuthenticated, hasRedirected, loginWithRedirect, location.state])

  return <LoadingScreen />
}