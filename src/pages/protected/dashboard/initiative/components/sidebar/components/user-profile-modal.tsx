// import Button from "@mui/material/Button"
import { useState } from "react"
// import Typography from "@mui/material/Typography"
// import Box from "@mui/material/Box"
// import Avatar from "@mui/material/Avatar"
// import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
// import type { Initiative } from "../../../schemas/initiativeSchema"
// import Dialog from "@mui/material/Dialog"
// import DialogContent from "@mui/material/DialogContent"
// import CardContent from "@mui/material/CardContent"
// import { AVATAR_PROFILE_POSTULATION } from "@/lib/constants"
// import Chip from "@mui/material/Chip"
// import Card from "@mui/material/Card"
// import DialogActions from "@mui/material/DialogActions"
// import DialogTitle from "@mui/material/DialogTitle"
// import { useSnackbar } from "@/context/SnackbarContext"
// import { useInitiativeApi } from "../../../stores/initiativeStore"
// import { useAuthContext } from "@/hooks/useAuthContext"
// import { useIsUserCollaborator } from "../hooks/useIsUserCollaborator"
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
// import { AnimatePresence, motion, type MotionProps } from "motion/react"
// import Lottie from "react-lottie-player"
// import arrowAnimation from "@/animations/completed-successfully.json"
// import IconButton from "@mui/material/IconButton"
// import CircularProgress from "@mui/material/CircularProgress"
// // import Fade from "@mui/material/Fade"
// import collaboratorsImg from "@/assets/images/initiative-detail/collaborators.svg"
// import benefitsImg from "@/assets/images/initiative-detail/benefits.svg"
// import List from "@mui/material/List"
// import ListItem from "@mui/material/ListItem"
// import ListItemText from "@mui/material/ListItemText"
// import ListItemIcon from "@mui/material/ListItemIcon"
// import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded"
// import type { PaperProps } from "@mui/material/Paper"
// import { UserResponseDTO } from "../../../schemas/initiativeSchema"
import ButtonBase from '@mui/material/ButtonBase'
import { UserProfileModal } from "@/components/shared/UserProfileModal"

interface Props {
  userId: number
  children: React.ReactNode
}

export default function UserProfileCollabModal({ userId, children }: Props){
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // const { showSnackbar } = useSnackbar()
  // const { getUser } = useInitiativeApi()
  // const [isGettingUser, setIsGettingUser] = useState(false)
  // const [userProfile, setUserProfile] = useState<UserResponseDTO | undefined>(undefined)

  // const { initiativeApply } = useInitiativeApi()

  // const { userFromApi } = useAuthContext()
  // const userEmail = userFromApi?.email

  // const isUserCollaborator = useIsUserCollaborator(initiative, userEmail)

  // const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // const tabList = [
  //   { id: "intro", label: "Introducción" },
  //   { id: "benefits", label: "Beneficios" },
  //   { id: "responsabilities", label: "Responsabilidades" },
  //   { id: "confirmation", label: "Confirmación" },
  // ]
  // const [activeTab, setActiveTab] = useState(0)
  // const goToTabById = (id: string) => {
  //   const index = tabList.findIndex((tab) => tab.id === id)
  //   if (index !== -1) setActiveTab(index)
  // }
  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue)
  // }

  // const MotionPaper = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
  //   const {
  //     // className,
  //     children,
  //     // sx, // opcional
  //     ...rest
  //   } = props

  //   return (
  //     <AnimatePresence mode="wait">
  //       <motion.div
  //         ref={ref}
  //         // layout
  //         // initial={{ opacity: 1, width: "auto" }}
  //         // animate={{ opacity: 1, width: "auto" }}
  //         // exit={{ opacity: 1, scale: 0.6 }}
  //         // transition={{ duration: 0.4, ease: "easeInOut" }}
  //         className="bg-[blue] w-full"
  //         // className={(className)} // por si usas tailwind o MUI `className`
  //         {...(rest as MotionProps)} // 👈 forzamos tipado compatible con framer-motion
  //       >
  //         {children}
  //       </motion.div>
  //     </AnimatePresence>
  //   )
  // })

  // useEffect(() => {
  //   const handleGetUser = async () => {
  //     if (isGettingUser) return

  //     setIsGettingUser(true)

  //     try {
  //       const response = await getUser(userId)

  //       const parsed = UserResponseDTO.safeParse(response)
  //       console.log(parsed)

  //       if (!parsed.success) {
  //         throw new Error('Ocurrió un error inesperado al abrir la iniciativa, intenta de nuevo más tarde.')
  //       }

  //       console.log("success")
  //       setUserProfile(parsed.data)
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         console.log("err.message", err.message)
  //       }
  //     } finally {
  //       setIsGettingUser(false)
  //     }
  //   }

  //   handleGetUser()
  // }, [open]) // ← se ejecuta cada vez que el modal cambia a "abierto"

  return (
    <>
      <ButtonBase
        onClick={() => {
          // goToTabById("intro")
          handleOpen()
          // setShowSuccessMessage(false)
        }}
        className="w-full flex flex-col items-start rounded-xl"
      >
        {children}
      </ButtonBase>

      <UserProfileModal userId={userId} open={open} onClose={handleClose} />

      {/* <Dialog
        className="m-auto bg-[transparent]"
        // fullScreen={fullScreen}
        // maxWidth="md"
        open={open}
        onClose={() => {
          // setShowSuccessMessage(false)
          handleClose()
        }}
        scroll={"paper"}
        slots={{ paper: MotionPaper }}
        // slotProps={{
        //   paper: {
        //     className: "p-6", // tus clases si quieres
        //     elevation: 3,
        //   },
        // }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            // key={activeTab}
            // layout
            // key="intro" // clave única por sección/tab
            // layout
            // initial={{ opacity: 0.5 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            // transition={{ duration: .5, ease: "easeInOut" }}
            // className="bg-[pink] transition-[width] duration-800 ease-in-out"
            className="bg-[transparent]"
          >
            <DialogContent className="bg-white p-6 rounded-xl"></DialogContent>
          </motion.div>
        </AnimatePresence>
      </Dialog> */}
    </>
  )
}
