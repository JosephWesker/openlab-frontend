export interface Comment {
  id: number
  comment: string
  user: {
    id: number
    name: string
    email: string
    profilePic: string
    wallet: string
    github: string
    linkd: string
    discord: string
    facebook: string
    twitter: string
    instagram: string
    other: string
    skills: [
      string
    ],
    description: string
  },
  time: string
}

export interface CommentsResponse {
  content: Comment[]
  last: boolean
}

export interface CommentsInfiniteData {
  pages: CommentsResponse[]
  pageParams: unknown[]
}

export interface CreateCommentRequest {
  comment: string
  initiativeId: string
}

export type CreateCommentResponse = Comment
