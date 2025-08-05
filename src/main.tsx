import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import { Auth0Provider } from "@auth0/auth0-react"
import { AuthCustomProvider } from "./providers/ProviderAuth0"
import type { AppState, Auth0ProviderOptions } from "@auth0/auth0-react"

import { StyledEngineProvider } from "@mui/material/styles"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"

import { TransitionProvider } from "./providers/ProviderTransition"
// import { ProviderErrorPage } from "./providers/ProviderErrorPage"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "./App.tsx"
import "./index.css"
import { theme } from "./lib/theme.ts"
import { SnackbarProvider } from "./context/SnackbarContext.tsx"
import Clarity from "@microsoft/clarity"
import { CLARITY_ID } from "./lib/constants.ts"

// import { NotificationProvider } from "./context/NotificationApiContext"

// Función para manejar la redirección después del login
const onRedirectCallback = (appState?: AppState) => {
  if (appState?.returnTo) {
    window.location.href = appState.returnTo
  }
}

// Configuración para mantener el estado de autenticación
const providerConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    scope: "openid profile email",
  },
  onRedirectCallback,
  // Estas opciones ayudan a mantener la sesión activa
  cacheLocation: "localstorage",
  useRefreshTokens: true, // ⚠️ ToDo: test getTokenSilently to not implement useRefreshTokens. useRefreshTokens causes warning on Auth0 but is normal in SPAs
} as Auth0ProviderOptions

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

if (process.env.NODE_ENV === "production") {
  Clarity.init(CLARITY_ID) // o process.env.REACT_APP_CLARITY_ID
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider {...providerConfig}>
        <AuthCustomProvider>
          <SnackbarProvider>
            {/* <NotificationProvider> */}
            <StyledEngineProvider enableCssLayer>
              <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
              <ThemeProvider theme={theme}>
                <TransitionProvider>
                  <App />
                </TransitionProvider>
              </ThemeProvider>
            </StyledEngineProvider>
            {/* </NotificationProvider> */}
          </SnackbarProvider>
        </AuthCustomProvider>
      </Auth0Provider>
    </QueryClientProvider>
  </BrowserRouter>,
)
