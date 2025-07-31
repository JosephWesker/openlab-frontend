import { API_PATH } from "@/lib/constants"
import { useApiClient } from "@/utils/useApiClient"
import type { ApplicationsResponseDTO, Initiative, InitiativeApplyCofoundingRequestDTO, InitiativeApplyRequestDTO, UserResponseDTO, VoteRequestDTO, VoteResponseDTO } from "../schemas/initiativeSchema"

export function useInitiativeApi() {
  const apiClient = useApiClient()

  async function getInitiative(initiativeId: number): Promise<Initiative> {
    return await apiClient<Initiative>(`${API_PATH.INITIATIVE}/${initiativeId}`, {
      method: "GET"
    })
  }

  async function getInitiativeByTitle(initiativeTitle: string): Promise<Initiative> {
    return await apiClient<Initiative>(`${API_PATH.INITIATIVE_TITLE}/${initiativeTitle}`, {
      method: "GET"
    })
  }

  async function submitVote(voteRequestDTO: VoteRequestDTO): Promise<VoteResponseDTO> {
    return await apiClient<VoteResponseDTO>(API_PATH.INITIATIVE_VOTE, {
      method: "POST",
      body: JSON.stringify({
        initiativeId: Number(voteRequestDTO.initiativeId),
        inFavor: voteRequestDTO.inFavor
      } as VoteRequestDTO)
    })
  }

  async function getUser(id: number): Promise<UserResponseDTO> {
    return await apiClient<UserResponseDTO>(`${API_PATH.USER}/${id}`, {
      method: "GET"
      // queryParams: { id: String(id) }
    })
  }

  async function initiativeApply(initiativeId: number, role: string): Promise<string> {
    return await apiClient<string>(API_PATH.INITIATIVE_APPLY, {
      method: "POST",
      body: JSON.stringify({
        initiativeId,
        role
      } as InitiativeApplyRequestDTO),
      parseAs: 'text'
    })
  }

  async function initiativeApplyCofounding(announcementId: number, description: string, gSkills: string, hardSkills: string[]): Promise<string> {
    return await apiClient<string>(API_PATH.INITIATIVE_APPLY_NOTICE, {
      method: 'POST',
      body: JSON.stringify({
        announcementId,
        description,
        gSkills,
        hardSkills
      } as InitiativeApplyCofoundingRequestDTO),
      parseAs: 'text'
    })
  }

  async function getInitiativeApplications(initiativeId: number): Promise<ApplicationsResponseDTO> {
    return await apiClient<ApplicationsResponseDTO>(`${API_PATH.INITIATIVE_APPLICATIONS}/${initiativeId}`, {
      method: "GET"
    })
  }

  return {
    submitVote,
    getUser,
    initiativeApply,
    initiativeApplyCofounding,
    getInitiative,
    getInitiativeByTitle,
    getInitiativeApplications
  }
}