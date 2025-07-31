// ToDo: collarating members preferably must be obtained from api response

import type { Initiative } from "../../../schemas/initiativeSchema"

interface Collaborator {
  email: string
  initiativeId: number
}

export function useIsUserCollaborator(initiative: Initiative, userEmail?: string): boolean {
  if (!userEmail) return false

  const stored = localStorage.getItem('user_collaborating')
  let isCollaborator = false

  if (stored) {
    const storedUser = JSON.parse(stored)
    const found = storedUser.find((collaborator: Collaborator) =>
      collaborator.email === userEmail && collaborator.initiativeId === initiative.id
    )
    if (found) isCollaborator = true
  }

  if (!isCollaborator) {
    const foundInInitiative = initiative.collaborators.find((collaborator) =>
      collaborator.email === userEmail
    )
    if (foundInInitiative) isCollaborator = true
  }

  return isCollaborator
}
