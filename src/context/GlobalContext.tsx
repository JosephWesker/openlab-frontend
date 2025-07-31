// src/context/GlobalContext.tsx
import type { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
import { createContext, useContext, useState } from "react"

export interface GlobalData {
  // user?: { id: string, name: string }
  initiative?: Initiative
  // Agrega lo que necesites
}

interface GlobalContextType {
  globalInitiative: GlobalData
  setData: (initiative: GlobalData) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalInitiative, setData] = useState<GlobalData>({})

  return (
    <GlobalContext.Provider value={{ globalInitiative, setData }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => {
  const context = useContext(GlobalContext)
  if (!context) throw new Error("useGlobal must be used within a GlobalProvider")
  return context
}
