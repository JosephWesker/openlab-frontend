import { createContext } from "react"

interface ErrorPageContextType {
  errorData: {
    message: string
    title: string
  }
  setErrorData: (errorData: { message: string; title: string }) => void
}

export const ErrorPageContext = createContext<ErrorPageContextType>({
  errorData: {
    message: "",
    title: "",
  },
  setErrorData: () => {},
})
