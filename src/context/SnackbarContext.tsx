import { createContext, useState, use } from "react"
import { Snackbar, Alert, Slide } from "@mui/material"
import type { SnackbarMessage, SnackbarSeverity } from "@/interfaces/general"

interface SnackbarContextType {
  showSnackbar: (message: SnackbarMessage) => void
}

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
})

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "info" as SnackbarSeverity,
  })

  const showSnackbar = (snackbarMessage: SnackbarMessage) => {
    setSnackbarState({ open: true, message: snackbarMessage.message, severity: snackbarMessage.severity })
  }

  const handleClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }))
  }

  return (
    <SnackbarContext value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        slots={{ transition: Slide }}
      >
        <Alert onClose={handleClose} severity={snackbarState.severity} sx={{ width: "100%" }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </SnackbarContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => use(SnackbarContext)