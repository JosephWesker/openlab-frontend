import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import BugReportIcon from "@mui/icons-material/BugReport"
import ErrorIcon from "@mui/icons-material/Error"
import LinkOffIcon from "@mui/icons-material/LinkOff"
import { useApi } from "@/hooks/useApi"

// Componente que simula diferentes tipos de errores para testear el Error Boundary
const ErrorSimulator = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false)
  const fetchApi = useApi()
  // const { userFromApi } = useAuthContext()
  // const token = userFromApi?.token

  // Simula un error de JavaScript
  const throwJavaScriptError = () => {
    setShouldThrowError(true)
  }

  // Simula un error de acceso a propiedad undefined
  // const throwUndefinedError = () => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const obj: any = null
  //   // Esto causará un error: Cannot read properties of null
  //   console.log(obj.someProperty.nestedProperty)
  // }

  // Simula un error de tipo
  // const throwTypeError = () => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const func: any = "not a function"
  //   // Esto causará un error: func is not a function
  //   func()
  // }

  // Simula un error de referencia
  // const throwReferenceError = () => {
  //   // @ts-expect-error - Ignoramos TypeScript para simular el error
  //   console.log(nonExistentVariable)
  // }

  // Simula un error 404 usando useApi
  const throw404Error = async () => {
    try {
      await fetchApi({
        path: "/initiative/203", // Esta ruta debería devolver 404
        init: { method: "GET" },
      })
    } catch (error) {
      console.log("Error capturado en la simulación:", error)
    }
  }

  // Simula un error 404 usando FETCH DIRECTO (sin useApi) - PRUEBA INTERCEPTOR GLOBAL
  // const throwGlobal404Error = async () => {
  //   try {
  //     console.log("🧪 Probando interceptor global con fetch directo...")
  //     const response = await fetch("https://openlab-c1id.onrender.com/api/v1/initiative/203", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     console.log("📡 Respuesta recibida:", {
  //       status: response.status,
  //       statusText: response.statusText,
  //       ok: response.ok,
  //     })
  //   } catch (error) {
  //     console.error("❌ Error en fetch directo:", error)
  //   }
  // }

  // Si shouldThrowError es true, lanza un error
  if (shouldThrowError) {
    throw new Error("¡Error simulado para testear el Error Boundary! 🚨")
  }

  return (
    <Paper elevation={2} sx={{ p: 3, m: 2, borderRadius: 2 }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <BugReportIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Simulador de Errores
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Usa estos botones para testear el Error Boundary
        </Typography>
      </Box>

      <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="center">
        <Button
          variant="contained"
          color="error"
          startIcon={<ErrorIcon />}
          onClick={throwJavaScriptError}
          sx={{ minWidth: 180, color: "white", "&:hover": { color: "white", backgroundColor: "error.dark" } }}
        >
          Error de Estado
        </Button>

        {/* <Button
          variant="contained"
          color="warning"
          startIcon={<WarningIcon />}
          onClick={throwUndefinedError}
          sx={{ minWidth: 180, color: "white", "&:hover": { color: "white", backgroundColor: "tertiary.dark" } }}
        >
          Error Undefined
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<BugReportIcon />}
          onClick={throwTypeError}
          sx={{ minWidth: 180, color: "white", "&:hover": { color: "white", backgroundColor: "secondary.dark" } }}
        >
          Error de Tipo
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<ErrorIcon />}
          onClick={throwReferenceError}
          sx={{ minWidth: 180 }}
        >
          Error de Referencia
        </Button> */}

        <Button
          variant="contained"
          color="info"
          startIcon={<LinkOffIcon />}
          onClick={throw404Error}
          sx={{
            minWidth: 180,
            color: "white",
            "&:hover": { color: "white", backgroundColor: "info.dark" },
          }}
        >
          Error 404 (useApi)
        </Button>

        {/* <Button
          variant="contained"
          color="success"
          startIcon={<HttpIcon />}
          onClick={throwGlobal404Error}
          sx={{
            minWidth: 180,
            color: "white",
            "&:hover": { color: "white", backgroundColor: "success.dark" },
          }}
        >
          Error 404 (Global)
        </Button> */}
      </Stack>

      <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
        <Typography variant="body2" color="primary.contrastText">
          <strong>Nota:</strong> Estos botones simularán errores reales de JavaScript. El Error Boundary capturará estos
          errores y mostrará la página de error personalizada.
        </Typography>
      </Box>
    </Paper>
  )
}

export default ErrorSimulator
