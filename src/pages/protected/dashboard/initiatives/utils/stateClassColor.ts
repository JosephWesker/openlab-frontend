import { InitiativeState } from "@/interfaces/general-enum"

export const stateClassColor: Record<string, string> = {
  [InitiativeState.ALL]: "bg-gray-400",
  [InitiativeState.PROPOSAL]: "bg-[#FF7875]",
  [InitiativeState.INPROCESS]: "bg-[#FA8C16]",
  [InitiativeState.APPROVED]: "bg-[#46A616]",
  [InitiativeState.DISABLED]: "bg-[#555555]",
  [InitiativeState.DRAFT]: "bg-[#fdd835]",
}
