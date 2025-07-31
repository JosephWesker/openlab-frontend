export interface Initiative {
  id: number
  title: string
  description: string
  img: string
  date: string
  user: {
    id: number
    name: string
    email: string
    profilePic: string
  }
  problemToBeSolved: string
  marketInformation: string
  productFeatures: string
  state: "draft" | "proposal" | "inprocess" | "approved" | "disable"
  objectives: string[]
  externalLinks: {
    aragon: string | null
    dework: string | null
    discord: string | null
    dtoCreateToken: string | null
    githubBack: string | null
    githubFront: string | null
    otros: {
      nombre: "facebook" | "instagram" | "twitter" | "linkedin" | "twitter" | "website"
      url: string
      img: string
    }[]
  }
  motto: string
  tags: string[]
  multimedia: string[]
  roadmap: Array<{
    phaseNumber: string
    phaseName: string
    description: string
    status: string
  }>
  update: Array<{
    name: string
    description: string
  }>
  needs: Array<{
    id: number
    role: string
    gSkills: string
    hardSkills: string[]
  }>
  votes: number
  votesInFavor: number
  votesAgainst: number
  announcements?: Array<{
    id: number
    description: string
    createdDate: string
    active: boolean
    gSkill: string
    hardSkills: string[]
  }>
  collaborators: Array<{
    id: number
    name: string
    email: string
    role: "COFOUNDER" | "COLLABORATOR"
    profilePic: string
  }>
}

export type Collaborator = Initiative["collaborators"][number]

export type InitiativeAdminView = Pick<
  Initiative,
  "id" | "title" | "img" | "user" | "state" | "motto" | "collaborators" | "votesInFavor" | "votesAgainst" | "externalLinks" | "date"
>
