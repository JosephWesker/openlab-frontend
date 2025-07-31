// import { apiClient } from "@/handlers/apiClient"
import { API_PATH } from "@/lib/constants"
import { Initiative, InitiativePaged } from '@/pages/protected/dashboard/initiative/schemas/initiativeSchema'
// import { useApiClient } from "@/utils/useApiClient"

import { create } from 'zustand'
// import { getAuth0Token } from '@/utils/useApiClient'
import { type Auth0ContextInterface } from '@auth0/auth0-react'
import { getAuth0Token } from "@/utils/getAuth0Token"
// import { useSnackbar } from "@/context/SnackbarContext"
// import { useSnackbar } from "@/context/SnackbarContext"

interface InitiativeStore {
  auth0: Auth0ContextInterface | null
  setAuth0: (auth0: Auth0ContextInterface) => void

  initiative: Initiative | null
  initiative2: Initiative | null
  initiative3: InitiativePaged | null
  initiative4: Initiative | null
  loading1: boolean
  loading2: boolean
  loading3: boolean
  loading4: boolean
  error1: string | null
  error2: string | null
  error3: string | null
  error4: string | null
  fetchInitiative: (auth0: Auth0ContextInterface, initiativeId: number) => Promise<void>
  fetchInitiativeApply: (auth0: Auth0ContextInterface, initiativeId: number, role: string) => Promise<void>
  fetchInitiatives: (auth0: Auth0ContextInterface, page: number, size: number, state: string) => Promise<void>
  fetchInitiativeCoFounderApply: (auth0: Auth0ContextInterface, announcementId: number, intro: string, gSkills: string, hardSkills: string[]) => Promise<void>
}

export const initiativeActionsStore = create<InitiativeStore>((set) => ({

  auth0: null,
  setAuth0: (auth0) => set({ auth0 }),

  initiative: null,
  initiative2: null,
  initiative3: null,
  initiative4: null,
  loading1: false,
  loading2: false,
  loading3: false,
  loading4: false,
  error1: null,
  error2: null,
  error3: null,
  error4: null,

  fetchInitiative: async (auth0: Auth0ContextInterface, initiativeId: number) => {
    set({ loading1: true, error1: null })
    const token = await getAuth0Token(auth0)
    // const { getIdTokenClaims } = useAuth0()

    try {
      // const { __raw: token } = (await getIdTokenClaims()) || {}

      const res = await fetch(`${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE}/${initiativeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      console.log('data', data)

      const parsed = Initiative.safeParse(data)
      if (!parsed.success) {
        console.error('Error en el parseo:', parsed.error.format())
        console.error('Error detallado:', parsed.error.errors)
        throw new Error('Respuesta inválida del servidor')
      }

      set({ initiative: parsed.data, loading1: false })
    } catch (err) {
      if (err instanceof Error){
        set({ error1: err.message || 'Error desconocido', loading1: false })
      } else {
        console.log(err)
      }
    }
  },

  fetchInitiatives: async (auth0: Auth0ContextInterface, page: number, size: number, state: string) => {
    set({ loading3: true, error3: null })
    const token = await getAuth0Token(auth0)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_LIST}?page=${page}&size=${size}&state=${state}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      console.log('data', data)

      const parsed = InitiativePaged.safeParse(data)
      console.log('parsed initiatives', parsed)
      if (!parsed.success) {
        // console.error('Error en el parseo:', parsed.error.format())
        // console.error('Error detallado:', parsed.error.errors)
        throw new Error('Iniciatives. Respuesta inválida del servidor.')
      }

      set({ initiative3: parsed.data, loading3: false })
    } catch (err) {
      if (err instanceof Error){
        set({ error3: err.message || 'Error desconocido', loading3: false })
      } else {
        console.log(err)
      }
    }
  },

  fetchInitiativeApply: async (auth0: Auth0ContextInterface, initiativeId: number, role: string) => {
    set({ loading2: true, error2: null })
    const token = await getAuth0Token(auth0)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_APPLY}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          initiativeId,
          role,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      // const data = await res.json();

      // const parsed = InitiativeApplySchema.safeParse(data);
      // if (!parsed.success) {
      //   throw new Error('Respuesta inválida del servidor');
      // }

      // set({ initiative: parsed.data, loading: false });
      const result = await res.text()
      console.log('Response:', result)
      set({ loading2: false })

    } catch (err) {
      if (err instanceof Error){
        set({ error2: err.message || 'Error desconocido', loading2: false })
      } else {
        console.log(err)
      }
    }
  },

  fetchInitiativeCoFounderApply: async (auth0: Auth0ContextInterface, announcementId: number, description: string, gSkills: string, hardSkills: string[]) => {
    set({ loading4: true, error4: null })
    const token = await getAuth0Token(auth0)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_APPLY_NOTICE}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          announcementId,
          description,
          gSkills,
          hardSkills
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      // const data = await res.json();

      // const parsed = InitiativeApplySchema.safeParse(data);
      // if (!parsed.success) {
      //   throw new Error('Respuesta inválida del servidor');
      // }

      // set({ initiative: parsed.data, loading: false });
      const result = await res.text()
      console.log('Response:', result)
      set({ loading4: false })

    } catch (err) {
      if (err instanceof Error){
        set({ error4: err.message || 'Error desconocido', loading4: false })
      } else {
        console.log(err)
      }
    }
  },

  fetchInitiativeVotes: async (auth0: Auth0ContextInterface, announcementId: number, description: string) => {
    set({ loading4: true, error4: null })
    const token = await getAuth0Token(auth0)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${API_PATH.INITIATIVE_APPLY_NOTICE}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          announcementId,
          description,
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      // const data = await res.json();

      // const parsed = InitiativeApplySchema.safeParse(data);
      // if (!parsed.success) {
      //   throw new Error('Respuesta inválida del servidor');
      // }

      // set({ initiative: parsed.data, loading: false });
      // const result = await res.text()
      // console.log('Response:', result)
      set({ loading4: false })

    } catch (err) {
      if (err instanceof Error){
        set({ error4: err.message || 'Error desconocido', loading4: false })
      } else {
        console.log(err)
      }
    }
  },

}))