import Button from "@mui/material/Button"
import { forwardRef, useState } from "react"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
// import type { Initiative } from "../../../schemas/initiativeSchema"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import CardContent from "@mui/material/CardContent"
import { AVATAR_PROFILE_POSTULATION } from "@/lib/constants"
import Chip from "@mui/material/Chip"
import Card from "@mui/material/Card"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
// import { useSnackbar } from "@/context/SnackbarContext"
// import { useInitiativeApi } from "../../../stores/initiativeStore"
// import { useAuthContext } from "@/hooks/useAuthContext"
// import { useIsUserCollaborator } from "../hooks/useIsUserCollaborator"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { AnimatePresence, motion, type MotionProps } from "motion/react"
import Lottie from "react-lottie-player"
import arrowAnimation from "@/animations/completed-successfully.json"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
// import Fade from "@mui/material/Fade"
import collaboratorsImg from "@/assets/images/initiative-detail/collaborators.svg"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded"
import type { PaperProps } from "@mui/material/Paper"
import type { Initiative } from "@/pages/protected/dashboard/initiative/schemas/initiativeSchema"

export default function CollaborationApplyModal({
  initiative,
}: {
  initiative: Initiative
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // const { showSnackbar } = useSnackbar()
  const [isAplying, setIsAplying] = useState(false)
  // const { initiativeApply } = useInitiativeApi()

  // const { userFromApi } = useAuthContext()
  // const userEmail = userFromApi?.email

  // const isUserCollaborator = useIsUserCollaborator(initiative, userEmail)

  // const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const tabList = [
    { id: "intro", label: "Introducción" },
    { id: "benefits", label: "Beneficios" },
    { id: "responsabilities", label: "Responsabilidades" },
    { id: "confirmation", label: "Confirmación" },
  ]
  const [activeTab, setActiveTab] = useState(0)
  const goToTabById = (id: string) => {
    const index = tabList.findIndex((tab) => tab.id === id)
    if (index !== -1) setActiveTab(index)
  }
  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setActiveTab(newValue)
  // }

  const MotionPaper = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
    const {
      // className,
      children,
      // sx, // opcional
      ...rest
    } = props

    return (
      <AnimatePresence mode="wait">
        <motion.div
          ref={ref}
          // layout
          // initial={{ opacity: 1, width: "auto" }}
          // animate={{ opacity: 1, width: "auto" }}
          // exit={{ opacity: 1, scale: 0.6 }}
          // transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-[blue] w-full"
          // className={(className)} // por si usas tailwind o MUI `className`
          {...(rest as MotionProps)} // 👈 forzamos tipado compatible con framer-motion
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  })

  const handleApplyInitiative = async () => {
    if (isAplying) return

    // if (isUserCollaborator) {
    //   showSnackbar({
    //     title: "Ya has aplicado",
    //     message: "Ya has aplicado como colaborador en esta iniciativa",
    //     severity: "error",
    //   })
    //   return
    // }

    // setIsAplying(true)

    // try {
    //   const response = await initiativeApply(initiative.id, "COLLABORATOR")

    //   if (!response) {
    //     showSnackbar({
    //       title: "Servicio no disponible",
    //       message: "Servicio no disponible",
    //       severity: "error",
    //     })
    //     throw new Error("Ocurrió un error inesperado al aplicar, intenta de nuevo más tarde.")
    //   }

    //   localStorage.setItem("user_collaborating", JSON.stringify([{ email: userEmail, initiativeId: initiative.id }]))

    //   // showSnackbar({
    //   //   title: "Postulado",
    //   //   message: "¡Ahora eres colaborador en esta iniciativa!",
    //   //   severity: "success",
    //   // })
    //   // setShowSuccessMessage(true)
    //   goToTabById("confirmation")
    //   onCollaborationChange(true)
    // } catch (err) {
    //   if (err instanceof Error) {
    //     console.log("err.message", err.message)
    //     showSnackbar({
    //       title: "Ups, algo salio mal",
    //       message: "Ups, algo salio mal",
    //       severity: "error",
    //     })
    //   }
    // } finally {
    //   setIsAplying(false)
    // }

    setIsAplying(false)
  }

  return (
    <>
      <Button
        onClick={() => {
          goToTabById("intro")
          handleOpen()
          // setShowSuccessMessage(false)
        }}
        className="flex m-auto mt-2 font-normal text-xs"
        variant="contained"
      >
        Participar
      </Button>

      <Dialog
        className="m-auto bg-[green]"
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
            key={activeTab}
            layout
            // key="intro" // clave única por sección/tab
            // layout
            // initial={{ opacity: .5, width: "50rem" }}
            // animate={{ opacity: 1, width: "30rem" }}
            // exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-[pink] p-4 transition-[width] duration-800 ease-in-out"
          >
        <DialogContent className="bg-[yellow]">
          {/* <Fade in={open} className="absolute w-3xl top-[50%] left-[50%] transform-[translate(-50%,-50%)] p-6 bg-white rounded-2xl grid gap-6"> */}
          {/* <Box className="grid gap-6 p-10"> */}

          <IconButton
            onClick={() => {
              // setShowSuccessMessage(false)
              handleClose()
            }}
            className="absolute top-2 right-2 text-gray-400"
            size="small"
          >
            <CloseRoundedIcon />
          </IconButton>

          {/* <Box> */}
          {/* <Fade in={activeTab === 0} timeout={400}> */}
          {/* {activeTab === 0 && ( */}
                     <motion.div
            // key="intro" // clave única por sección/tab
            layout
            // initial={{ opacity: 0, width: "auto" }}
            // animate={{ opacity: 1, width: "auto" }}
            // exit={{ opacity: 0, width: "0" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`bg-[#dddddd] p-4 w-2xl transition-[width] duration-800 ease-in-out ${activeTab !== 0 ? "hidden" : ""}`}
          >
              {/* {activeTab} */}
              {/* <div hidden={activeTab !== 0}> */}
              <DialogTitle className="grid gap-6 p-6">
                <Typography className="flex font-semibold text-xl justify-center">
                  Necesidades de Colaboración
                </Typography>
                <Typography className="flex justify-center text-center">
                  Esta iniciativa está buscando talentos para fortalecer su equipo. Si tu perfil encaja con estas
                  necesidades, ¡te invitamos a postularte!
                </Typography>
              </DialogTitle>

              <DialogContent dividers={true} className="flex p-0 gap-6 p-6 items-center justify-center">
                {initiative.needs.map((need, index: number) => (
                  // <div key={index} className="">
                  <Card key={index} elevation={2} className="w-[16rem]">
                    <CardContent sx={{ p: 2.5, textAlign: "center" }}>
                      <Avatar
                        src={AVATAR_PROFILE_POSTULATION}
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
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              color="secondary"
                              sx={{ fontSize: "0.7rem" }}
                            />
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
                  // </div>
                ))}
              </DialogContent>
              <DialogActions className="flex justify-center items-center gap-6 p-6">
                <Button
                  onClick={handleClose}
                  className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
                  variant="contained"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // handleApplyInitiative()
                    // setShowSuccessMessage(true)
                    goToTabById("benefits")
                  }}
                  className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white"
                  variant="contained"
                  // disabled={isAplying}
                >
                  {/* <StarsRoundedIcon />
                      {isAplying ? 'Aplicando...' : 'Participar en esta iniciativa'}
                      {isAplying  && (
                        <CircularProgress size={16} color="inherit" />
                      )} */}
                  Continuar
                </Button>
              </DialogActions>
            </motion.div>
          {/* )} */}
          {/* </div> */}
          {/* )} */}
          {/* </Fade> */}
          {/* </Box> */}

          {/* <Box> */}
          {/* <Fade in={activeTab === 1} timeout={400}> */}
          {/* {activeTab === 1 && ( */}
                     <motion.div
            // key="intro" // clave única por sección/tab
            layout
            // initial={{ opacity: 0, width: "auto" }}
            // animate={{ opacity: 1, width: "auto" }}
            // exit={{ opacity: 0, width: "0" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className={`bg-[#dddddd] p-4 w-xl transition-[width] duration-800 ease-in-out ${activeTab !== 1 ? "hidden" : ""}`}
          >
              {/* <div hidden={activeTab !== 1} className="flex flex-col items-center p-8 gap-6 w-xl"> */}
              <Box component="img" src={collaboratorsImg}></Box>
              <Typography className="text-(--color-primary) font-medium text-sm">
                ¡Grandes Beneficios al Colaborar en "Plataforma de Gobernanza Web3"!
              </Typography>

              <Typography className="font-medium text-sm">
                Al unirte a una iniciativa en OpenLab, no solo contribuyes a proyectos innovadores, sino que también
                obtienes:
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
                  <ListItemText
                    primary={<>Reconocimiento por tus contribuciones en tu perfil OpenLab.</>}
                  ></ListItemText>
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
              <Box className="flex justify-center items-center gap-6 p-6">
                <Button
                  onClick={() => {
                    goToTabById("intro")
                  }}
                  className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
                  variant="contained"
                >
                  Atrás
                </Button>
                <Button
                  onClick={() => {
                    // handleApplyInitiative()
                    // setShowSuccessMessage(true)
                    goToTabById("responsabilities")
                  }}
                  className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white"
                  variant="contained"
                  // disabled={isAplying}
                >
                  Continuar
                </Button>
              </Box>
              {/* <Button onClick={handleClose}>Cancelar</Button>
                  <Button onClick={() => goToTabById('responsabilities')}>Continuar</Button> */}
              {/* </div> */}
              </motion.div>
          {/* )} */}
          {/* </Fade> */}
          {/* </Box> */}

          {/* <Box> */}
          {/* <Fade in={activeTab === 2} timeout={400}> */}
          {activeTab === 2 && (
            // <motion.div
            //   key="responsabilities" // clave única por sección/tab
            //   layout
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   transition={{ duration: 0.4, ease: "easeInOut" }}
            //   className="bg-[#dddddd]"
            // >
            <>
              {/* <div hidden={activeTab !== 2} className="flex flex-col items-center p-8 gap-6 w-xl"> */}
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
                  <ListItemText
                    primary={<>Participación constructiva en la comunidad de la iniciativa.</>}
                  ></ListItemText>
                </ListItem>
              </List>
              <Box className="flex justify-center items-center gap-6 p-6">
                <Button
                  onClick={() => {
                    goToTabById("benefits")
                  }}
                  className="gap-4 mt-2 text-[#404659] bg-[#DCE2F9] disabled:text-white"
                  variant="contained"
                >
                  Atrás
                </Button>
                <Button
                  onClick={() => {
                    handleApplyInitiative()
                    // setShowSuccessMessage(true)
                    // goToTabById('confirmation')
                  }}
                  className="gap-4 mt-2 bg-[#3d7bff] disabled:text-white"
                  variant="contained"
                  disabled={isAplying}
                >
                  <StarsRoundedIcon />
                  {isAplying ? "Aplicando..." : "Participar en esta iniciativa"}
                  {isAplying && <CircularProgress size={16} color="inherit" />}
                </Button>
              </Box>
              {/* <Button onClick={handleClose}>Cancelar</Button>
                  <Button onClick={() => goToTabById('confirmation')}>Continuar</Button> */}
              {/* </div> */}
              {/* </motion.div> */}
            </>
          )}
          {/* </Fade> */}
          {/* </Box> */}

          {/* <Box> */}

          {/* <Fade in={activeTab === 3} timeout={400}> */}
          {activeTab === 3 && (
            // <motion.div
            //   key="confirmation" // clave única por sección/tab
            //   layout
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   transition={{ duration: 0.4, ease: "easeInOut" }}
            //   className="bg-[#dddddd]"
            // >
            <>
              {/* <div hidden={activeTab !== 3}> */}
              <div className="flex flex-col items-center justify-center gap-4 p-4">
                <Lottie loop play animationData={arrowAnimation} style={{ width: "50%", height: "50%" }} />
                <Typography variant="h6" className="text-center font-semibold">
                  ¡Tu postulación ha sido enviada!
                </Typography>
                <Typography className="text-center text-gray-500">
                  Pronto revisaremos tu aplicación. Te notificaremos por correo electrónico.
                </Typography>
                <Button
                  variant="contained"
                  className="bg-[#3d7bff]"
                  onClick={() => {
                    // setShowSuccessMessage(false)
                    handleClose()
                  }}
                >
                  Aceptar
                </Button>
              </div>
              {/* </div> */}
              {/* </motion.div> */}
            </>
          )}
          {/* </Fade> */}
          {/* </Box> */}
        </DialogContent>
        </motion.div>
        </AnimatePresence>
      </Dialog>
    </>
  )
}
