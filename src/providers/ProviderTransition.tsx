import { useState, type ReactNode } from "react"
import { TransitionContext } from "@/context/TransitionContext"

export interface TransitionProviderProps {
  children: ReactNode
}

export const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const endTransition = () => {
    setIsTransitioning(false)
  }

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}
