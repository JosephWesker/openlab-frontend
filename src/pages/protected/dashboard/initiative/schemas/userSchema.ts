import { z } from 'zod'

export const updateUserRequestDTO = z.object({
  // user: z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    profilePic: z.string().nullable(),
    wallet: z.string().nullable(),
    github: z.string(),
    linkd: z.string().nullable(),
    discord: z.string(),
    facebook: z.string(),
    twitter: z.string().nullable(),
    instagram: z.string(),
    other: z.string().nullable(),
    skills: z.array(z.string()),
    description: z.string()
  // }),
  // comments: z.number(),
  // initiatives: z.number(),
  // votes: z.number()
})

export const updateUserResponseDTO = z.object({
  // user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    profilePic: z.string(),
    wallet: z.string().nullable(),
    github: z.string(),
    linkd: z.string(),
    discord: z.string(),
    facebook: z.string(),
    twitter: z.string(),
    instagram: z.string(),
    other: z.string(),
    conection: z.string().nullable(),
    active: z.boolean(),
    description: z.string()
    // skills: z.array(z.string()),
    // description: z.string()
  // }),
  // comments: z.number(),
  // initiatives: z.number(),
  // votes: z.number()
})

export const UpdateUserRequestDTO = updateUserRequestDTO
export type UpdateUserRequestDTO = z.infer<typeof updateUserRequestDTO>

export const UpdateUserResponseDTO = updateUserResponseDTO
export type UpdateUserResponseDTO = z.infer<typeof updateUserResponseDTO>
