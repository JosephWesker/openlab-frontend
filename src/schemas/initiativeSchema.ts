import { RoadmapStatus } from "@/interfaces/general-enum"
import { z } from "zod"

// Schema para el paso 1: La Idea
export const step1Schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  motto: z
    .string()
    .trim()
    .min(5, "El lema debe tener al menos 5 caracteres")
    .max(200, "El lema no puede exceder 200 caracteres"),
  mainImage: z.string().url("URL de imagen inválida"),
  images: z.array(z.string().url("URL de imagen inválida")),
})

// Schema para el paso 2: Profundizando en la Visión
export const step2Schema = z.object({
  tags: z.array(z.string().trim()).min(1, "Selecciona al menos una etiqueta").max(9, "Máximo 9 etiquetas"),
  detailedDescription: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres"),
  problemSolved: z.string().trim().min(10, "La descripción del problema debe tener al menos 10 caracteres"),
  objectives: z
    .array(
      z.object({
        id: z.string().trim(),
        description: z.string().trim(),
      }),
    )
    .min(1, "Agrega al menos un objetivo")
    .max(10, "Máximo 10 objetivos"),
  marketInfo: z.string().trim().min(10, "Información del mercado debe tener al menos 10 caracteres"),
  productCharacteristics: z
    .string()
    .trim()
    .min(10, "Las características del producto deben tener al menos 10 caracteres"),
})

// Schema para el paso 3: Equipo
export const step3Schema = z.object({
  // Emails de cofundadores
  coFounderEmails: z.array(z.string().trim().email("Email inválido")).optional(),

  // Perfiles que estás buscando
  seekingProfiles: z
    .array(
      z.object({
        id: z.string().trim(),
        // roles: z.array(z.string().trim()).min(1, "Selecciona al menos un rol"),
        roles: z.array(z.string().trim()).min(1, "Selecciona al menos un rol"),
        generalSkills: z.array(z.string().trim()).min(1, "Selecciona al menos una habilidad general"),
        technicalSkills: z.array(z.string().trim()).min(1, "Selecciona al menos una habilidad técnica"),
        avatar: z.string().trim().url("URL de avatar inválida"),
        date: z.string().trim().optional(),
        active: z.boolean().optional(),
        additionalDescription: z
          .string({
            required_error: "La descripción adicional es requerida",
            invalid_type_error: "La descripción adicional debe ser una cadena de texto",
            message: "La descripción adicional es requerida",
          })
          .trim()
          .optional(),
      }),
    )
    .min(1, "Agrega al menos un perfil Colaborador")
    .max(20, "Máximo 20 perfiles")
    .refine((arr) => arr.some((item: { roles: string[] }) => item.roles.includes("COLLABORATOR")), "El rol Colaborador es obligatorio"),

  collaborators: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().trim(),
        email: z.string().trim(),
        role: z.enum(["COFOUNDER", "COLLABORATOR"]),
        profilePic: z.string().trim(),
      }),
    )
    .optional(),
})

// Helper function para validar URLs opcionales
const optionalUrl = (allowedDomains: string[] = []) =>
  z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        // Si está vacío o es undefined, es válido (opcional)
        if (!val || val.trim() === "") return true

        let url
        // Si tiene contenido, debe ser una URL válida
        try {
          url = new URL(val)
        } catch {
          return false
        }

        // Si no se especifican dominios, cualquier URL válida es correcta
        if (allowedDomains.length === 0) return true

        // Validar dominio
        const hostname = url.hostname.replace(/^www\./, "")
        return allowedDomains.some((domain) => hostname.includes(domain))
      },
      {
        message:
          allowedDomains.length > 0
            ? `Debe ser una URL de ${allowedDomains.join(" o ")} o dejarlo vacío`
            : "Debe ser una URL válida o dejarlo vacío",
      },
    )

// Schema para el paso 4: Herramientas Externas - COMPLETAMENTE OPCIONAL
export const step4Schema = z.object({
  socialNetworks: z.object({
    linkedin: optionalUrl(["linkedin.com"]),
    facebook: optionalUrl(["facebook.com"]),
    instagram: optionalUrl(["instagram.com"]),
    website: optionalUrl(),
    twitter: optionalUrl(["twitter.com", "x.com"]),
  }),
  externalLinks: z.object({
    discord: optionalUrl(),
    github: optionalUrl(),
    dework: optionalUrl(),
    aragon: optionalUrl(),
    // figma: optionalUrl(),
  }),
})

// Schema para el paso 5: Actualizaciones y Roadmap
export const step5Schema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().trim(),
        title: z.string().trim(),
        description: z.string().trim(),
        createdAt: z.date(),
      }),
    )
    .optional(),
  roadmapPhases: z
    .array(
      z.object({
        id: z.string().trim(),
        phase: z.string().trim(),
        title: z.string().trim(),
        description: z.string().trim(),
        status: z.nativeEnum(RoadmapStatus),
      }),
    )
    .optional(),
})

// Schema para el paso 6: Revisión Final (solo visualización)
export const step6Schema = z.object({
  // El paso 6 es solo para visualización, no tiene campos requeridos
})

// Schema completo
export const initiativeSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)

export type InitiativeFormData = z.infer<typeof initiativeSchema>
export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>
export type Step6Data = z.infer<typeof step6Schema>
