import { useContext } from "react"
import { TransitionContext } from "@/context/TransitionContext"

export const useTransitionContext = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error("useTransitionContext must be used within a TransitionProvider")
  }
  return context
}

