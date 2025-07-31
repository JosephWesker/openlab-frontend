import { Box } from "@mui/material"
import Lottie from "lottie-react"
import lottieAnimation from "../../assets/lotfiles/Frame 373.json"
import { useEffect, useRef } from "react"

interface FullScreenLoaderProps {
  isLoading: boolean
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
  const lottieRef = useRef(null)

  useEffect(() => {
    if (lottieRef.current && isLoading) {
      // @ts-expect-error - setSpeed method exists on lottie instance
      lottieRef.current.setSpeed(0.5)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        "@media (min-width: 900px)": {
          left: "150px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ width: 400, height: 400 }}>
          <Lottie lottieRef={lottieRef} animationData={lottieAnimation} loop={true} />
        </Box>
      </Box>
    </Box>
  )
}
