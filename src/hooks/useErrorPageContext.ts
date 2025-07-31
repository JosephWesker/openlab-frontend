import { useContext } from "react"
import { ErrorPageContext } from "@/context/ErrorPageContext"

export function useErrorPageContext() {
  const context = useContext(ErrorPageContext)

  if (!context) {
    throw new Error("useErrorPageContext must be used within an ErrorPageProvider")
  }

  return context
}
