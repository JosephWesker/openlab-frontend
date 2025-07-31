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
import LinearProgress, { type LinearProgressProps } from "@mui/material/LinearProgress"
// import { useInitiativeApi } from "../../../stores/initiativeStore"
// import { VoteResponseDTO, type Initiative, type VoteRequestDTO } from "../../../schemas/initiativeSchema"
// import Dialog from "@mui/material/Dialog"
import Modal from "@mui/material/Modal"
// import Button from "@mui/material/Button"
import ButtonBase from "@mui/material/ButtonBase"
import type { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
// import { VoteResponseDTO, type Initiative, type VoteRequestDTO } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"
// import { useInitiativeApi } from "@/pages/protected/dashboard/initiative/stores/initiativeStore"
// import { useInitiativeApi } from "../../../stores/initiativeActionsStore"
// import { submitVote } from "../../../stores/initiativeActionsStore"
// import { useApiClient } from "@/utils/useApiClient"

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <LinearProgress variant="determinate" {...props} sx={{ height: 35, borderRadius: 1 }}/>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, 0)',
            color: 'white',
            fontWeight: 'bold',
            lineHeight: '35px',
          }}
        >{`${props.value.toFixed()}%`}</Typography>
      </Box>
    </Box>
  )
}

export default function VoteModal({ initiative }: { initiative: Initiative }) {
  const [votesInFavor, setVotesInFavor] = useState(initiative.votesInFavor)
  const [votesAgainst, setVotesAgainst] = useState(initiative.votesAgainst)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { showSnackbar } = useSnackbar()
  const [isVoting, setIsVoting] = useState(false)

  // const { submitVote} = useInitiativeApi()

  const handleVote = async (inFavor: boolean) => {

    if (isVoting) return
    setIsVoting(true)

    setVotesInFavor(0)
    setVotesAgainst(0)

    // try {
    //   const response = await submitVote({
    //     initiativeId: initiative.id,
    //     inFavor,
    //   } as VoteRequestDTO)

    //   const parsed = VoteResponseDTO.safeParse(response)

    //   if (!parsed.success) {
    //     // console.error('Error en el parseo:', parsed.error.format())
    //     // console.error('Error detallado:', parsed.error.errors)
    //     throw new Error('Ocurrió un error inesperado al votar')
    //   }

    //   setVotesInFavor(parsed.data[0].votesInFavor)
    //   setVotesAgainst(parsed.data[0].votesAgainst)

      showSnackbar({
        title: "Voto no registrado",
        message: inFavor ? "¡Voto a favor se registrará!" : "¡Voto en contra se registrará!",
        // message: "",
        severity: "success",
      })

    // } catch (err) {
    //   if (err instanceof Error){
    //     // set({ error4: err.message || 'Error desconocido', loading4: false })
    //     showSnackbar({
    //       title: "Ya has votado",
    //       message: "Ya has votado en esta iniciativa",
    //       // message: "",
    //       severity: "error",
    //     })
    //   }
    // } finally {
    //   setIsVoting(false)
    // }

    setIsVoting(false)
  }

  const totalVotes = votesInFavor + votesAgainst
  // const favorPercent = totalVotes === 0 ? 0 : (votesInFavor / totalVotes) * 100
  const acceptance = totalVotes === 0 ? 0 : (votesInFavor / totalVotes) * 100

  const totalVotesForAprove = 3
  const threshold = totalVotes === 0 ? 0 : Math.min((totalVotes / totalVotesForAprove) * 100, 100)

  return (
    <>
      <Container className="flex justify-center">
        <ButtonBase onClick={handleOpen} className="rounded-2xl">
          <Paper className="flex flex-row content-center px-3 py-1 gap-2 rounded-2xl">
            <Box className="flex items-center gap-2">
              <Typography>
                {votesInFavor}
              </Typography>
              {/* <ThumbUp fontSize="inherit" className="text-(--color-primary)"/> */}
              <ThumbUp fontSize="inherit"/>
            </Box>
            <Box className="flex items-center gap-2">
              <ThumbDown fontSize="inherit" />
              <Typography>
                {votesAgainst}
              </Typography>
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
        <Fade in={open} className="absolute w-2xl top-[50%] left-[50%] transform-[translate(-50%,-50%)] p-6 bg-white rounded-2xl grid gap-6">
          <Box>
            <Typography className="flex font-semibold text-3xl justify-center text-(--color-primary)">
              Estado de votación de la comunidad
            </Typography>
            <Typography className="flex justify-center text-center">
              Tu opinión es crucial. Aquí puedes ver el nivel de apoyo actual de esta propuesta y participar si aún no lo has hecho.
            </Typography>

            <Container className="flex justify-center flex-col items-center text-center">
              <Box className="flex w-full">
                <Box className="w-[50%] flex flex-col items-center justify-center">
                  <IconButton className="w-fit" onClick={() => handleVote(true)} disabled={isVoting}>
                    <ThumbUp className="text-6xl"/>
                  </IconButton>
                  <Box>
                    <Typography className="text-3xl font-bold">
                      {votesInFavor}
                    </Typography>
                    <Typography>
                      {votesInFavor == 1 ? 'voto' : 'votos'} a favor
                    </Typography>
                  </Box>

                </Box>

                <Box className="w-[50%] flex flex-col items-center justify-center">
                  <IconButton className="w-fit" onClick={() => handleVote(false)} disabled={isVoting}>
                    <ThumbDown className="text-6xl"/>
                  </IconButton>
                  <Box>
                    <Typography className="text-3xl font-bold">
                      {votesAgainst}
                    </Typography>
                    <Typography>
                      {votesAgainst == 1 ? 'voto' : 'votos'} en contra
                    </Typography>
                  </Box>

                </Box>

              </Box>
            </Container>

            <Box className="text-center">
              <Typography className="text-(--color-primary) font-bold">
                Progreso hacia la activación
              </Typography>
            </Box>

            <LinearProgressWithLabel value={threshold}/>
            {threshold === 0 ?
              <Typography className="text-(--color-primary) text-center">
                Umbral de <span className="font-medium">{threshold.toFixed()}%</span> alcanzado para la revisión
              </Typography>
            :
              <Typography className="text-(--color-primary) text-center">
                ¡Umbral de <span className="font-medium">{threshold.toFixed()}%</span> alcanzado para la revisión!
              </Typography>
            }
            <Typography className="text-gray-500 text-center text-sm italic">
              Esta iniciativa tiene una aceptación del {acceptance.toFixed()}%
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}