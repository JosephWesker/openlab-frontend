import { z } from "zod"

export const approveInitiativeSchema = z.object({
  dework: z
    .string({
      required_error: "El campo es requerido",
    })
    .url("Debe ser una URL válida.")
    .min(1, "La URL no puede estar vacía")
    .refine((val) => !val || val.toLowerCase().includes("dework"), {
      message: "La URL no es un enlace a un proyecto de Dework.",
    }),
  discord: z
    .string({
      required_error: "El campo es requerido",
    })
    .url("Debe ser una URL válida.")
    .min(1, "La URL no puede estar vacía")
    .refine((val) => !val || val.toLowerCase().includes("discord"), {
      message: "La URL no es un enlace a un servidor de Discord.",
    }),
  aragon: z.object({
    address: z
      .string({
        required_error: "El campo es requerido",
      })
      .min(1, "La dirección no puede estar vacía")
      .regex(/^0x[a-fA-F0-9]{40}$/, "Dirección inválida"),
    tokenName: z
      .string({
        required_error: "El campo es requerido",
      })
      .min(1, "El nombre del token no puede estar vacío"),
    tokenSymbol: z
      .string({
        required_error: "El campo es requerido",
      })
      .length(3, "El símbolo del token debe tener exactamente 3 caracteres"),
  }),
})

export type ApproveInitiativeFormData = z.infer<typeof approveInitiativeSchema>
