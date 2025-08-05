import Clarity from "@microsoft/clarity"

/**
 * Función para registrar un evento personalizado en Clarity.
 *
 * @param eventName - Nombre del evento que se registrará (ej. "user_signup", "page_view").
 * @param data - Datos relacionados con el evento. Este objeto puede incluir cualquier información relevante para el evento.
 */
export const logEvent = (eventName: string) => {
  if (process.env.NODE_ENV === "production") {
    Clarity.event(eventName)
    console.log(`Evento registrado: ${eventName}`)
  }
}

/**
 * Función para establecer una etiqueta personalizada en Clarity.
 * Las etiquetas personalizadas permiten segmentar y filtrar los datos en el panel de Clarity.
 *
 * @param key - Clave de la etiqueta personalizada (ej. "user_role", "plan_type").
 * @param value - Valor asociado a la clave (ej. "admin", "premium").
 */
export const setTag = (key: string, value: string | string[]) => {
  if (process.env.NODE_ENV === "production") {
    Clarity.setTag(key, value)
    console.log(`Etiqueta personalizada establecida: ${key} = ${Array.isArray(value) ? value.join(", ") : value}`)
  }
}

// --- 1. ENGAGEMENT EVENTS ---
// Estos eventos están relacionados con la interacción directa del usuario con el contenido.

export const engagementEvents = {
  /**
   * Registra cuando un usuario envía un comentario en una iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId.
   * @param params.initiativeId - ID de la iniciativa comentada.
   */
  commentSubmitted: ({ initiativeId, title }: { initiativeId: string; title: string }) => {
    logEvent("comment_submitted")
    setTag("comment_submitted", [initiativeId, title]) // Etiqueta personalizada para segmentación
  },

  // /**
  //  * Registra cuando un usuario comparte una iniciativa.
  //  *
  //  * @param params - Parámetros del evento, incluyendo initiativeId.
  //  * @param params.initiativeId - ID de la iniciativa compartida.
  //  */
  // shareInitiative: ({ initiativeId }: { initiativeId: string }) => {
  //   logEvent("share_initiative")
  //   setTag("share_initiative", initiativeId) // Etiqueta personalizada para segmentación
  // },

  // /**
  //  * Registra la duración de la sesión del usuario.
  //  *
  //  * @param params - Parámetros del evento, incluyendo duration.
  //  * @param params.duration - Duración de la sesión en segundos.
  //  */
  // sessionDuration: ({ duration }: { duration: number }) => {
  //   logEvent("session_duration")
  //   setTag("sessionDuration", duration.toString()) // Etiqueta personalizada para segmentación
  // },

  // /**
  //  * Registra cuando un usuario envía feedback.
  //  *
  //  * @param params - Parámetros del evento, incluyendo feedbackType y feedback.
  //  * @param params.feedbackType - Tipo de feedback enviado.
  //  * @param params.feedback - Contenido del feedback proporcionado.
  //  */
  // feedbackSubmitted: ({ feedbackType, feedback }: { feedbackType: string; feedback: string }) => {
  //   logEvent("feedback_submitted")
  //   setTag("feedback_submitted", [feedbackType, feedback]) // Etiqueta personalizada para segmentación
  // },

  /**
   * Registra cuando un usuario emite un voto.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId.
   * @param params.initiativeId - ID de la iniciativa votada.
   * @param params.title - Título de la iniciativa votada.
   * @param params.inFavor - Indica si el voto es a favor (true) o en contra (false).
   */
  voteCast: ({ initiativeId, title, inFavor }: { initiativeId: string; title: string; inFavor: boolean }) => {
    logEvent("vote_cast")
    setTag("vote_cast", [initiativeId, title, inFavor ? "a favor" : "en contra"]) // Etiqueta personalizada para segmentación
  },

  /**
   * Registra cuando un usuario envía una postulación a una iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo userId e initiativeId.
   * @param params.userId - ID del usuario que envía la postulación.
   * @param params.initiativeId - ID de la iniciativa a la que se postula.
   */
  postulationSubmitted: ({ initiativeId, title, role }: { initiativeId: string; title: string; role: string }) => {
    logEvent("postulation_submitted")
    setTag("postulation_submitted", [initiativeId, title, role]) // Etiqueta personalizada para segmentación
  },

  /**
   * Registra cuando se publican actualizaciones en una iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId y updateDetails.
   * @param params.initiativeId - ID de la iniciativa actualizada.
   * @param params.title - Titulo de la iniciativa actualizada.
   */
  updatePublished: ({ initiativeId, title }: { initiativeId: string; title: string }) => {
    logEvent("update_published")
    setTag("update_published", [initiativeId, title]) // Etiqueta personalizada para segmentación
  },
}

// --- 2. CONTENT EVENTS ---
// Estos eventos están relacionados con la interacción del usuario con el contenido específico.

