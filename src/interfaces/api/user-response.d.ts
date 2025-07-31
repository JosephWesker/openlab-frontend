import type { RoleEntity } from "../user"

export interface UserResponse {
  id: number
  name: string
  email: string
  profilePic: string
  wallet: string | null
  github: string | null
  linkd: string | null
  discord: string | null
  facebook: string | null
  twitter: string | null
  instagram: string | null
  other: string | null
  conection: string | null
  active: boolean
  skills: SkillResponse[]
  roles?: RoleEntity[]
  initiatives: UserResponseInitiative[]
  votedInitiatives: UserResponseVotedInitiative[]
  description: string | null
  totalComments: number
  totalInitiatives: number
  totalVotes: number
}

interface SkillResponse {
  id: number
  name: string
  type: "GENERAL" | "TECHNIQUES"
}

export interface UserResponseWithActivity {
  user: {
    id: number
    name: string
    email: string
    profilePic: string
    wallet: string | null
    github: string | null
    linkd: string | null
    discord: string | null
    facebook: string | null
    twitter: string | null
    instagram: string | null
    other: string | null
    // skills: SkillResponse[]
    skills: string[]
    description: string | null
  }
  comments: number
  initiatives: number
  votes: number

  participation: Array<{
    id: number
    title: string
    img: string
    state: string
    description: string
    date: string
    roles: string[]
  }>
}

export interface UserResponseInitiative {
  id: number
  title: string
  description: string
  img: string
  date: string
  problemToBeSolved: string
  marketInformation: string
  productFeatures: string
  state: string
}

interface UserResponseVotedInitiative {
  id: number
  title: string
  description: string
  img: string
  date: string
  problemToBeSolved: string
  marketInformation: string
  productFeatures: string
  state: string
}
