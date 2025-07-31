// // import { useInitiativeApi } from "@/api/useInitiativeApi"
// import type { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
// import { useInitiativeApi } from "@/pages/protected/dashboard/initiative/stores/initiativeStore"
// // import { Initiative } from "../schemas/initiativeSchema"

// export function useInitiativeWithFallback() {
//   const { getInitiative } = useInitiativeApi()

//   async function getInitiativeWithFallback(initiativeId: number): Promise<Initiative | null> {
//     try {
//       const data = await getInitiative(initiativeId)
//       // localStorage.setItem(`initiative_${initiativeId}`, JSON.stringify(data))
//       return data
//     } catch (err) {
//       if (err instanceof Error){
//         console.log('err.message', err.message)
//       }
//       // const cached = localStorage.getItem(`initiative_${initiativeId}`)
//       // return cached ? JSON.parse(cached) : null
//       return null
//     }
//   }

//   return { getInitiativeWithFallback }
// }
