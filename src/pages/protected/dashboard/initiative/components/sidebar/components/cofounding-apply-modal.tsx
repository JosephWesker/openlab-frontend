import Button from "@mui/material/Button"
import Modal from "@mui/material/Modal"
import { useState } from "react"
import Fade from "@mui/material/Fade"
import Box from "@mui/material/Box"
import Backdrop from "@mui/material/Backdrop"
import StarsRoundedIcon from '@mui/icons-material/StarsRounded'
import TextField from "@mui/material/TextField"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { useSnackbar } from "@/context/SnackbarContext"
import { useIsUserCofounder } from "../hooks/useIsUserCofounder"
import type { InitiativeFull } from "../../../schemas/initiativeSchema"
import { useAuthContext } from "@/hooks/useAuthContext"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { AnimatePresence, motion } from "motion/react"
import Lottie from "react-lottie-player"
import arrowAnimation from '@/animations/completed-successfully.json'
import CircularProgress from "@mui/material/CircularProgress"

export default function CoFoundingApplyModal({ initiativeFull, announcementId, onCollaborationChange, onCofoundingChange }: {
  initiativeFull: InitiativeFull
  announcementId: number
  onCollaborationChange: (status: boolean) => void
  onCofoundingChange: (status: boolean) => void
}) {
  const [description, setValor] = useState("")

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { showSnackbar } = useSnackbar()
  const [isAplying, setIsAplying] = useState(false)
  const { initiativeApplyCofounding} = useInitiativeApi()

  const { userFromApi } = useAuthContext()
  const userEmail = userFromApi?.email ?? ""
  const userSkillsGeneral = userFromApi?.skills.general ?? []
  const userSkillsTechnical = userFromApi?.skills.technical ?? []
  const userGitHub = userFromApi?.social.github ?? ""
  const { isCofounder, isApplicant, loading } = useIsUserCofounder(initiativeFull.initiative, userEmail)

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const userId = userFromApi?.id ?? "" // ToDo: Auth Context must retrieve non optional/undefined values

  const handleApplyCoFounding = async () => {
    if (isAplying) return

    if (userId === initiativeFull.initiative.user.id) {
      showSnackbar({
        title: "Iniciativa propia",
        message: "No puedes aplicar en tu propia iniciativa",
        severity: "error",
      })
      return
    }

    if (isCofounder) {
      showSnackbar({
        title: "Ya eres cofundador",
        message: "Ya eres cofundador en esta iniciativa",
        severity: "error",
      })
      // ToDo: reload page section to show cofounders
      // setGetCofounders(true)
      onCollaborationChange(true)
      return
    }

    if (initiativeFull.coFounderAnnouncementId !== null) {
      showSnackbar({
        title: "Aplicación realizada",
        message: "Ya has aplicado como cofundador en esta iniciativa",
        severity: "error",
      })
      return
    }

    if (!userSkillsTechnical || !userGitHub) {
      showSnackbar({
        title: "Información requerida",
        message: "Para postularte es requerido tener habilidades técnicas y un perfil de GitHub", // ToDo: invite the user to edit their profile from a modal
        severity: "error",
      })
      return
    }

    if (description.length <= 50) {
      showSnackbar({
        title: "Descripción corta",
        message: "Se requieren al menos 50 caracteres en la descripción",
        severity: "error",
      })
      return
    }

    setIsAplying(true)

    try {
      const response = await initiativeApplyCofounding(announcementId, description, userSkillsGeneral[0], userSkillsTechnical)

      if (!response) {
        showSnackbar({
          title: "Servicio no disponible",
          message: "Servicio no disponible",
          severity: "error",
        })
        throw new Error('Ocurrió un error inesperado al aplicar, intenta de nuevo más tarde.')
      }

      localStorage.setItem('user_cofounding', JSON.stringify([{ email: userEmail, initiativeId: initiativeFull.initiative.id }]))

      // showSnackbar({
      //   title: "Postulado",
      //   message: "¡Tu postulación ha sido enviada para aprobación!",
      //   severity: "success",
      // })

      onCofoundingChange(true)
      setShowSuccessMessage(true)

    } catch (err) {
      if (err instanceof Error){
        console.log('err.message', err.message)
        showSnackbar({
          title: "Ups, algo salio mal",
          message: "Ups, algo salio mal",
          severity: "error",
        })
      }
    } finally {
      setIsAplying(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-fit min-w-1 ml-0 text-xs font-normal"
        // className="w-fit min-w-1 px-2 py-1 ml-auto text-xs font-normal"
        variant="contained"
      >
        Aplicar
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "0%",
              transform: "translate(-50%, -50%)",
              width: "100%"
            }}
            key={showSuccessMessage ? "success" : "form"}
            initial={{ opacity: 1, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            layout
          >
            <Fade in={open} className="absolute w-1xl top-[50%] left-[50%] transform-[translate(-50%,-50%)] p-6 bg-white rounded-2xl grid gap-6">
              <Box>
                <IconButton
                  onClick={() => {
                    setShowSuccessMessage(false)
                    handleClose()
                  }}
                  className="absolute top-2 right-2 text-gray-400"
                  size="small"
                >
                  <CloseRoundedIcon/>
                </IconButton>
                {showSuccessMessage ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <Lottie
                      loop
                      play
                      animationData={arrowAnimation}
                      style={{ width: "50%", height: "50%" }}
                    />
                    <Typography variant="h6" className="text-center font-semibold">
                      ¡Tu postulación ha sido enviada!
                    </Typography>
                    <Typography className="text-center text-gray-500">
                      Pronto revisaremos tu aplicación. Te notificaremos por correo electrónico.
                    </Typography>
                    <Button
                      variant="contained"
                      className="bg-[#3d7bff]"
                      // onClick={() => setShowSuccessMessage(false)}
                      onClick={() => {
                        setShowSuccessMessage(false)
                        handleClose()
                      }}
                    >
                      Aceptar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Avatar className="w-20 h-20" alt="Travis Howard" src={userFromApi?.image}/>
                    <Typography className="flex font-semibold text-xl justify-center">{userFromApi?.name}</Typography>
                    <Typography className="flex justify-center text-center">{userEmail}</Typography>
                    {!userFromApi?.description ?
                      <Typography className="flex justify-center text-center">¡Aún no tienes una descripción de tu perfil!</Typography>
                    :
                      <Typography className="flex justify-center text-center">{userFromApi?.description}</Typography>
                    }

                    <Typography className="flex justify-center text-center mt-2">
                      Esta iniciativa está buscando talentos para fortalecer su equipo. ¡Te invitamos a postularte!
                    </Typography>

                    <Typography className="font-normal text-md text-gray-500">Habilidades generales:</Typography>
                    <div className="flex justify-center flex-wrap gap-2">
                      {userSkillsGeneral.length > 0 ?
                        userSkillsGeneral.map((userSkill, index: number) => (
                          <Chip key={index} label={userSkill} className="rounded-md"/>
                        ))
                      :
                        <Typography>No tienes habilidades generales</Typography>
                      }
                    </div>

                    <Typography className="font-normal text-md text-gray-500">Habilidades técnicas:</Typography>
                    <div className="flex justify-center flex-wrap gap-2">
                      {userSkillsTechnical.length > 0 ?
                        userSkillsTechnical.map((userSkill) => (
                          <Chip label={userSkill} className="rounded-md"/>
                        ))
                      :
                        <Typography>No tienes habilidades técnicas</Typography>
                      }
                    </div>

                    <TextField
                      className="w-full mt-6"
                      label="Presentación"
                      placeholder="Describe por qué quieres participar en esta iniciativa"
                      variant="outlined"
                      multiline
                      minRows={4}
                      maxRows={8}
                      autoFocus
                      value={description}
                      onChange={(e) => {
                        const val = e.target.value.slice(0, 250)
                        setValor(val)
                      }}
                    />
                    <div className="text-center text-xs">
                      {description.length}/250
                    </div>

                    <Button
                      onClick={handleApplyCoFounding}
                      className="m-auto flex items-center gap-4 bg-[#3d7bff] disabled:text-white"
                      variant="contained"
                      // loadingPosition="end"
                      // loading={isAplying || loading}
                      disabled={isAplying}
                      // startIcon={<StarsRoundedIcon />}
                    >
                      <StarsRoundedIcon />
                      {loading ? (
                        'Verificando estado...'
                      ) : isCofounder ? (
                        'Ya eres Cofundador'
                      ) : isApplicant ? (
                        'Solicitud en revisión'
                      ) : (
                        'Postularme a cofundador'
                      )}
                      {isAplying || loading  && (
                        <CircularProgress size={16} color="inherit" />
                      )}
                    </Button>
                  </div>
                )}
              </Box>
            </Fade>
          </motion.div>
        </AnimatePresence>
      </Modal>
    </>
  )
}