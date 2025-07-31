import type { UserResponseInitiative, UserResponseVotedInitiative } from "./api/user-response"

export interface UserEntity {
  id: number
  name: string
  email: string
  image: string
  wallet: string | null
  description: string | null
  social: {
    github: string | null
    linkedIn: string | null
    discord: string | null
    facebook: string | null
    twitter: string | null
    instagram: string | null
    other: string | null
  }
  conection: string | null
  active: boolean
  token: string
  roles?: RoleEntity[]
  skills: {
    general: string[]
    technical: string[]
  }
  initiatives: UserResponseInitiative[]
  totalVotes: number
  totalInitiatives: number
  totalComments: number
  votedInitiatives: UserResponseVotedInitiative[]
}

export type RoleEntity = "INVESTOR" | "COFOUNDER" | "LEADER" | "COLLABORATOR" | "ADMIN"

export interface UserEntityWithActivity {
  id: number
  name: string
  email: string
  image: string
  wallet: string | null
  description: string | null
  social: {
    github: string | null
    linkedIn: string | null
    discord: string | null
    facebook: string | null
    twitter: string | null
    instagram: string | null
    other: string | null
  }
  // skills: {
  //   general: string[]
  //   technical: string[]
  // }
  skills: string[]
  initiatives: number
  votes: number
  comments: number

  /** Participación en iniciativas */
  participation?: Array<{
    id: number
    title: string
    img: string
    state: string
    description: string
    date: string
    roles: string[]
  }>
}
