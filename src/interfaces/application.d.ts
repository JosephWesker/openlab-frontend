export interface Application {
  id: number
  userId: number
  userName: string
  description: string
  gSkills: string
  hardSkills: string[]
  applicationDate: string
  status: "pending" | "accepted" | "rejected"
}
