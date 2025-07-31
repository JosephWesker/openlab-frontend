// useAuthGuard.ts
import { useEffect } from "react"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useNavigate, useLocation } from "react-router"
import { useSnackbar } from "@/context/SnackbarContext"
import { SNACKBAR_MESSAGE } from "@/lib/constants"
import { useErrorPageContext } from "@/hooks/useErrorPageContext"

export function useAuthGuard() {
  const { userFromApi, isAuthenticated, isAuthResolved, error } = useAuthContext()
  const { showSnackbar } = useSnackbar()
  const { errorData } = useErrorPageContext()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // console.log('useAuthGuard')

    if (!isAuthResolved) return
      // console.log('isAuthResolved', isAuthResolved)

    if (error) {
      showSnackbar(SNACKBAR_MESSAGE.AUTH_ERROR)
      navigate("/login", { replace: true, state: { from: location.pathname } })
    } else if (!isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location.pathname } })
    } else if (!userFromApi && errorData.title === SNACKBAR_MESSAGE.GET_PROFILE_ERROR.title) {
      showSnackbar(SNACKBAR_MESSAGE.GET_PROFILE_ERROR)
      navigate("/login", { replace: true })
    } else if (userFromApi && !userFromApi.roles?.includes("ADMIN") && location.pathname === "/admin") {
      navigate("/", { replace: true })
    }
  }, [isAuthResolved, isAuthenticated, error, userFromApi, errorData, location.pathname, navigate, showSnackbar])

  return {
    isGuardReady: isAuthResolved && (userFromApi !== null || !isAuthenticated),
  }
}