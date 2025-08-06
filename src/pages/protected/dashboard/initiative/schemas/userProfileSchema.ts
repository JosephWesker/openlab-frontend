import { z } from 'zod'

// export const userProfileRequestDTO = z.object({
//   // user: z.object({
//     id: z.number(),
//     name: z.string().nullable(),
//     email: z.string(),
//     profilePic: z.string().nullable(),
//     wallet: z.string().nullable(),
//     github: z.string(),
//     linkd: z.string().nullable(),
//     discord: z.string(),
//     facebook: z.string(),
//     twitter: z.string().nullable(),
//     instagram: z.string(),
//     other: z.string().nullable(),
//     skills: z.array(z.string()),
//     description: z.string()
//   // }),
//   // comments: z.number(),
//   // initiatives: z.number(),
//   // votes: z.number()
// })

export const userProfileResponseDTO = z.object({
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
    description: z.string(),
    skills: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.string()
      })
    ),
    initiatives: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        img: z.string(),
        date: z.string(),
        problemToBeSolved: z.string(),
        marketInformation: z.string(),
        productFeatures: z.string(),
        state: z.string()
      })
    ),
    votedInitiatives: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        img: z.string(),
        date: z.string(),
        problemToBeSolved: z.string(),
        marketInformation: z.string(),
        productFeatures: z.string(),
        state: z.string()
      })
    ),
    roles: z.array(z.string()),
    totalComments: z.number(),
    totalInitiatives: z.number(),
    totalVotes: z.number()
    // description: z.string()
  // }),
  // comments: z.number(),
  // initiatives: z.number(),
  // votes: z.number()
})

// export const UpdateUserRequestDTO = updateUserRequestDTO
// export type UpdateUserRequestDTO = z.infer<typeof updateUserRequestDTO>

export const UserProfileResponseDTO = userProfileResponseDTO
export type UserProfileResponseDTO = z.infer<typeof userProfileResponseDTO>
