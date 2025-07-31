import { ButtonLogin, ButtonLogout } from "@/components/login/ButtonTemporal"
import { useAuth0 } from "@auth0/auth0-react"
import { Avatar, CardContent, Card, Button } from "@mui/material"
import { useNavigate } from "react-router"

export default function PageHome() {
  const { isAuthenticated, user } = useAuth0()
  const navigate = useNavigate()

  return (
    <div>
      <h1>Bienvenido a la aplicación</h1>
      <p>Esto no va ir solo es una prueba hasta unir la landing con la app</p>
      <div className="flex gap-2">
        {isAuthenticated ? (
          <div className="flex gap-2 justify-center items-center">
            <Card>
              <CardContent className="flex gap-2 flex-col justify-center items-center">
                <p>{user?.email}</p>
                <p>{user?.name}</p>
                <Avatar src={user?.picture} />
              </CardContent>
            </Card>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
              Dashboard
            </Button>
            <ButtonLogout />
          </div>
        ) : (
          <>
            <ButtonLogin />
            <ButtonLogout />
          </>
        )}
      </div>
    </div>
  )
}
