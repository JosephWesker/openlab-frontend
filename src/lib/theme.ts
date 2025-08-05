import { createTheme } from "@mui/material/styles"
import themeJson from "@/theme/material-theme2.json"

// Declaración para extender los tipos de la paleta de MUI
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"]
    secondaryLight: Palette["primary"]
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"]
    secondaryLight?: PaletteOptions["primary"]
  }
}

// Extender los tipos para el componente Button
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true
    secondaryLight: true
  }
}

// Colores personalizados con tonalidades más intensas
const customColors = {
  primary: {
    main: themeJson.coreColors.primary, // #3D7BFF
    dark: "#304578", // Versión más oscura e intensa para hover
    light: themeJson.schemes.light.primaryContainer,
    hover: themeJson.coreColors.primary + "15", // 10% de opacidad
    hoverStrong: "rgba(61, 123, 255, 0.12)", // Para selecciones
    selectedBg: "rgba(61, 123, 255, 0.16)",
    selectedBgHover: "rgba(61, 123, 255, 0.24)",
  },
  // secondary: {
  //   main: themeJson.coreColors.secondary, // #588CFF
  //   hover: "rgba(88, 140, 255, 0.08)",
  // },
  secondary: {
    main: "rgba(88, 94, 113, 1)", // #585e71 (base)
    hover: "rgba(75, 81, 97, 1)", // un poco más oscuro para hover
    light: "rgba(220, 226, 249, 1)", // #dce2f9 (como especificaste)
    dark: "rgba(50, 54, 64, 1)", // más oscuro para contraste
  },
  // tertiary: {
  //   main: themeJson.coreColors.tertiary, // #8C58FF
  //   hover: "rgba(140, 88, 255, 0.08)",
  // },
  tertiary: {
    main: "rgba(110, 74, 108, 1)",
    hover: "rgba(78, 51, 77, 1)",
    light: "rgba(119, 92, 117, 1)",
    dark: "rgba(63, 39, 62, 1)",
  },
  error: {
    main: themeJson.schemes.light.error, // #BA1A1A
    light: themeJson.schemes.light.errorContainer, // #FFDAD6
    dark: "#93000A", // Texto de error más intenso
    border: "#BA1A1A",
  },
  other: {
    main: "oklch(0.4888 0.0595 328.6)", // para el boton logout
  },
}

// Tema basado en los colores base (coreColors) del material-theme.json
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // main: customColors.primary.main,
      main: themeJson.coreColors.primary,
      light: themeJson.schemes.light.primary,
      dark: themeJson.schemes.dark.primary,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: themeJson.coreColors.secondary,
      light: themeJson.schemes.light.secondary,
      dark: themeJson.schemes.dark.secondary,
      // main: customColors.secondary.main,
      // light: customColors.secondary.light,
      // dark: customColors.secondary.dark,
      contrastText: "#FFFFFF",
    },
    secondaryLight: {
      main: customColors.secondary.light,
      light: customColors.secondary.light,
      dark: customColors.secondary.dark,
      contrastText: "#000000",
    },
    tertiary: {
      main: customColors.tertiary.main,
      light: customColors.tertiary.light,
      dark: customColors.tertiary.dark,
      contrastText: "#FFFFFF",
    },
    warning: {
      main: themeJson.coreColors.tertiary,
      light: themeJson.schemes.light.tertiaryContainer,
      dark: themeJson.schemes.light.onTertiary,
      contrastText: "#FFFFFF",
    },
    error: {
      main: customColors.error.main,
      light: customColors.error.light,
      dark: customColors.error.dark,
      contrastText: themeJson.schemes.light.onErrorContainer,
    },
    background: {
      default: themeJson.schemes.light.background,
      paper: themeJson.schemes.light.surface,
    },
    text: {
      primary: themeJson.schemes.light.onSurface,
      secondary: themeJson.schemes.light.onSurfaceVariant,
    },
    action: {
      active: themeJson.schemes.light.onSurface,
      hover: customColors.primary.hover,
      hoverOpacity: 0.2, // Aumentar la opacidad para que sea más visible
      selected: customColors.primary.selectedBg,
      disabled: themeJson.schemes.light.outline,
      disabledBackground: themeJson.schemes.light.surfaceContainerHighest,
    },
  },
  typography: {
    fontFamily: '"Commissioner", sans-serif',
    h4: {
      fontWeight: 700, // Aumentar el peso de los títulos
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500, // Botones con texto más bold
      textTransform: "none", // No transformar el texto a mayúsculas
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: customColors.primary.hover,
          },
          "&.Mui-disabled": {
            backgroundColor: "#e0e0e0",
            color: "#9e9e9e",
          },
        },
        contained: {
          "&.MuiButton-containedPrimary": {
            backgroundColor: customColors.primary.main,
            "&:hover": {
              backgroundColor: customColors.primary.dark,
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          },
          "&.MuiButton-containedTertiary": {
            backgroundColor: customColors.tertiary.main,
            "&:hover": {
              backgroundColor: customColors.tertiary.hover,
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          },
          "&.MuiButton-containedSecondaryLight": {
            backgroundColor: customColors.secondary.light,
            color: customColors.secondary.main,
            "&:hover": {
              backgroundColor: customColors.secondary.hover,
              color: customColors.secondary.light,
            },
            "&.Mui-disabled": {
              backgroundColor: "#e0e0e0",
              color: "#9e9e9e",
            },
          },
        },
        text: {
          "&.MuiButton-textPrimary": {
            fontWeight: 500,
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "warning" },
          style: {
            color: themeJson.schemes.light.onTertiary,
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.MuiIconButton-colorPrimary": {
            color: customColors.primary.main,
            "&:hover": {
              backgroundColor: customColors.primary.hover,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-colorPrimary": {
            backgroundColor: customColors.primary.main,
            color: "white",
            fontWeight: 500,
            "& .MuiChip-deleteIcon": {
              color: "white",
              "&:hover": {
                color: "#DAE2FF",
              },
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          "&.MuiAlert-standardError": {
            backgroundColor: customColors.error.light,
            color: customColors.error.dark,
            fontWeight: 500,
            "& .MuiAlert-icon": {
              color: customColors.error.main,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: customColors.primary.main,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: customColors.primary.selectedBg,
            "&:hover": {
              backgroundColor: customColors.primary.selectedBgHover,
            },
          },
          "&:hover": {
            backgroundColor: customColors.secondary.hover,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: customColors.secondary.main,
          "&.Mui-checked": {
            color: customColors.primary.main,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            "& .MuiInputLabel-root": {
              color: customColors.error.border,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: customColors.error.border,
              },
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: customColors.error.border,
              },
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${themeJson.schemes.light.outline}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
    },
  },
})
