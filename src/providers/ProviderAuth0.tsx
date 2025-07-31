import { useState, useEffect, useMemo } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { AuthContext } from "@/context/AuthContext"
import { useNavigate } from "react-router"
import { API_URL, SNACKBAR_MESSAGE } from "@/lib/constants"
import { userMapper } from "@/mapper/user-mapper"
import type { UserResponse } from "@/interfaces/api/user-response"
import type { UserEntity } from "@/interfaces/user"
import { useErrorPageContext } from "@/hooks/useErrorPageContext"
import { useSnackbar } from "@/context/SnackbarContext"
// import { useSkillsStore } from "@/stores/skillsStore"
// import { useApi } from "@/hooks/useApi"

export function AuthCustomProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isAuth0Loading, getIdTokenClaims, error: auth0Error, loginWithRedirect } = useAuth0()
  const [userFromApi, setUserFromApi] = useState<UserEntity | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const { setErrorData } = useErrorPageContext()
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()
  // const setSkills = useSkillsStore((state) => state.setSkills)
  // const fetchApi = useApi()

useEffect(() => {
  if (isAuth0Loading) return;
  if (!isAuthenticated) return;

  const fetchProfile = async () => {
    setIsProfileLoading(true);
    try {
      const claims = await getIdTokenClaims();
      const rawToken = claims?.__raw ?? null;

      if (!rawToken) {
        throw new Error("No se pudo obtener el token de Auth0.");
      }

      setIdToken(rawToken);

      const response = await fetch(`${API_URL}/users/perfil`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });

      if (response.status === 401) {
        // navigate("/login");
        await loginWithRedirect({
          authorizationParams: {
            redirect_uri: window.location.origin,
          },
        })
        return;
      }

      if (!response.ok) {
        throw new Error("Error fetching /users/perfil");
      }

      const data = (await response.json()) as UserResponse;
      const user = userMapper({ user: data, token: rawToken });
      setUserFromApi(user);

      showSnackbar(SNACKBAR_MESSAGE.USER_AUTHENTICATED);

      // ⚠️ Do it after valid token
      // console.log('setSkills')
      // setSkills(fetchApi);

    } catch (err) {
      setErrorData({
        title: SNACKBAR_MESSAGE.GET_PROFILE_ERROR.title,
        message: err instanceof Error ? err.message : String(err),
      });
      setUserFromApi(null);
      navigate("/login");
      showSnackbar(SNACKBAR_MESSAGE.GET_PROFILE_ERROR);
    } finally {
      setIsProfileLoading(false);
    }
  };

  fetchProfile();
}, [isAuthenticated, isAuth0Loading, getIdTokenClaims, loginWithRedirect]);

// useEffect(() => {
//   if (idToken) {
//     console.log('setSkills')
//     setSkills(fetchApi)
//   }
// }, [idToken])

  const isAuthResolved = !isAuth0Loading && (!isAuthenticated || !isProfileLoading)

  const value = useMemo(() => ({
    userFromApi,
    setUserFromApi,
    idToken,
    isAuthenticated,
    isLoading: isAuth0Loading || isProfileLoading,
    isAuthResolved: !isAuth0Loading && (!isAuthenticated || !isProfileLoading),
    error: auth0Error,
  }), [userFromApi, setUserFromApi, idToken, isAuthenticated, isAuth0Loading, isProfileLoading, isAuthResolved, auth0Error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
