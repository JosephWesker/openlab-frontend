// import Modal from "@mui/material/Modal"
import { useState } from "react"
import Fade from "@mui/material/Fade"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Backdrop from "@mui/material/Backdrop"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
// import { useApi } from "@/hooks/useApi"
import { useSnackbar } from "@/context/SnackbarContext"
// import { API_PATH } from "@/lib/constants"
import IconButton from "@mui/material/IconButton"
import { ThumbDown, ThumbUp } from "@mui/icons-material"
// import { type VoteRequestDTO, type VoteResponseDTO, type Initiative } from "../../../schemas/initiativeActionsSchema"
// import LinearProgress, { type LinearProgressProps } from "@mui/material/LinearProgress"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { VoteResponseDTO, type Initiative, type VoteRequestDTO } from "../../../schemas/initiativeSchema"
// import Dialog from "@mui/material/Dialog"
import Modal from "@mui/material/Modal"
// import Button from "@mui/material/Button"
import ButtonBase from "@mui/material/ButtonBase"
import { engagementEvents } from "@/lib/clarityEvents"
import { ProgressBar } from "../common/ProgressBar"
import confettiAnimation from "@/animations/confetti.json"
import Lottie from "react-lottie-player"
// import { UserProfileResponseDTO } from "../../../schemas/userProfileSchema"

