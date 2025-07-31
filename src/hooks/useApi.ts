import { API_PATH, API_URL } from "@/lib/constants"
// import { useSnackbar } from "@/context/SnackbarContext"
import { useNavigate } from "react-router"
import { useAuth0 } from "@auth0/auth0-react"

export type RequestApi = {
  path: string
  init?: RequestInit
}

export const useApi = () => {
  const navigate = useNavigate()
  const { getIdTokenClaims } = useAuth0()
  // const { showSnackbar } = useSnackbar()

  return async function request({ path, init }: RequestApi) {
    try {
      const { __raw: idToken } = (await getIdTokenClaims()) || {}

      const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (response.status === 401) {
        navigate("/login")
        return
      }

      if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(errorBody.error || "Error al realizar la petición")
      }

      if (
        (path.includes(`${API_PATH.INITIATIVE_NOTIFICATION}/`) && init?.method !== "PATCH") ||
        (path.includes(`${API_PATH.INITIATIVE_APPLICATIONS}/`) && init?.method === "DELETE")
      ) {
        return
      }

      if (
        (path.includes(`${API_PATH.INITIATIVE}/`) && init?.method === "DELETE") ||
        (path === API_PATH.INITIATIVE && init?.method === "PUT") ||
        path.includes(`${API_PATH.INITIATIVE_DRAFT_TO_PUBLISHED}/`)
      ) {
        return await response.text()
      }

      return ![
        API_PATH.INITIATIVE_VOTE,
        API_PATH.ROLE_UPDATE,
        API_PATH.INVITATION_COFOUNDER_EMAIL,
        API_PATH.INITIATIVE_CREATE_NOTICE,
      ].includes(path)
        ? await response.json()
        : await response.text()
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }

      // showSnackbar({
      //   title: "Error al obtener los datos",
      //   message: error instanceof Error ? error.message : String(error),
      //   severity: "error",
      // })
      throw error
    }
  }
}
