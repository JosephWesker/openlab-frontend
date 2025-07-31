export type SnackbarSeverity = "success" | "error" | "warning" | "info"

export type SnackbarMessage = {
  title: string
  message: string
  severity: SnackbarSeverity
}