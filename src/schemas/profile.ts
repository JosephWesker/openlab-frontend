import { z } from "zod"

const socialUrlValidation = (domain: string | string[], message: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true // Permite valores vacíos o nulos

        // Primero, validar que sea una URL bien formada
        if (!z.string().url().safeParse(val).success) {
          return false
        }

        // Luego, verificar el dominio
        try {
          const hostname = new URL(val).hostname
          const domains = Array.isArray(domain) ? domain : [domain]
          return domains.some((d) => hostname.includes(d))
        } catch {
          return false // Si no se puede parsear la URL, es inválida
        }
      },
      { message: `URL no válida. ${message}` },
    )

// Esquema de validación con Zod para el formulario de edición
export const profileEditSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  email: z.string().email("Ingresa un email válido").min(1, "El email es requerido"),
  discord: socialUrlValidation("discord.com", "Debe ser un enlace de Discord."),
  github: socialUrlValidation("github.com", "Debe ser un enlace de GitHub."),
  linkedin: socialUrlValidation("linkedin.com", "Debe ser un enlace de LinkedIn."),
  facebook: socialUrlValidation("facebook.com", "Debe ser un enlace de Facebook."),
  twitter: socialUrlValidation(["twitter.com", "x.com"], "Debe ser un enlace de Twitter/X."),
  instagram: socialUrlValidation("instagram.com", "Debe ser un enlace de Instagram."),
  other: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        return z.string().url().safeParse(val).success
      },
      { message: "Ingresa una URL válida" },
    ),
  description: z.string().trim().max(255, "La descripción debe tener menos de 255 caracteres").optional(),
  roles: z.array(z.enum(["INVESTOR", "LEADER", "COLLABORATOR", "COFOUNDER", "ADMIN"])).optional(),
})

export type ProfileEditFormData = z.infer<typeof profileEditSchema>
