export interface Profile {
  id: string
  roles: string[]
  generalSkills: string[]
  technicalSkills: string[]
  avatar: string
  additionalDescription?: string
  date?: string
  active?: boolean
}