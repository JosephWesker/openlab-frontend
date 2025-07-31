// Lista predefinida de emails con avatars (simulando una base de datos)
export interface EmailContact {
  email: string
  avatar: string
}

export const predefinedEmails: EmailContact[] = [
  {
    email: "maria.garcia@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e647?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "carlos.lopez@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "ana.rodriguez@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "luis.martinez@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "sofia.hernandez@example.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "diego.torres@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "carmen.ruiz@example.com",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "patricia.flores@example.com",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "ricardo.vargas@example.com",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  },
  {
    email: "alejandra.morales@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
]

/**
 * Función para buscar emails que coincidan con el término de búsqueda
 * @param searchTerm - Término de búsqueda
 * @param excludeEmails - Lista de emails a excluir de los resultados
 * @param maxResults - Número máximo de resultados a devolver
 * @returns Array de emails que coinciden con la búsqueda
 */
export const searchEmails = (
  searchTerm: string,
  excludeEmails: string[] = [],
  maxResults: number = 5,
): EmailContact[] => {
  if (!searchTerm.trim()) {
    return []
  }

  const normalizedSearch = searchTerm.toLowerCase().trim()

  return predefinedEmails
    .filter((contact) => {
      // Excluir emails ya seleccionados
      if (excludeEmails.includes(contact.email)) {
        return false
      }

      // Buscar en el email completo o partes del email
      const emailParts = contact.email.toLowerCase().split("@")
      const [username, domain] = emailParts

      return (
        contact.email.toLowerCase().includes(normalizedSearch) ||
        username.includes(normalizedSearch) ||
        domain.includes(normalizedSearch) ||
        // Buscar por nombre (parte antes del punto)
        username.split(".").some((part) => part.includes(normalizedSearch))
      )
    })
    .slice(0, maxResults)
}

// /**
//  * Función para obtener un avatar aleatorio
//  * @returns URL de avatar aleatorio
//  */
// export const getRandomAvatar = (): string => {
//   const avatars = [
//     "https://images.unsplash.com/photo-1494790108755-2616b612e647?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
//     "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
//   ]
//   return avatars[Math.floor(Math.random() * avatars.length)]
// }

/**
 * Función para validar formato de email
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}