export const contentEvents = {
  /**
   * Registra cuando un usuario propone una nueva iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId.
   * @param params.initiativeId - ID de la iniciativa propuesta.
   */
  initiativeProposed: ({ initiativeId, title }: { initiativeId: string; title: string }) => {
    logEvent("proposal_submitted")
    setTag("proposal_submitted", [initiativeId, title]) // Etiqueta personalizada para segmentación

    logEvent("initiative_creation_duration")
    setTag("initiative_creation_duration", [initiativeId, title]) //
  },

  /**
   * Registra cuando un usuario visualiza una iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId.
   * @param params.initiativeId - ID de la iniciativa vista.
   */
  initiativeViewed: ({ initiativeId, title }: { initiativeId: string; title: string }) => {
    console.log("initiaative_viewsesd", initiativeId, title)
    logEvent("initiative_view")
    setTag("initiative_view", [initiativeId, title]) // Etiqueta personalizada para segmentación
  },

  /**
   * Registra cuando un usuario visualiza la pantalla de inicio.
   */
  viewInitiativesHome: () => {
    logEvent("screen_view")
    setTag("screen_view", "home")
  },

  /**
   * Registra cuando un usuario activa una iniciativa.
   *
   * @param params - Parámetros del evento, incluyendo initiativeId.
   * @param params.initiativeId - ID de la iniciativa activada.
   * @param params.title - Título de la iniciativa activada.
   */
  initiativeActivatedAdmin: ({ initiativeId, title }: { initiativeId: string; title: string }) => {
    logEvent("initiative_activated_admin")
    setTag("initiative_activated_admin", [initiativeId, title]) // Etiqueta personalizada para segmentación
  },

  /**
   * Lista de iniciativas publicadas aprobadas.
   */
  initiativePublishedActive: () => {
    logEvent("initiative_published")
    setTag("initiative_published", "Active") // Etiqueta personalizada para segmentación
  },
}

// --- 3. COMMUNITY EVENTS ---
// Estos eventos están relacionados con la interacción del usuario con la comunidad.
export const communityEvents = {
  // /**
  //  * Registra cuando un usuario se registra en la plataforma.
  //  *
  //  * @param params - Parámetros del evento, incluyendo userId.
  //  * @param params.userId - ID del usuario registrado.
  //  */
  // signUp: ({ userId }: { userId: string }) => {
  //   logEvent("sign_up")
  //   setTag("userId", userId) // Etiqueta personalizada para segmentación
  // },

  // /**
  //  * Registra cuando un usuario inicia sesión en la plataforma.
  //  *
  //  * @param params - Parámetros del evento, incluyendo userId.
  //  * @param params.userId - ID del usuario que inicia sesión.
  //  */
  // sessionStart: ({ userId }: { userId: string }) => {
  //   logEvent("session_start")
  //   setTag("userId", userId) // Etiqueta personalizada para segmentación
  // },

  // /**
  //  * Registra cuando un usuario completa el registro.
  //  *
  //  * @param params - Parámetros del evento, incluyendo userId.
  //  * @param params.userId - ID del usuario que completa el registro.
  //  */
  // registerCompleted: ({ userId }: { userId: string }) => {
  //   logEvent("register_completed")
  //   setTag("userId", userId) // Etiqueta personalizada para segmentación
  // },

  /**
   * Registra cuando un usuario completa el proceso de onboarding.
   */
  onboardingCompleted: () => {
    logEvent("onboarding_complete_rate")
    setTag("onboarding_complete_rate", "completed") // Etiqueta personalizada para segmentación
  },

  //initiative_creation_duration -> proposal_submitted se usara esa

  /**
   * Registra cuando un usuario utiliza un filtro específico.
   *
   * @param params - Parámetros del evento, incluyendo filterName.
   * @param params.filterName - Nombre del filtro utilizado.
   */
  filterUsed: ({ filterName }: { filterName: string }) => {
    logEvent("filter_used")
    setTag("filter_used", filterName) // Etiqueta personalizada para segmentación
  },

  /**
   * Registra cuando un usuario realiza una búsqueda.
   *
   * @param params - Parámetros del evento, incluyendo searchQuery.
   * @param params.searchQuery - Consulta de búsqueda realizada.
   */
  searchUsed: ({ searchQuery }: { searchQuery: string }) => {
    logEvent("search_used")
    setTag("search_used", searchQuery) // Etiqueta personalizada para segmentación
  },

  /**
   * Registra cuando un usuario hace clic en un enlace externo.
   * TODO: PROBANDO EVENTO DE CLARITY COMO SALE EN EL DASHBOARD -> `external_link_${platform}_click_${userId}`
   *
   * @param params - Parámetros del evento, incluyendo platform y userId.
   * @param params.platform - Plataforma del enlace externo (e.g., 'Discord', 'GitHub').
   */
  externalLinkClick: ({ platform }: { platform: string }) => {
    logEvent(`external_link_${EXTERNAL_LINKS[platform]}_click`)
    setTag(`external_link_${EXTERNAL_LINKS[platform]}_click`, "clicked") // Etiqueta personalizada para segmentación
  },
}

const EXTERNAL_LINKS = {
  Discord: "discord",
  GitHubBack: "github",
  GitHubFront: "github",
  Dework: "dework",
  Aragon: "aragon",
} as Record<string, string>
