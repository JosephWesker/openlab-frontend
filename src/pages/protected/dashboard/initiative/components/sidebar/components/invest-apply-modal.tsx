// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button"
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal"
import { useEffect, useState } from "react"
import Fade from "@mui/material/Fade"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Backdrop from "@mui/material/Backdrop"
import { initiativeActionsStore } from "@/pages/protected/dashboard/initiative/stores/initiativeActionsStore"
import { useAuth0 } from "@auth0/auth0-react"
// import { UserRole } from "@/interfaces/general-enum"
// import Card from "@mui/material/Card"
// import Avatar from "@mui/material/Avatar"
import StarsRoundedIcon from '@mui/icons-material/StarsRounded'

export default function InvestApplyModal({ initiativeId }: { initiativeId: number }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { setAuth0, fetchInitiativeApply, loading2 } = initiativeActionsStore()

  const handleApplyInitiative = () => {
    console.log(initiativeId)
    // fetchInitiativeApply(auth0, Number(initiativeId), UserRole.COLLABORATOR)
  }

  const auth0 = useAuth0()
  useEffect(() => {
    setAuth0(auth0)
  }, [auth0, setAuth0, fetchInitiativeApply])

  return (
    <>
      <Button
        onClick={handleOpen}
        className="flex m-auto font-normal text-xs"
        variant="contained"
      >
        Invertir en la iniciativa
      </Button>
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
        <Fade in={open} className="absolute w-3xl top-[50%] left-[50%] transform-[translate(-50%,-50%)] p-6 bg-white rounded-2xl grid gap-6">
          <Box>
            <Typography className="font-semibold text-xl text-center text-(--color-primary)">
              Consideraciones clave de tu<span className="text-black"> aporte</span>
            </Typography>
            <Typography className="text-center">
              Los fondos que aportas a esta iniciativa serán gestionados de forma<span className="font-semibold"> transparente y desentralizada </span>
              directamente desde la<span className="font-semibold"> DAO de Aragon </span>de esta iniciativa. Esto garantiza que todas las decisiones sobre
              el uso de recursos se tomen de forma <span className="font-semibold text-(--color-primary)"> comunitaria </span> y son completamente auditables por cualquier miembro.
            </Typography>
            <Typography className="text-center">
              Para fomentar la confianza y la flexibilidad, la DAO permite el <span className="font-semibold"> retiro </span> o <span className="font-semibold"> incremento </span>de fondos según
              las necesidades y el progreso de la iniciativa. Este mecanismo asegura una gestión <span className="font-semibold text-(--color-primary)"> dinámica y adaptativa </span>
              del capital, maximizando el potencial de éxito de tu inversión.
            </Typography>

            <Typography className="text-center italic font-light text-sm">
              Esta información es meramente informativa y no interactiva en esta versión (MVP) de la plataforma.
            </Typography>

            {/* <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col gap-y-2 rounded-3xl shadow-md ring ring-gray-200 bg-white p-6 max-sm:max-w-sm max-sm:m-auto">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar className="w-8 h-8" alt="Travis Howard" src=""/>
                  <Typography className="font-semibold text-md text-gray-500">Habilidad general:</Typography>
                  <Button
                    className="w-fit m-auto flex"
                    variant="contained"
                  >
                    Translator
                  </Button>
                  <Typography className="font-semibold text-md text-gray-500">Habilidades técnicas:</Typography>
                  <Button
                    className="w-fit m-auto flex"
                    variant="contained"
                  >
                    Translator
                  </Button>
                </div>
              </Card>
            </div> */}
            <Button
              onClick={handleApplyInitiative}
              className="w-fit m-auto flex"
              variant="contained"
              startIcon={<StarsRoundedIcon />}
            >
              {loading2 ? 'Aplicando...' : 'Invertir en la iniciativa'}
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}