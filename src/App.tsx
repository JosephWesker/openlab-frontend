import { Routes, Route } from "react-router"
import { useState, useEffect } from "react"

import LayoutProtectedRoute from "@/layouts/LayoutProtectedRoute"
import LayoutDashboard from "@/layouts/LayoutDashboard"
import ErrorBoundary from "@/components/shared/ErrorBoundary"
import NetworkErrorBoundary from "@/components/shared/NetworkErrorBoundary"
import { Http404Provider } from "@/components/shared/Http404Handler"
import NotFoundPage from "@/components/shared/NotFoundPage"
import HttpErrorPage from "@/components/shared/HttpErrorPage"

import PageLogin from "@/pages/publics/PageLogin"
import { LoadingTransition } from "@/components/ui/LoadingTransition"
import PageDashboardAdd from "./pages/protected/dashboard/PageDashboardAdd"
import PageDashboardList from "./pages/protected/dashboard/PageDashboardList"
import PageDashboardProfile from "./pages/protected/dashboard/profile/PageDashboardProfile"
import PageOnBoarding from "./pages/protected/onboarding/PageOnBoarding"
import { useAuth0 } from "@auth0/auth0-react"
import PageDashboardAdmin from "./pages/protected/dashboard/PageDashboardAdmin"
import PageDashboardUpdate from "./pages/protected/dashboard/PageDashboardUpdate"
import PageInitiative from "./pages/protected/dashboard/initiative/PageInitiative"
import PageInitiatives from "./pages/protected/dashboard/initiatives/PageInitiatives"
import PageDashboardListInitiativeById from "./pages/protected/dashboard/PageDashboardListInitiativeById"
import PageDashboardQuickGuide from "./pages/protected/dashboard/PageDashboardQuickGuide"
import PageInitiativeDraft from "./pages/protected/dashboard/initiative-draft/PageInitiativeDraft"
import { GlobalProvider } from "./context/GlobalContext"

function App() {
  // const { isLoading } = useAuth0()
  const [isTransitioning, setIsTransitioning] = useState(true)

  // Efecto para manejar solo la transición inicial de la aplicación
  useEffect(() => {
    // Simulamos un tiempo mínimo de carga para la transición inicial
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Solo consideramos carga inicial de Auth0 y primera carga de la app
  // const isInitialLoading = isLoading || isTransitioning
  const { isLoading: isAuthLoading } = useAuth0()
  const isInitialLoading = isTransitioning || isAuthLoading
  return (
    <NetworkErrorBoundary>
      <ErrorBoundary>
        <Http404Provider>
          <LoadingTransition isLoading={isInitialLoading}>
            <GlobalProvider>
              <Routes>
                <Route path="login" element={<PageLogin />} />

                {/* Ruta protegida para el dashboard */}
                <Route path="/" element={<LayoutProtectedRoute />}>
                  <Route path="onboarding" element={<PageOnBoarding />} />

                  {/* Rutas específicas dentro del dashboard */}
                  <Route element={<LayoutDashboard />}>
                    {/*  (index) */}
                    {/* <Route index element={<PageDashboardHome />} /> */}
                    <Route index element={<PageInitiatives />} />
                    <Route path="add" element={<PageDashboardAdd />} />
                    <Route path="update" element={<PageDashboardUpdate />} />
                    <Route path="list" element={<PageDashboardList />} />
                    <Route path="list/:initiativeId" element={<PageDashboardListInitiativeById />} />
                    <Route path="admin" element={<PageDashboardAdmin />} />
                    <Route path="quick-guide" element={<PageDashboardQuickGuide />} />
                    <Route path="profile/*" element={<PageDashboardProfile />} />
                    <Route path="initiatives/:slug" element={<PageInitiative />} />
                    <Route path="initiative-draft/:slug" element={<PageInitiativeDraft />} />

                    {/* Rutas dedicadas de error dentro del dashboard (versiones cortas) */}
                    <Route path="errorh" element={<HttpErrorPage />} />

                    {/* Muestra página de error 404 dentro del dashboard si la ruta no existe */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </GlobalProvider>
          </LoadingTransition>
        </Http404Provider>
      </ErrorBoundary>
    </NetworkErrorBoundary>
  )
}

export default App
