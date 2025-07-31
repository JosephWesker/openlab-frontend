import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router"
// import { useOnboardingStore } from "@/stores/onboardingStore"

export function ButtonLogin() {
  const navigate = useNavigate()

  return (
    <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => navigate("/login")}>
      Login
    </button>
  )
}

export function ButtonLogout() {
  const { logout } = useAuth0()
  return (
    <button
      className="bg-red-500 text-white p-2 rounded-md"
      onClick={() => {
        logout({ logoutParams: { returnTo: "https://openlab.mx" }})
      }}
    >
      Logout
    </button>
  )
}
