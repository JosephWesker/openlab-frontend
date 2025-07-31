import { useState, useRef } from "react"

export const useHoverVideo = ({ controls }: { controls: boolean })  => {
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (controls) setShowControls(true)
    if (videoRef.current && !controls) videoRef.current.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    if (controls) setShowControls(false)
    if (!controls) if (videoRef.current) videoRef.current.pause()
  }

  return {
    videoRef,
    showControls,
    handleMouseEnter,
    handleMouseLeave,
  }
}