export default function VoteModal({ initiative }: { initiative: Initiative }) {
  const [votesInFavor, setVotesInFavor] = useState(initiative.votesInFavor)
  const [votesAgainst, setVotesAgainst] = useState(initiative.votesAgainst)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [animateUpSuccess, setAnimateUpSuccesss] = useState(false)
  const [animateUp, setAnimateUp] = useState(false)
  const [animateDown, setAnimateDown] = useState(false)

  const { showSnackbar } = useSnackbar()
  const [isVoting, setIsVoting] = useState(false)

  const { submitVote } = useInitiativeApi()

  // Get current profile user to get active vote and GitHub
  // ToDo: this auto request must not be on clicking open modal to prevent multi requests?
  // const [isGettingUserProfile, setGettingUserProfile] = useState(false)
  // const [userProfile, setUserProfile] = useState<UserProfileResponseDTO>()
  // const { getUserProfile } = useInitiativeApi()
  // const getUserProfileData = async () => {
  //   if (isGettingUserProfile) return

  //   setGettingUserProfile(true)

  //   try {
  //     const userProfileResponse = await getUserProfile()
  //     console.log(userProfileResponse)

  //     const parsedUserProfile = UserProfileResponseDTO.safeParse(userProfileResponse)
  //     console.log('parsedUserProfile', parsedUserProfile)

  //     if (!parsedUserProfile.success) {
  //       showSnackbar({
  //         title: "Servicio no disponible",
  //         message: "Servicio no disponible",
  //         severity: "error",
  //       })
  //       // console.error("parse failed:", parsed.error.format())
  //       console.error("issues detail:", parsedUserProfile.error.issues)
  //       throw new Error("Ocurrió un error inesperado al conseguir datos del usuario.")
  //     }
  //     console.log("initiative", parsedUserProfile.data)
  //     setUserProfile(parsedUserProfile.data)
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       console.log("err.message", err.message)
  //       showSnackbar({
  //         title: "Ups, algo salio mal",
  //         message: "Ups, algo salio mal",
  //         severity: "error",
  //       })
  //     }
  //   } finally {
  //     setGettingUserProfile(false)
  //   }
  // }
  // useEffect(() => {
  //   getUserProfileData()
  // }, [])

  const handleVote = async (inFavor: boolean) => {
    if (isVoting) return
    setIsVoting(true)

    // Enable animation
    if (inFavor) {
      setAnimateUp(true)
      setTimeout(() => setAnimateUp(false), 300)
    } else {
      setAnimateDown(true)
      setTimeout(() => setAnimateDown(false), 300)
    }
    // if (inFavor) {
    //   setAnimateUpSuccesss(true)
    // }
    // setIsVoting(false)

    try {
      const responseVote = await submitVote({
        initiativeId: initiative.id,
        inFavor,
      } as VoteRequestDTO)

      const parsedVote = VoteResponseDTO.safeParse(responseVote)

      if (!parsedVote.success) {
        console.error("Error en el parseo:", parsedVote.error.format())
        console.error("Error detallado:", parsedVote.error.errors)
        throw new Error("Ocurrió un error inesperado al votar")
      }

      engagementEvents.voteCast({
        initiativeId: initiative.id.toString(),
        title: initiative.title,
        inFavor,
      })

      setVotesInFavor(parsedVote.data[0].votesInFavor)
      setVotesAgainst(parsedVote.data[0].votesAgainst)

      // Enable lottie cofetti animation
      if (inFavor) {
        setAnimateUpSuccesss(true)
      }

      // getUserProfileData()

      showSnackbar({
        title: "Voto registrado",
        message: inFavor ? "¡Voto a favor registrado!" : "¡Voto en contra registrado!",
        severity: "success",
      })
    } catch (err) {
      if (err instanceof Error) {
        // set({ error4: err.message || 'Error desconocido', loading4: false })
        showSnackbar({
          title: "Ya has votado",
          message: "Ya has votado en esta iniciativa",
          severity: "error",
        })
      }
    } finally {
      setIsVoting(false)
    }
  }

  const totalVotes = votesInFavor + votesAgainst
  // const favorPercent = totalVotes === 0 ? 0 : (votesInFavor / totalVotes) * 100
  const acceptance = totalVotes === 0 ? 0 : (votesInFavor / totalVotes) * 100

  const totalVotesForAprove = 10
  const threshold = totalVotes === 0 ? 0 : Math.min((totalVotes / totalVotesForAprove) * 100, 100)
  // const threshold = 100

  return (
    <>
      <Container className="flex justify-center">
        <ButtonBase onClick={handleOpen} className="rounded-2xl">
          <Paper className="flex flex-row content-center px-3 py-1 gap-2 rounded-2xl">
            <Box className="flex items-center gap-2">
              <Typography>{votesInFavor}</Typography>
              <ThumbUp
                fontSize="inherit"
                // className={`${
                //   userProfile?.votedInitiatives.find((votedInitiative) => votedInitiative.id === initiative.id)
                //     ? "text-[var(--color-primary)]"
                //     : ""
                // }`}
              />
            </Box>
            <Box className="flex items-center gap-2">
              <ThumbDown
                fontSize="inherit"
                // className={`${
                //   userProfile?.votedInitiatives.find((votedInitiative) => votedInitiative.id === initiative.id)
                //     ? "text-[var(--color-primary)]"
                //     : ""
                // }`}
              />
              <Typography>{votesAgainst}</Typography>
            </Box>
          </Paper>
        </ButtonBase>
      </Container>
      <Modal
        className=""
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
        <Fade
          in={open}
          className="absolute w-2xl top-[50%] left-[50%] transform-[translate(-50%,-50%)] p-6 bg-white rounded-2xl grid gap-6"
        >
          <Box>
            <Typography className="flex font-semibold text-3xl justify-center text-(--color-primary)">
              Estado de votación de la comunidad
            </Typography>
            <Typography className="flex justify-center text-center">
              Tu opinión es crucial. Aquí puedes ver el nivel de apoyo actual de esta propuesta y participar si aún no
              lo has hecho.
            </Typography>

            <Container className="flex justify-center flex-col items-center text-center">
              <Box className="flex w-full">
                <Box className="w-[50%] flex flex-col items-center justify-center">
                  <IconButton className="w-fit p-4" onClick={() => handleVote(true)} disabled={isVoting}>
                    {animateUpSuccess && (
                      <Lottie play loop={false} animationData={confettiAnimation} className="h-34 w-34 absolute" />
                    )}
                    <ThumbUp
                      className={`text-6xl transition-transform duration-300 ease-out ${animateUp ? "scale-125" : ""}`}
                    />
                  </IconButton>
                  <Box>
                    <Typography className="text-3xl font-bold">{votesInFavor}</Typography>
                    <Typography>{votesInFavor == 1 ? "voto" : "votos"} a favor</Typography>
                  </Box>
                </Box>

                <Box className="w-[50%] flex flex-col items-center justify-center">
                  <IconButton className="w-fit p-4" onClick={() => handleVote(false)} disabled={isVoting}>
                    <ThumbDown
                      className={`text-6xl transition-transform duration-300 ease-out ${animateDown ? "scale-125" : ""}`}
                    />
                  </IconButton>
                  <Box>
                    <Typography className="text-3xl font-bold">{votesAgainst}</Typography>
                    <Typography>{votesAgainst == 1 ? "voto" : "votos"} en contra</Typography>
                  </Box>
                </Box>
              </Box>
            </Container>

            <Typography className="text-gray-500 text-center text-sm italic">
              Esta iniciativa tiene una aceptación del {acceptance.toFixed()}%
            </Typography>

            <Box className="text-center">
              <Typography className="text-(--color-primary) font-bold">Progreso hacia la activación</Typography>
            </Box>

            <ProgressBar threshold={threshold} />
            {threshold === 0 ? (
              <Typography className="text-(--color-primary) text-center">
                Umbral de <span className="font-medium">{threshold.toFixed()}%</span> alcanzado para la revisión
              </Typography>
            ) : threshold < 100 ? (
              <Typography className="text-(--color-primary) text-center">
                ¡Umbral de <span className="font-medium">{threshold.toFixed()}%</span> alcanzado para la revisión!
              </Typography>
            ) : (
              <Box className="flex flex-col gap-4">
                <Typography className="text-(--color-primary) text-center">
                  ¡Umbral de <span className="font-medium">{threshold.toFixed()}%</span> alcanzado!
                </Typography>
                <Typography className="text-center">
                  La iniciativa <span className="text-(--color-primary) font-semibold"> {initiative.title}</span> ha
                  sido pre-aprobada por la comunidad de OpenLab.
                </Typography>
                <Typography className="text-center">
                  Ahora, el equipo de administración de OpenLab revisará tu propuesta para la aprobación final y
                  activación. Te notificaremos sobre el siguiente paso.
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
