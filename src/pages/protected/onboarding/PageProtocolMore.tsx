import { Box, Button, AppBar, Toolbar, Link, Container } from "@mui/material"
import logoImage from "@/assets/images/logo.webp"
import { useEffect } from "react"

// Importación de componentes modulares de onboarding
import { FirstHeroSection } from "@/components/onBoarding/FirstHeroSection"
import { SecondInitiativeLifecycle } from "@/components/onBoarding/SecondInitiativeLifecycle"
import { FourIncentiveArchitecture } from "@/components/onBoarding/FourIncentiveArchitecture"
import { ThreeGameRules } from "@/components/onBoarding/ThreeGameRules"
import { FiveTokenomicsChart } from "@/components/onBoarding/FiveTokenomicsChart"
import { SixValuePrinciples } from "@/components/onBoarding/SixValuePrinciples"
import { SevenProtocolFlow } from "@/components/onBoarding/SevenProtocolFlow"
import SendIcon from "@mui/icons-material/Send"
import { useNavigate } from "react-router"

export default function PageProtocolMore() {
  const navigate = useNavigate()

  // Scroll suave al inicio cuando se renderiza el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const navItems = [
    { label: "Introducción", href: "#introduccion" },
    { label: "Ciclo de Vida", href: "#ciclo-vida" },
    { label: "Axiomas", href: "#axiomas" },
    { label: "Participación", href: "#participacion" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Protocolo", href: "#protocolo" },
  ]

  // Función para scroll suave a las secciones
  const handleScrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240, 245, 255, 0.3) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 1100,
          border: "none",
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: "1200px" }}>
          <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={logoImage}
                alt="Openlab"
                sx={{ height: 32, width: "auto", cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </Box>

            {/* Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 3,
                alignItems: "center",
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  component="button"
                  onClick={() => handleScrollToSection(item.href)}
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>

            {/* Botón Empezar */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={() => navigate("/")}
              sx={{
                borderRadius: "25px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
                },
              }}
            >
              Empezar
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenido principal con padding-top para compensar navbar fijo */}
      <Box>
        {/* Hero Section */}
        <Box id="introduccion">
          <FirstHeroSection />
        </Box>

        {/* Initiative Lifecycle */}
        <Box id="ciclo-vida">
          <SecondInitiativeLifecycle />
        </Box>

        {/* Game Rules */}
        <Box id="axiomas">
          <ThreeGameRules />
        </Box>

        {/* Incentive Architecture */}
        <Box id="participacion">
          <FourIncentiveArchitecture />
        </Box>

        {/* Tokenomics Chart */}
        <Box id="tokenomics">
          <FiveTokenomicsChart />
        </Box>

        {/* Value Principles */}
        <SixValuePrinciples />

        {/* Protocol Visualization */}
        <Box id="protocolo">
          <SevenProtocolFlow />
        </Box>

        {/* Botón Empezar */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            }}
            endIcon={<SendIcon sx={{ fontSize: "1rem" }} />}
            onClick={() => navigate("/")}
          >
            Empezar
          </Button>
        </Box>
      </Box>

      {/* Floating background decorations */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(61, 123, 255, 0.03) 0%, transparent 70%)",
            animation: "float 20s ease-in-out infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(140, 88, 255, 0.03) 0%, transparent 70%)",
            animation: "float 25s ease-in-out infinite reverse",
          },
          "@keyframes float": {
            "0%, 100%": {
              transform: "translate(0, 0) scale(1)",
            },
            "33%": {
              transform: "translate(30px, -30px) scale(1.1)",
            },
            "66%": {
              transform: "translate(-20px, 20px) scale(0.9)",
            },
          },
        }}
      />
    </Box>
  )
}
