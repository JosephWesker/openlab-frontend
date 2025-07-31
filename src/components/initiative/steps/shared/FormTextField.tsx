import React, { type InputHTMLAttributes } from "react"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import { alpha } from "@mui/material/styles"
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Close from "@mui/icons-material/Close"
import type { FieldError, UseFormRegisterReturn } from "react-hook-form"
import type { OverridableComponent } from "@mui/material/OverridableComponent"
import type { SvgIconTypeMap } from "@mui/material/SvgIcon"

interface FormTextFieldProps {
  register: UseFormRegisterReturn
  label: string
  placeholder: string
  value: string
  error?: FieldError
  maxLength?: number
  multiline?: boolean
  rows?: number
  minRows?: number
  maxRows?: number
  legendFontSize?: string
  labelFontSize?: string
  disabled?: boolean
  onClear?: () => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  sx?: object
  icon?: OverridableComponent<SvgIconTypeMap<object, "svg">> & { muiName: string }
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  inputId?: string
}

export const FormTextField: React.FC<FormTextFieldProps> = React.memo(
  ({
    register,
    label,
    placeholder,
    value,
    error,
    maxLength,
    multiline = false,
    rows,
    minRows,
    maxRows,
    legendFontSize = "0.935rem",
    labelFontSize = "1.25rem",
    disabled = false,
    onClear,
    onKeyPress,
    sx = {},
    icon: IconComponent,
    inputProps,
    inputId,
  }) => {
    const theme = useTheme()

    return (
      <TextField
        {...register}
        id={inputId}
        label={label}
        placeholder={placeholder}
        value={value}
        error={!!error?.message}
        helperText={maxLength ? `${value.length}/${maxLength}` : ""}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        fullWidth
        maxRows={maxRows}
        minRows={minRows}
        variant="outlined"
        onKeyUp={onKeyPress}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          htmlInput: {
            maxLength: maxLength,
            ...inputProps, // Aquí podemos pasar id para el <input>
          },
          input: {
            startAdornment: IconComponent && (
              <InputAdornment position="start">
                <IconComponent color="primary" />
              </InputAdornment>
            ),
            endAdornment: value && !disabled && !multiline && (
              <InputAdornment position="end">
                <IconButton onClick={onClear} size="small" edge="end">
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: alpha(theme.palette.divider, 0.3),
              "& legend": {
                fontSize: legendFontSize,
                fontWeight: 600,
              },
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-error fieldset": {
              borderColor: theme.palette.error.main,
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "1rem",
          },
          "& .MuiInputBase-input::placeholder": {
            color: alpha(theme.palette.text.secondary, 0.6),
            opacity: 0.85,
            fontSize: "0.935rem",
            fontWeight: 400,
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.primary.main,
            fontSize: labelFontSize,
            fontWeight: 600,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
            "&.Mui-error": {
              color: theme.palette.error.main,
            },
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend": {
            fontSize: legendFontSize,
            fontWeight: 600,
          },
          "& .MuiFormLabel-root": {
            top: "-0.2rem",
          },
          ...sx,
        }}
      />
    )
  },
)

// Nuevo componente para emails como chips
interface EmailChipsFieldProps {
  register: UseFormRegisterReturn
  label: string
  placeholder: string
  emails: string[]
  onAddEmail: (email: string) => void
  onRemoveEmail: (email: string) => void
  error?: FieldError
  legendFontSize?: string
  labelFontSize?: string
  disabled?: boolean
}

export const EmailChipsField: React.FC<EmailChipsFieldProps> = React.memo(
  ({
    register,
    label,
    placeholder,
    emails,
    onAddEmail,
    onRemoveEmail,
    error,
    legendFontSize = "0.935rem",
    labelFontSize = "1.25rem",
    disabled = false,
  }) => {
    const theme = useTheme()
    const [inputValue, setInputValue] = React.useState("")

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        const email = inputValue.trim()
        if (email && !emails.includes(email)) {
          // Validación básica de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (emailRegex.test(email)) {
            onAddEmail(email)
            setInputValue("")
          }
        }
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    // Calcular altura dinámica basada en número de chips
    const getMinHeight = () => {
      if (emails.length === 0) return "56px"
      const rows = Math.ceil(emails.length / 4) // Aprox 4 chips por fila
      return `${Math.max(56, 40 + rows * 32)}px`
    }

    return (
      <TextField
        {...register}
        fullWidth
        label={label}
        placeholder={placeholder}
        variant="outlined"
        disabled={disabled}
        error={!!error}
        helperText={error?.message || "Presiona Enter o coma para agregar emails"}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          input: {
            startAdornment: emails.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mr: 1,
                  maxWidth: "calc(100% - 120px)",
                  alignItems: "center",
                }}
              >
                {emails.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    size="small"
                    onDelete={() => onRemoveEmail(email)}
                    sx={{
                      maxWidth: "200px",
                      height: "24px",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.75rem",
                      },
                      "& .MuiChip-deleteIcon": {
                        fontSize: "16px",
                      },
                    }}
                  />
                ))}
              </Box>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            minHeight: getMinHeight(),
            alignItems: "flex-start",
            paddingTop: "14px",
            paddingBottom: "14px",
            paddingLeft: "14px",
            paddingRight: "14px",
            "& fieldset": {
              borderColor: alpha(theme.palette.divider, 0.3),
              "& legend": {
                fontSize: legendFontSize,
                fontWeight: 600,
              },
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-error fieldset": {
              borderColor: theme.palette.error.main,
            },
          },
          "& .MuiInputBase-input": {
            fontSize: "1rem",
            minWidth: "120px",
            flexGrow: 1,
            padding: "2px 4px",
            marginTop: emails.length > 0 ? "4px" : "0",
          },
          "& .MuiInputBase-input::placeholder": {
            color: alpha(theme.palette.text.secondary, 0.6),
            opacity: 0.85,
            fontSize: "0.935rem",
            fontWeight: 400,
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.text.primary,
            fontSize: labelFontSize,
            fontWeight: 600,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
            "&.Mui-error": {
              color: theme.palette.error.main,
            },
          },
          "& .MuiFormLabel-root": {
            top: "-0.2rem",
          },
        }}
      />
    )
  },
)
