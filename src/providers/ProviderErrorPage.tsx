import { useState, type ReactNode } from "react"
import { ErrorPageContext } from "@/context/ErrorPageContext"

export interface ProviderErrorPage {
  children: ReactNode
}

export const ProviderErrorPage = ({ children }: ProviderErrorPage) => {
  const [errorData, setErrorData] = useState({
    message: "",
    title: "",
  })

  return <ErrorPageContext.Provider value={{ errorData, setErrorData }}>{children}</ErrorPageContext.Provider>
}
