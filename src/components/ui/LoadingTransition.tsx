import { useEffect, useRef } from "react"
import Lottie from "lottie-react"
import lottieAnimation from "../../assets/lotfiles/Frame 373.json"

export function LottieLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const lottieRef = useRef(null)
  const sizeClass = {
    sm: "h-56 w-56",
    md: "h-64 w-64",
    lg: "h-80 w-80",
  }

  useEffect(() => {
    if (lottieRef.current) {
      // @ts-expect-error - setSpeed method exists on lottie instance
      lottieRef.current.setSpeed(0.3)
    }
  }, [])

  return (
    <div className={sizeClass[size]}>
      <Lottie lottieRef={lottieRef} animationData={lottieAnimation} loop={true} />
    </div>
  )
}

interface LoadingTransitionProps {
  isLoading: boolean
  children: React.ReactNode
}

export function LoadingTransition({ isLoading, children }: LoadingTransitionProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative w-full h-full min-h-screen">
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <LottieLoader size="lg" />
      </div>
      <div className="invisible">{children}</div>
    </div>
  )
}

export function LoadingScreen({ noFixed = false }: { noFixed?: boolean }) {
  return (
    <div
      className={`${noFixed ? "" : "fixed inset-0"} flex flex-col items-center justify-center bg-white bg-opacity-80 z-50`}
    >
      <LottieLoader size="lg" />
    </div>
  )
}
