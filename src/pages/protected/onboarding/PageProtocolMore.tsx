import { Box, Button } from "@mui/material"

// Importación de componentes modulares de onboarding
import { FirstHeroSection } from "../../../components/onBoarding/FirstHeroSection"
import { SecondInitiativeLifecycle } from "../../../components/onBoarding/SecondInitiativeLifecycle"
import { FourIncentiveArchitecture } from "../../../components/onBoarding/FourIncentiveArchitecture"
import { ThreeGameRules } from "../../../components/onBoarding/ThreeGameRules"
import { FiveTokenomicsChart } from "../../../components/onBoarding/FiveTokenomicsChart"
import { SixValuePrinciples } from "../../../components/onBoarding/SixValuePrinciples"
import { SevenProtocolFlow } from "../../../components/onBoarding/SevenProtocolFlow"
import SendIcon from "@mui/icons-material/Send"
import { useNavigate } from "react-router"

export default function PageProtocolMore() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240, 245, 255, 0.3) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <FirstHeroSection />

      {/* Initiative Lifecycle */}
      <SecondInitiativeLifecycle />

      {/* Game Rules */}
      <ThreeGameRules />

      {/* Incentive Architecture */}
      <FourIncentiveArchitecture />

      {/* Tokenomics Chart */}
      <FiveTokenomicsChart />

      {/* Value Principles */}
      <SixValuePrinciples />

      {/* Protocol Visualization */}
      <SevenProtocolFlow />

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
