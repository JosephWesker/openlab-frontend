import { Paper } from "@mui/material"
import Lottie from "lottie-react"
import lottieAnimation from "../../assets/lotfiles/Frame 373.json"
import { useEffect, useRef } from "react"

interface ContentTransitionProps {
  isLoading: boolean
  children: React.ReactNode
}

export const ContentTransition: React.FC<ContentTransitionProps> = ({ isLoading, children }) => {
  const lottieRef = useRef(null)

  useEffect(() => {
    if (lottieRef.current) {
      // @ts-expect-error - setSpeed method exists on lottie instance
      lottieRef.current.setSpeed(0.3)
    }
  }, [])

  if (!isLoading) {
    return (
      <div className="relative w-full min-h-full flex flex-col pt-15 [@media(min-width:900px)]:pt-24">
        <Paper
          elevation={4}
          className="w-full"
          style={{
            borderRadius: "24px",
          }}
        >
          {children}
        </Paper>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-full flex flex-col pt-15 [@media(min-width:900px)]:pt-24">
      <div className="fixed top-0 bottom-0 right-0 left-0 lg:!left-[260px] flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="w-64 h-64">
            <Lottie lottieRef={lottieRef} animationData={lottieAnimation} loop={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
