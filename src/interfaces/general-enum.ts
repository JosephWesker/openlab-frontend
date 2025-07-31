export enum RoadmapStatus {
  PENDING = "Pendiente",
  IN_REVIEW = "En Revisión",
  IN_PROGRESS = "En Progreso",
  COMPLETED = "Finalizada",
  CANCELLED = "Cancelada",
}

export enum UserRole {
  COLLABORATOR = "COLLABORATOR",
  INVESTOR = "INVESTOR",
  COFOUNDER = "COFOUNDER",
  LEADER = "LEADER",
  ADMIN = "ADMIN",
}

export enum InitiativeState {
  ALL = "all",
  PROPOSAL = "proposal",
  INPROCESS = "inprocess",
  APPROVED = "approved",
  DISABLED = "disabled",
  DRAFT = "draft"
}

export enum InitiativeStateNames {
  ALL = "Todas",
  PROPOSAL = "Propuesta",
  INPROCESS = "En proceso",
  APPROVED = "Aprobada",
  DISABLED = "Desactivada",
  DRAFT = "Borrador"
}

export enum InitiativeTabs {
  SUMMARY = "summary",
  ROADMAP = "roadmap",
  UPDATES = "updates",
  TREASURY = "treasury",
  COMMENTS = "comments"
}

export enum SocialMedia {
  LINKEDIN = "linkedin",
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  WEBSITE = "website",
  TWITTER = "twitter"
}

export enum GovernanceLinks {
  DEWORK = "Dework",
  DISCORD = "Discord",
  ARAGON = "Aragon",
  DTO_CREATE_TOKEN = "Token",
  GITHUB_BACK = "GitHubBack",
  GITHUB_FRONT = "GitHubFront"
}