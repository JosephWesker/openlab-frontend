import { type SnackbarMessage } from "@/interfaces/general.d"
import type { RoleEntity } from "@/interfaces/user"

// variables de entorno
export const API_URL = import.meta.env.VITE_API_URL
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const CLARITY_ID = import.meta.env.VITE_CLARITY_ID

// otras constantes
export const CLOUDINARY_UPLOAD_PRESET = "ml_default"

// mensajes de snackbar
export const SNACKBAR_MESSAGE = {
  SESSION_EXPIRED: {
    title: "Sesión expirada",
    message: "La sesión ha expirado, por favor inicie sesión nuevamente",
    severity: "warning",
  },
  USER_AUTHENTICATED: {
    title: "Usuario autenticado",
    message: "Usuario autenticado correctamente",
    severity: "success",
  },
  USER_UPDATED: {
    title: "Perfil actualizado",
    message: "Perfil actualizado correctamente",
    severity: "success",
  },
  USER_UPDATED_ERROR: {
    title: "Error al actualizar el perfil",
    message: "Error al actualizar el perfil",
    severity: "error",
  },
  GET_PROFILE_ERROR: {
    title: "Error al obtener el perfil",
    message: "Error al obtener el perfil",
    severity: "error",
  },
  AUTH_ERROR: {
    title: "Error en Auth0",
    message: "Error en Auth0",
    severity: "error",
  },
  AUTH_NOT_AUTHENTICATED: {
    title: "Usuario no autenticado",
    message: "Usuario no autenticado",
    severity: "warning",
  },
  NOTIFICATION_COLLABORATOR_ERROR: {
    title: "Error al obtener la iniciativa desde la respuesta de la API get initiative",
    message: "No se pudo redirigir a la iniciativa",
    severity: "error",
  },
  NOTIFICATION_COLLABORATOR_REDIRECT_WARNING: {
    title: "Error al obtener la iniciativa desde la respuesta de la API get initiative",
    message: "No se pudo redirigir a la iniciativa",
    severity: "warning",
  },
} as const satisfies Readonly<{
  [key: string]: SnackbarMessage
}>

// paths de la api
export const API_PATH = {
  USER: "/users",
  USERS: "/users",
  USER_SKILL: "/users/skill",
  USER_NOTIFICATION: "/users/notifications",
  SKILLS_GENERAL: "/users/skill/GENERAL",
  SKILLS_TECHNICAL: "/users/skill/TECHNIQUES",
  ROLE_UPDATE: "/users/update-role",
  INITIATIVE: "/initiative",
  INITIATIVE_TITLE: "/initiative/title",
  INITIATIVE_APPLY: "/initiative/apply",
  INITIATIVE_APPLY_NOTICE: "/initiative/apply-notice",
  INITIATIVE_COMMENTS: "/initiative/chat",
  INITIATIVE_VOTE: "/initiative/vote",
  INITIATIVE_LIST: "/initiative/list",
  INITIATIVE_HOME: "/initiative/home",
  INITIATIVE_SEARCH: "/initiative/search",
  INITIATIVE_USER: "/initiative/my-initiatives",
  INITIATIVE_IN_PROCESS_USER: "/initiative/inprocess",
  INITIATIVE_APPROVED_USER: "/initiative/approved",
  INITIATIVE_TO_APPROVE: "/initiative/approve",
  INITIATIVE_NOTIFICATION: "/message",
  INITIATIVE_DRAFT_TO_PUBLISHED: "/initiative/publish",
  INVITATION_COFOUNDER_EMAIL: "/initiative/invite",
  INITIATIVE_CREATE_NOTICE: "/initiative/create-notice",
  INITIATIVE_APPLICATIONS: "/initiative/applications",
  ACCEPT_APPLICATION: "/initiative/accept-application",
  INITIATIVE_ADMIN: "/initiative/admin/all",
  DELETE_ANNOUNCEMENT_COFOUNDER: "/initiative/announcement",
  DELETE_APPLICATION: "/initiative/applications",
  DELETE_COLLABORATOR: (id: string) => `/initiative/needs/${id}`,
  INITIATIVE_USER_COFOUNDER: "/initiative/my-cofoundings",
}

// roles de usuario
export const ROLES = ["INVESTOR", "LEADER", "COLLABORATOR"] as const satisfies Readonly<RoleEntity[]>

