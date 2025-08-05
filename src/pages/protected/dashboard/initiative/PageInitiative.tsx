import { useParams } from "react-router"
import { useEffect, useState } from "react"
import Chip from "@mui/material/Chip"
// import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import TabsNav from "@/pages/protected/dashboard/initiative/components/tabsNav"
import Sidebar from "@/pages/protected/dashboard/initiative/components/sidebar/sidebar"
import Carousel from "@/pages/protected/dashboard/initiative/components/carousel"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"
import { InitiativeState, InitiativeStateNames } from "@/interfaces/general-enum"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import VoteModal from "./components/sidebar/components/vote-modal"
import { useSnackbar } from "@/context/SnackbarContext"
import { useInitiativeApi } from "./stores/initiativeStore"
import { InitiativeFull } from "./schemas/initiativeSchema"
import { stateClassColor } from "../initiatives/utils/stateClassColor"
import { contentEvents } from "@/lib/clarityEvents"

export default function PageInitiative() {
  const { slug } = useParams<{ slug: string }>()
  // const idStr = slugWithId?.split('-').pop()
  // const id = Number(idStr)

  const { showSnackbar } = useSnackbar()
  const [isGettingInitiative, setGettingInitiative] = useState(false)
  const [initiative, setInitiative] = useState<InitiativeFull | undefined>(undefined)
  const { getInitiativeByTitle } = useInitiativeApi()

  useEffect(() => {
    const getInitiativeData = async () => {
      if (isGettingInitiative) return
      if (!slug) return
      setGettingInitiative(true)

      try {
        const response = await getInitiativeByTitle(slug)
        console.log(response)

        const parsed = InitiativeFull.safeParse(response)
        console.log(parsed)

        if (!parsed.success) {
          showSnackbar({
            title: "Servicio no disponible",
            message: "Servicio no disponible",
            severity: "error",
          })
          // console.error("parse failed:", parsed.error.format())
          console.error("issues detail:", parsed.error.issues)
          throw new Error("Ocurrió un error inesperado al abrir la iniciativa, intenta de nuevo más tarde.")
        }
        console.log("initiative", parsed.data)
        setInitiative(parsed.data)
      } catch (err) {
        if (err instanceof Error) {
          console.log("err.message", err.message)
          showSnackbar({
            title: "Ups, algo salio mal",
            message: "Ups, algo salio mal",
            severity: "error",
          })
        }
      } finally {
        setGettingInitiative(false)
      }
    }

    getInitiativeData()
  }, [])

  // registro de evento de iniciativa vista
  useEffect(() => {
    if (initiative) {
      contentEvents.initiativeViewed({
        initiativeId: initiative.initiative.id.toString(),
        title: initiative.initiative.title,
      })
    }
  }, [initiative])

  if (isGettingInitiative || !initiative) return <Box className="flex h-full"></Box>

  if (!slug) return <Box className="flex h-full">No hay una iniciativa válida</Box>

  // if (!initiative) return <div>Sin respuesta</div>

  const enumKey = initiative.initiative.state.toUpperCase() as keyof typeof InitiativeState

  return (
    <Box className="flex h-full justify-center">
      <Box className="flex flex-col flex-1 p-4 max-w-7xl">
        <Box className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-4">
          <Box component="main" className="space-y-4">
            <Box className="flex justify-between">
              <Chip
                label={InitiativeStateNames[enumKey] ?? initiative.initiative.state}
                className={`${stateClassColor[initiative.initiative.state]} text-white`}
              />
              <Box className="text-sm text-gray-500 flex items-center gap-1">
                <CalendarMonthOutlinedIcon className="text-sm" />
                Fecha de creación: {initiative.initiative.date}
              </Box>
            </Box>

            <Box className="flex justify-between">
              <Typography component="h1" className="text-3xl font-semibold text-[#304578]">
                {initiative.initiative.title}
              </Typography>
              {/* <ShareRoundedIcon/> */}
            </Box>

            <Box>
              <Carousel initiative={initiative.initiative} />
            </Box>

            <Box className="flex justify-center flex-wrap gap-2">
              {initiative.initiative.tags.map((tag: string, index: number) => (
                <Chip key={tag + index} label={tag} variant="outlined" className="rounded-md" />
              ))}
            </Box>

            <Box className="flex justify-center flex-wrap gap-2">
              <VoteModal initiative={initiative.initiative} />
            </Box>

            <Box>
              <TabsNav initiative={initiative.initiative} />
            </Box>
          </Box>

          <Box component="aside" className="space-y-4">
            <Sidebar initiativeFull={initiative} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
