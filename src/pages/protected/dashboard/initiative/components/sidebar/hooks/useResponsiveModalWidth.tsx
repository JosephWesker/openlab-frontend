import { useEffect, useState } from "react"

export const useResponsiveModalWidth = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // const getModalWidth = (step: number) => {
  //   const isMobile = windowWidth < 1000

  //   switch (step) {
  //     case 0:
  //       return isMobile ? "95vw" : "54rem"
  //     case 1:
  //       return isMobile ? "95vw" : "32rem"
  //     case 2:
  //       return isMobile ? "95vw" : "36rem"
  //     case 3:
  //       return isMobile ? "95vw" : "30rem"
  //     default:
  //       return isMobile ? "95vw" : "45rem"
  //   }
  // }

  return { windowWidth }
}
