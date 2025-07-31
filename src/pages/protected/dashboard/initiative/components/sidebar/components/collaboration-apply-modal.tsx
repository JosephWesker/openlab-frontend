// Refactor del modal con animación fluida entre pasos

import { useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { AnimatePresence, motion } from "framer-motion"
import { useSnackbar } from "@/context/SnackbarContext"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { useIsUserCollaborator } from "../hooks/useIsUserCollaborator"
import type { Initiative } from "../../../schemas/initiativeSchema"
import { useAuthContext } from "@/hooks/useAuthContext"
import DialogTitle from "@mui/material/DialogTitle"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded"
import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
import collaboratorsImg from "@/assets/images/initiative-detail/collaborators.svg"
import benefitsImg from "@/assets/images/initiative-detail/benefits.svg"
import Lottie from "react-lottie-player"
import arrowAnimation from "@/animations/completed-successfully.json"
import CircularProgress from "@mui/material/CircularProgress"

export default function CollaborationApplyModal({
  initiative,
  onCollaborationChange,
}: {
  initiative: Initiative
  onCollaborationChange: (status: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const handleOpen = () => {
    setActiveTab(0)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getModalWidth = (step: number) => {
    const isMobile = windowWidth < 1000
    switch (step) {
      case 0:
        return isMobile ? "95vw" : "60rem"
      case 1:
        return isMobile ? "95vw" : "40rem"
      case 2:
        return isMobile ? "95vw" : "36rem"
      case 3:
        return isMobile ? "95vw" : "50rem"
      default:
        return isMobile ? "95vw" : "45rem"
    }
  }

  const { showSnackbar } = useSnackbar()
  const [isAplying, setIsAplying] = useState(false)
  const { initiativeApply } = useInitiativeApi()

  const { userFromApi } = useAuthContext()
  const userEmail = userFromApi?.email
  const userSkillsTechnical = userFromApi?.skills.technical ?? []
  const userGitHub = userFromApi?.social.github ?? ""
  const isUserCollaborator = useIsUserCollaborator(initiative, userEmail)

  const handleApplyInitiative = async () => {
    if (isAplying) return

    if (isUserCollaborator) {
      showSnackbar({
        title: "Ya has aplicado",
        message: "Ya has aplicado como colaborador en esta iniciativa",
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

    setIsAplying(true)

    try {
      const response = await initiativeApply(initiative.id, "COLLABORATOR")

      if (!response) {
        showSnackbar({
          title: "Servicio no disponible",
          message: "Servicio no disponible",
          severity: "error",
        })
        throw new Error("Ocurrió un error inesperado al aplicar, intenta de nuevo más tarde.")
      }

      localStorage.setItem("user_collaborating", JSON.stringify([{ email: userEmail, initiativeId: initiative.id }]))

      // showSnackbar({
      //   title: "Postulado",
      //   message: "¡Ahora eres colaborador en esta iniciativa!",
      //   severity: "success",
      // })
      // console.log("success")
      setActiveTab(3)
      onCollaborationChange(true)
    } catch (err) {
      if (err instanceof Error) {
        console.log("err.message", err.message)
        showSnackbar({
          title: "Ups, algo salio mal",
          message: "Ups, algo salio mal",
          severity: "error",
        })
      }
      // setActiveTab(3)
    } finally {
      setIsAplying(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          handleOpen()
        }}
        className="flex m-auto mt-2 font-normal text-xs"
        variant="contained"
      >
        Participar
      </Button>
      <Dialog open={open} onClose={handleClose} className="apply-steps">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            layout
            initial={{ opacity: 0.5, x: 100 }}
            animate={{ opacity: 1, x: 0, width: getModalWidth(activeTab) }}
            exit={{ opacity: 0.5, x: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // style={{ margin: "0 auto" }}
            className="m-auto shadow-xl rounded-2xl overflow-hidden bg-white"
          >
            {activeTab === 0 && (
              <StepIntro initiative={initiative} onNext={() => setActiveTab(1)} onClose={handleClose} />
            )}
            {activeTab === 1 && <StepBenefits onNext={() => setActiveTab(2)} onBack={() => setActiveTab(0)} />}
            {activeTab === 2 && (
              <StepResponsibilities
                isAplying={isAplying}
                onBack={() => setActiveTab(1)}
                onApply={() => handleApplyInitiative()}
              />
            )}
            {activeTab === 3 && <StepConfirmation onClose={handleClose} />}
          </motion.div>
        </AnimatePresence>
      </Dialog>
    </>
  )
}

function StepIntro({
  initiative,
  onNext,
  onClose,
}: {
  initiative: Initiative
  onNext: () => void
  onClose: () => void
}) {
  return (
    <DialogContent>
      <DialogTitle className="grid gap-6 p-6">
        <Typography className="flex font-semibold text-xl justify-center">Necesidades de Colaboración</Typography>
        <Typography className="flex justify-center text-center">
          Esta iniciativa está buscando talentos para fortalecer su equipo. Si tu perfil encaja con estas necesidades,
          ¡te invitamos a postularte!
        </Typography>
      </DialogTitle>

      <DialogContent dividers={true} className="flex p-0 gap-6 p-6 items-center justify-center">
        {initiative.needs.map((need, index: number) => (
          <div key={index} className="">
            <Card key={index} elevation={2} className="w-[16rem]">
              <CardContent sx={{ p: 2.5, textAlign: "center" }}>
                <Avatar
                  src={""}
                  sx={{
                    width: 70,
                    height: 70,
                    mx: "auto",
                    mb: 1.5,
                    border: "3px solid",
                    borderColor: "primary.main",
                  }}
                />

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>
                  Perfil buscado
                </Typography>

                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                    Habilidad General:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                    <Chip
                      // key={profile.generalSkills[0]}
                      label={need.gSkills}
                      size="small"
                      color="primary"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                    Habilidades Técnicas:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                    {need.hardSkills.slice(0, 3).map((skill) => (
                      <Chip key={skill} label={skill} size="small" color="secondary" sx={{ fontSize: "0.7rem" }} />
                    ))}
                    {need.hardSkills.length > 3 && (
                      <Chip
                        label={`+${need.hardSkills.length - 3}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
        >
          Cancelar
        </Button>
        <Button onClick={onNext} variant="contained" className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white">
          Continuar
        </Button>
      </DialogActions>
    </DialogContent>
  )
}

function StepBenefits({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box className="flex flex-col items-center gap-4">
        <Box component="img" src={benefitsImg}></Box>
        <Typography className="text-(--color-primary) font-medium text-sm">
          ¡Grandes Beneficios al Colaborar en "Plataforma de Gobernanza Web3"!
        </Typography>

        <Typography className="font-medium text-sm">
          Al unirte a una iniciativa en OpenLab, no solo contribuyes a proyectos innovadores, sino que también obtienes:
        </Typography>

        <List className="flex flex-col gap-4">
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Recompensas en tokens del proyecto por tu trabajo.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Reconocimiento por tus contribuciones en tu perfil OpenLab.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText
              primary={<>Oportunidad de ser parte de una comunidad activa y construir el futuro.</>}
            ></ListItemText>
          </ListItem>
        </List>
      </Box>
      <DialogActions>
        <Button
          onClick={onBack}
          variant="contained"
          className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
        >
          Atrás
        </Button>
        <Button onClick={onNext} variant="contained" className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white">
          Continuar
        </Button>
      </DialogActions>
    </DialogContent>
  )
}

function StepResponsibilities({
  isAplying,
  onBack,
  onApply,
}: {
  isAplying: boolean
  onBack: () => void
  onApply: () => void
}) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box className="flex flex-col items-center gap-4">
        <Box component="img" src={collaboratorsImg}></Box>
        <Typography className="text-(--color-primary) font-medium text-sm">
          Tus Responsabilidades como Colaborador
        </Typography>

        <Typography className="font-medium text-sm">
          Para garantizar una colaboración exitosa y transparente, considera lo siguiente:
        </Typography>

        <List className="flex flex-col gap-4">
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Compromiso con las tareas que elijas en Dwork.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Comunicación activa con el equipo en Discord.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText
              primary={<>Cumplimiento de los plazos y estándares de calidad del proyecto.</>}
            ></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem] mt-1">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Participación constructiva en la comunidad de la iniciativa.</>}></ListItemText>
          </ListItem>
        </List>
      </Box>
      <DialogActions>
        <Button
          onClick={onBack}
          variant="contained"
          className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
        >
          Atrás
        </Button>
        <Button
          onClick={onApply}
          variant="contained"
          className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white"
          disabled={isAplying}
        >
          <StarsRoundedIcon />
          {isAplying ? "Aplicando..." : "Participar en esta iniciativa"}
          {isAplying && <CircularProgress size={16} color="inherit" />}
        </Button>
      </DialogActions>
    </DialogContent>
  )
}

function StepConfirmation({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box>
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <Lottie loop play animationData={arrowAnimation} style={{ width: "50%", height: "50%" }} />
          <Typography variant="h6" className="text-center font-semibold">
            ¡Tu postulación ha sido enviada!
          </Typography>
          <Typography className="text-center text-gray-500">
            Pronto revisaremos tu aplicación. Te notificaremos por correo electrónico.
          </Typography>
        </div>
      </Box>
      <DialogActions>
        <Button onClick={onClose} variant="contained" className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white">
          Aceptar
        </Button>
      </DialogActions>
    </DialogContent>
  )
}
