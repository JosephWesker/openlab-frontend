import type { Announcement, Collaborator, InitiativeMin } from "../pages/protected/dashboard/initiative/schemas/initiativeSchema"

export function useInitiativeUsers(initiative: InitiativeMin) {
  const collaborators = initiative.collaborators
  const announcements = initiative.announcements
  // console.log('initiative', initiative)
  // console.log('collaborators', collaborators)

  const hasRole = (role: string) =>
    collaborators.some((collaborator: Collaborator) => collaborator.role?.toUpperCase() === role.toUpperCase())

  const getCollaboratorsByRole = (role: string) =>
    collaborators.filter((collaborator: Collaborator) => collaborator.role?.toUpperCase() === role.toUpperCase())

  const getAnnouncements = () =>
    announcements.filter((announcement: Announcement) => announcement.active === true)

  return {
    collaborators,
    hasRole,
    getCollaboratorsByRole,
    getAnnouncements
  }
}