import Chip from "@mui/material/Chip"
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { InitiativeState, InitiativeStateNames } from "@/interfaces/general-enum"
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import { stateClassColor } from "../initiatives/utils/stateClassColor"
import type { Initiative } from "../initiative/schemas/initiativeSchema"
import Carousel from "./components/carousel"
import VoteModal from "./components/sidebar/components/vote-modal"
import TabsNav from "./components/tabsNav"
import Sidebar from "./components/sidebar/sidebar"
import { useAuthContext } from "@/hooks/useAuthContext"
// import noPicturePlaceholderImg from '@/assets/images/initiative-detail/no-image-placeholder.jpg'
import { useEffect } from "react"
import { useGlobal } from "@/context/GlobalContext"
import { useNavigate } from "react-router"
import { INITIATIVE_FALLBACK_IMAGE } from "@/lib/constants"
// import { useInitiativeForm } from "@/context/InitiativeFormContext"
// import type { InitiativeFormData } from "@/schemas/initiativeSchema"
// import { useFormContext } from "react-hook-form"

export default function PageInitiativeDraft() {
  // const [initiativeStorageData, setStorageData] = useState<any>(null)
  const { userFromApi } = useAuthContext()

  const { globalInitiative } = useGlobal()

  const navigate = useNavigate()
  // const { initiativeData: originalInitiative } = useInitiativeForm()
  // const { watch } = useFormContext<InitiativeFormData>()
  // const formData = watch()

  useEffect(() => {
    // const initiativeStorage = localStorage.getItem("initiative-storage")
    // // console.log('initiativeStorage', initiativeStorage)
    // if (!initiativeStorage) {
    //   window.location.replace("/add")
    // } else {
    //   const initiativeStorageParsed = JSON.parse(initiativeStorage)
    //   setStorageData(initiativeStorageParsed.state.formData)
    //   // console.log('initiativeStorageData', initiativeStorageData)
    // }
    if (!globalInitiative.initiative?.title){
      navigate('/add')
    }
  }, [])

  if (!globalInitiative) return (
    <Box className="flex h-full"></Box>
  )

  const today = new Date()

  const initiativeFull = {
    id: -1,
    title: globalInitiative.initiative?.title || "Escribe un título",
    img: globalInitiative.initiative?.img || INITIATIVE_FALLBACK_IMAGE,
    user: {
      id: 0,
      name: userFromApi?.name,
      email: userFromApi?.email,
      profilePic: userFromApi?.image,
    },
    description: globalInitiative.initiative?.description || "Escribe una descripción detallada",
    state:  "draft",
    motto: globalInitiative.initiative?.motto || "Escribe una descripción breve",
    collaborators: [],
    votesAgainst: 0,
    votesInFavor: 0,
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    problemToBeSolved: globalInitiative.initiative?.problemToBeSolved || "Describe el problema que resuelve tu iniciativa",
    marketInformation: globalInitiative.initiative?.marketInformation || "Información del mercado no provista",
    productFeatures: globalInitiative.initiative?.productFeatures || "Escribe las características del producto",
    objectives: globalInitiative.initiative?.objectives && globalInitiative.initiative?.objectives.length > 0 ? globalInitiative.initiative.objectives : ['Los objetivos de la iniciativa ayudan a atraer colaboradores interesados'],
    externalLinks: {
      dework: null,
      discord: null,
      // github: null,
      otros: [],
    },
    tags: ['etiqueta 1', 'etiqueta 2', 'etiqueta 3'],
    multimedia: globalInitiative.initiative?.multimedia && globalInitiative.initiative.multimedia.length > 0 ? globalInitiative.initiative.multimedia : [INITIATIVE_FALLBACK_IMAGE, INITIATIVE_FALLBACK_IMAGE],
    roadmap: globalInitiative.initiative?.roadmap || [],
    update: globalInitiative.initiative?.update || [],
    needs: globalInitiative.initiative?.needs || [], // ToDo: preview announcements
    announcements: globalInitiative.initiative?.announcements || [] // ToDo: preview announcements
  } as Initiative

  const enumKey = initiativeFull.state.toUpperCase() as keyof typeof InitiativeState

  return (
    <Box className="flex h-full justify-center">
      <Box className="flex flex-col flex-1 p-4 max-w-7initiativeFullxl">
        <Box className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-4">

          <Box component="main" className="space-y-4">
            <Box className="flex justify-between">
              <Chip label={InitiativeStateNames[enumKey] ?? initiativeFull.state} className={`${stateClassColor[initiativeFull.state]} text-white`}/>
              <Box className="text-sm text-gray-500 flex items-center gap-1"><CalendarMonthOutlinedIcon className="text-sm"/>
                Fecha de creación: { initiativeFull.date }
              </Box>
            </Box>

            <Box className="flex justify-between">
              <Typography component="h1" className="text-3xl font-semibold text-[#304578]">{ initiativeFull.title }</Typography>
              {/* <ShareRoundedIcon/> */}
            </Box>

            <Box>
              <Carousel initiative={ initiativeFull } />
            </Box>

            <Box className="flex justify-center flex-wrap gap-2">
              { initiativeFull.tags.map((tag: string, index: number) => (
                <Chip key={tag + index} label={tag} variant="outlined" className="rounded-md"/>
              ))}
            </Box>

            <Box className="flex justify-center flex-wrap gap-2">
              <VoteModal initiative={ initiativeFull } />
            </Box>

            <Box>
              <TabsNav initiative={ initiativeFull } />
            </Box>

          </Box>

          <Box component="aside" className="space-y-4">
            <Sidebar initiative={ initiativeFull } />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}