export const ROLES_LABEL = {
  INVESTOR: "Inversor",
  LEADER: "Líder",
  COLLABORATOR: "Colaborador",
  COFOUNDER: "Cofundador",
} as Readonly<{
  [key in RoleEntity]: string
}>

// fallback images
export const INITIATIVE_FALLBACK_IMAGE =
  "https://res.cloudinary.com/dc3jgamlj/image/upload/v1753233249/initiative_fallback_trb6pq.webp"

// avatar email
export const AVATAR_USER_NOT_IMAGE =
  "https://res.cloudinary.com/dc3jgamlj/image/upload/v1752635335/Avatar-default_jlkm9j.png"

// avatar profile postulation
export const AVATAR_PROFILE_POSTULATION =
  "https://media.istockphoto.com/id/2042526830/photo/successful-businesswoman-using-laptop-working-in-office-business-technology-corporate-concept.jpg?s=1024x1024&w=is&k=20&c=J0E4zF6xZCAaqSbSC3oK76pogD3XekWpW0Rl4OJUonE="

// enlace de google forms:
export const GOOGLE_FORMS_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSceRWUdIpy8nnksOLEmBVHybEinYaprCJ1dEgAuYHtnAhHcdA/viewform?usp=dialog"

// enlace de aragon
export const ARAGON_LINK = (hash: string) => `https://app.aragon.org/dao/polygon-mainnet/${hash}/dashboard`
export const TOKEN_LINK = (hash: string) => `https://polygonscan.com/token/${hash}`

// numero de whatsapp
export const WHATSAPP_NUMBER = "+522296847384"
export const WHATSAPP_MESSAGE = "Hola! Estoy en OpenLab y me gustaría obtener más información."
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

// ================= HEADER CONSTANTS =================
export const HEADER_ACTIONS = [
  {
    text: "Guía rápida",
    icon: "StarsRounded",
    path: "/quick-guide",
    isExternal: false,
  },
  {
    text: "Tu opinión",
    icon: "MoodRounded",
    path: GOOGLE_FORMS_LINK,
    isExternal: true,
  },
  {
    text: "Soporte",
    icon: "Whatsapp",
    path: WHATSAPP_URL,
    isExternal: true,
  },
] as const

export const BREADCRUMB_STRUCTURE = {
  add: {
    title: "Proponer iniciativa",
  },
  list: {
    title: "Mis iniciativas",
  },
  settings: {
    title: "Configuración",
  },
  profile: {
    title: "Perfil",
    subpaths: {
      edit: {
        title: "Editar",
      },
      community: {
        title: "Comunidad",
      },
    },
  },
  admin: {
    title: "Panel administrador",
  },
  update: {
    title: "Editar iniciativa",
  },
  initiative: {
    title: "Iniciativa",
  },
  "quick-guide": {
    title: "Guía rápida",
  },
} as const

//========================= NOTIFICATIONS ================================
// Emojis para cada tipo
export const KIND_EMOJI: Record<NotificationKind, string> = {
  isNotificationUpdate: "📰",
  isNotificationRoadmap: "🗺️",
  isNotificationMessage: "💬",
  isNotificationColaborator: "✉️",
  INPROCESS: "✨",
  APROVED: "🚀",
  isNotificationCofunder: "👍",
}

export const RANDOM_KINDS: NotificationKind[] = Object.keys(KIND_EMOJI) as NotificationKind[]

export type NotificationKind =
  | "INPROCESS"
  | "APROVED"
  | "isNotificationUpdate"
  | "isNotificationRoadmap"
  | "isNotificationMessage"
  | "isNotificationCofunder"
  | "isNotificationColaborator"

export const NOTIFICATION_KINDS = {
  isNotificationColaborator: "Nueva Postulación Recibida",
  isNotificationMessage: "Nuevo Comentario",
  isNotificationUpdate: "Actualizacion de Iniciativa",
  isNotificationRoadmap: "Actualizacion de Roadmap de Iniciativa",
} as const satisfies Partial<Record<NotificationKind, string>>

export const PREDEFINED_TAGS = [
  "Tecnología",
  "Sostenibilidad",
  "Educación",
  "Salud",
  "Fintech",
  "E-commerce",
  "IA",
  "Blockchain",
  "IoT",
  "Realidad Virtual",
  "Medio Ambiente",
  "Social",
  "Innovación",
  "Startups",
  "Emprendimiento",
]