import { z } from 'zod'

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  profilePic: z.string().optional()
})

const collaborator = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  profilePic: z.string()
})

const need = z.object({
  role: z.string(), // ToDo: add role type instead string
  gSkills: z.string(),
  hardSkills: z.array(z.string())
})

const roadmap = z.object({
  phaseNumber: z.string().optional(),
  phaseName: z.string(),
  description: z.string(),
  status: z.string()
})

const update = z.object({
  name: z.string(),
  description: z.string()
})

const externalLinks = z.object({
  dework: z.string().nullable(),
  discord: z.string().nullable(),
  aragon: z.string().nullable().optional(),
  githubBack: z.string().nullable().optional(),
  githubFront: z.string().nullable().optional(),
  dtoCreateToken: z.string().nullable().optional(),
  otros: z.array(
    z.object({
      id: z.number(),
      nombre: z.string(),
      url: z.string(),
      img: z.string()
    })
  )
})

const announcement = z.object({
  id: z.number(),
  description: z.string(),
  createdDate: z.string(),
  active: z.boolean(),
  gSkill: z.string(),
  hardSkills: z.array(z.string())
})

const initiativeMin = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  img: z.string(),
  date: z.string(),
  user: userSchema,
  problemToBeSolved: z.string(),
  marketInformation: z.string(),
  productFeatures: z.string(),
  state: z.string(), // ToDo: add state type instead string
  objectives: z.array(z.string()),
  externalLinks: externalLinks,
  motto: z.string().nullable(),
  tags: z.array(z.string()),
  multimedia: z.array(z.string()),
  roadmap: z.array(roadmap),
  update: z.array(update),
  needs: z.array(need),
  collaborators: z.array(collaborator),
  votesAgainst: z.number(),
  votesInFavor: z.number(),
  announcements: z.array(announcement)
})

const initiative = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  img: z.string(),
  date: z.string(),
  user: userSchema,
  problemToBeSolved: z.string(),
  marketInformation: z.string(),
  productFeatures: z.string(),
  state: z.string(), // ToDo: from backend add state type instead string
  objectives: z.array(z.string()),
  externalLinks: externalLinks,
  motto: z.string().nullable(),
  tags: z.array(z.string()),
  multimedia: z.array(z.string()),
  roadmap: z.array(roadmap),
  update: z.array(update),
  needs: z.array(need),
  collaborators: z.array(collaborator),
  votesAgainst: z.number(),
  votesInFavor: z.number(),
  announcements: z.array(announcement)
})

const initiativeFull = z.object({
  coFounderAnnouncementId: z.number().nullable(),
  appliedCollaborator: z.boolean(),
  initiative: initiative
})

// const sort = z.object({
//   empty: z.boolean(),
//   sorted: z.boolean(),
//   unsorted: z.boolean()
// })

const pageable = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  sort: z.object({
    empty: z.boolean(),
    sorted: z.boolean(),
    unsorted: z.boolean()
  }),
  offset: z.number(),
  paged: z.boolean(),
  unpaged: z.boolean()
})

export const initiativePaged = z.object({
  content: z.array(initiativeMin),
  pageable: pageable,
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
  size: z.number(),
  number: z.number(),
  sort: z.object({
    empty: z.boolean(),
    sorted: z.boolean(),
    unsorted: z.boolean()
  }),
  numberOfElements: z.number(),
  first: z.boolean(),
  empty: z.boolean()
})

// Vote endpoint
export const voteRequestDTO = z.object({
  initiativeId: z.number(),
  inFavor: z.boolean(),
})

export const voteResponseDTO = z.array( // ToDo: unnecesary array
  z.object({
    votesInFavor: z.number(),
    votesAgainst: z.number(),
  })
)

// Profile Endpoing
export const userResponseDTO = z.object({
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    profilePic: z.string(),
    wallet: z.string(),
    github: z.string(),
    linkd: z.string(),
    discord: z.string(),
    facebook: z.string(),
    twitter: z.string(),
    instagram: z.string(),
    other: z.string(),
    skills: z.array(z.string()),
    description: z.string()
  }),
  comments: z.number(),
  initiatives: z.number(),
  votes: z.number()
})

// Initiative apply
export const initiativeApplyRequestDTO = z.object({
  initiativeId: z.number(),
  role: z.string(),
})

// Initiative apply cofounding
export const initiativeApplyCofoundingRequestDTO = z.object({
  announcementId: z.number(),
  description: z.string(),
  gSkills: z.string(),
  hardSkills: z.array(z.string()),
})

// Initiative applications
export const applicationsResponseDTO = z.array(
  z.object({
    id: z.number(),
    userId: z.number(),
    userName: z.string(),
    image: z.string(),
    email: z.string(),
    description: z.string(),
    gSkills: z.string(),
    hardSkills: z.array(z.string()),
    applicationDate: z.string(),
    status: z.string(),
    initiativeId: z.number(),
    initiativeImg: z.string(),
    title: z.string(),
  })
)

export const InitiativePaged = initiativePaged
export const Initiative = initiative
export const InitiativeFull = initiativeFull
export const InitiativeMin = initiativeMin
export type InitiativePaged = z.infer<typeof initiativePaged>
export type Initiative = z.infer<typeof initiative>
export type InitiativeFull = z.infer<typeof initiativeFull>
export type InitiativeMin = z.infer<typeof initiativeMin>
export type Roadmap = z.infer<typeof roadmap>
export type Update = z.infer<typeof update>
export type Collaborator = z.infer<typeof collaborator>
export type Announcement = z.infer<typeof announcement>

export const VoteResponseDTO = voteResponseDTO
export type VoteRequestDTO = z.infer<typeof voteRequestDTO>
export type VoteResponseDTO = z.infer<typeof voteResponseDTO>

export const UserResponseDTO = userResponseDTO
export type UserResponseDTO = z.infer<typeof userResponseDTO>

export type InitiativeApplyRequestDTO = z.infer<typeof initiativeApplyRequestDTO>

export type InitiativeApplyCofoundingRequestDTO = z.infer<typeof initiativeApplyCofoundingRequestDTO>

export const ApplicationsResponseDTO = applicationsResponseDTO
export type ApplicationsResponseDTO = z.infer<typeof applicationsResponseDTO>