// Refactor del modal con animación fluida entre pasos

import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { AnimatePresence, motion } from "framer-motion"
import { useSnackbar } from "@/context/SnackbarContext"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { useIsUserCollaborator } from "../hooks/useIsUserCollaborator"
import { UserResponseDTO, type Initiative } from "../../../schemas/initiativeSchema"
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
import { useResponsiveModalWidth } from "../hooks/useResponsiveModalWidth"
import logoGithubImg from "@/assets/images/initiative-detail/logo_github.svg"
import { UpdateUserResponseDTO } from "../../../schemas/userSchema"
// import GitHubInput from "../common/GitHubInput.OLD"
import { useGitHubValidation } from "../hooks/useGitHubValidation"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import { engagementEvents } from "@/lib/clarityEvents"
import { InitiativeState } from "@/interfaces/general-enum"

export default function CollaborationApplyModal({
  initiative,
  onCollaborationChange,
}: {
  initiative: Initiative
  onCollaborationChange: (status: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const [lastTab, setLastTab] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const [userAddedGitHub, setUserAddedGitHub] = useState("")

  const handleOpen = () => {
    setLastTab(0)
    setActiveTab(0)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const { showSnackbar } = useSnackbar()
  const [isAplying, setIsAplying] = useState(false)
  const { initiativeApply } = useInitiativeApi()

  const { userFromApi } = useAuthContext()
  const userEmail = userFromApi?.email
  // const userSkillsTechnical = userFromApi?.skills.technical ?? []
  // const userGitHub = userFromApi?.social.github ?? ""
  const isUserCollaborator = useIsUserCollaborator(initiative, userEmail)
  const { windowWidth } = useResponsiveModalWidth()

  const getModalWidth = (step: number) => {
    const isMobile = windowWidth < 960

    switch (step) {
      case 0:
        return isMobile ? "95vw" : "54rem"
      case 1:
        return isMobile ? "95vw" : "32rem"
      case 2:
        return isMobile ? "95vw" : "40rem"
      case 3:
        return isMobile ? "95vw" : "30rem"
      case 4:
        return isMobile ? "95vw" : "30rem"
      default:
        return isMobile ? "95vw" : "45rem"
    }
  }

  // Add GitHub requests
  const [isAddingGitHub, setIsAddingGitHub] = useState(false)
  const [user, setUser] = useState<UserResponseDTO | undefined>(undefined)
  // const [updatedUser, setUpdatedUser] = useState<UpdateUserResponseDTO>()
  const { getUser, updateUser } = useInitiativeApi()
  const handleAddGitHub = async (gitHubUrl: string) => {
    if (isAddingGitHub) return
    if (!userFromApi) {
      showSnackbar({
        title: "Usuario no existe",
        message: "Usuario no existe",
        severity: "error",
      })
      return
    }

    setIsAddingGitHub(true)

    try {
      const userResponse = await getUser(userFromApi.id)
      console.log(userResponse)

      const parsedGetUser = UserResponseDTO.safeParse(userResponse)
      console.log("parsedGetUser", parsedGetUser)

      if (!parsedGetUser.success) {
        showSnackbar({
          title: "Servicio no disponible",
          message: "Servicio no disponible",
          severity: "error",
        })
        // console.error("parse failed:", parsed.error.format())
        console.error("issues detail:", parsedGetUser.error.issues)
        throw new Error("Ocurrió un error inesperado al cargar el usuario.")
      }
      // console.log("initiative", parsed.data)
      // setUser(parsed.data)

      if (parsedGetUser.data.user.github && parsedGetUser.data.user.github !== "") {
        setUser(parsedGetUser.data)
      } else {
        const responseUpdateUser = await updateUser({
          id: parsedGetUser.data.user.id,
          name: parsedGetUser.data.user.name,
          email: userFromApi.email,
          profilePic: parsedGetUser.data.user.profilePic,
          wallet: userFromApi.wallet,
          github: gitHubUrl,
          linkd: parsedGetUser.data.user.linkd,
          discord: parsedGetUser.data.user.discord,
          facebook: parsedGetUser.data.user.facebook,
          twitter: parsedGetUser.data.user.twitter,
          instagram: parsedGetUser.data.user.instagram,
          other: parsedGetUser.data.user.other,
          skills: parsedGetUser.data.user.skills,
          description: parsedGetUser.data.user.description,
        })

        const parsedUpdatedUser = UpdateUserResponseDTO.safeParse(responseUpdateUser)
        console.log(parsedUpdatedUser)
        console.log("parsedUpdatedUser", parsedUpdatedUser)

        if (!parsedUpdatedUser.success) {
          showSnackbar({
            title: "Servicio no disponible",
            message: "Servicio no disponible",
            severity: "error",
          })

          console.error("issues detail:", parsedUpdatedUser.error.issues)
          throw new Error("Ocurrió un error inesperado al conseguir el usuario")
        }

        // localStorage.setItem("user_collaborating", JSON.stringify([{ email: userEmail, initiativeId: initiative.id }]))

        setUserAddedGitHub(parsedUpdatedUser.data.github)

        setLastTab(4)
        setActiveTab(1)
        // onCollaborationChange(true)
        // setUpdatedUser(parsedUpdatedUser.data)
        showSnackbar({
          title: "El GitHub del esuario ha sido actualizado",
          message: "GitHub actualizado",
          severity: "success",
        })
      }
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

  const handleApplyInitiative = async () => {
    if (isAplying) return

    if (isUserCollaborator) {
      showSnackbar({
        title: "Ya has aplicado",
        message: "Ya eres colaborador en esta iniciativa",
        severity: "error",
      })
      return
    }

    if (
      (userFromApi?.social.github && userFromApi?.social.github === "") &&
      (user?.user.github && user?.user.github === "") &&
      userAddedGitHub === ""
      // (userFromApi?.social.github && userFromApi?.social.github !== "") ||
      // (user?.user.github && user?.user.github !== "") ||
      // userAddedGitHub !== ""
    ) {
      setActiveTab(4)
      // showSnackbar({
      //   title: "Información requerida",
      //   message: "Para aplicar es requerido tener un perfil de GitHub", // ToDo: invite the user to edit their profile from a modal
      //   severity: "error",
      // })
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

      engagementEvents.postulationSubmitted({
        initiativeId: initiative.id.toString(),
        title: initiative.title,
        role: "COLLABORATOR",
      })

      localStorage.setItem("user_collaborating", JSON.stringify([{ email: userEmail, initiativeId: initiative.id }]))

      setLastTab(2)
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
        className="flex m-auto font-normal text-xs"
        variant="contained"
      >
        Participar
      </Button>
      <Dialog open={open} onClose={handleClose} className="apply-steps">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            layout
            initial={{ opacity: 0.8, x: 0, width: getModalWidth(lastTab) }}
            animate={{ opacity: 1, x: 0, width: getModalWidth(activeTab) }}
            exit={{ opacity: 0.8, x: 0, width: getModalWidth(activeTab) }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="m-auto shadow-xl rounded-2xl overflow-hidden bg-white flex flex-col items-center"
          >
            {activeTab === 0 && (
              <StepIntro
                initiative={initiative}
                onNext={() => {
                  setLastTab(0)
                  if (
                    (userFromApi?.social.github && userFromApi?.social.github !== "") ||
                    (user?.user.github && user?.user.github !== "") ||
                    userAddedGitHub !== ""
                  ) {
                    setActiveTab(1)
                  } else {
                    setActiveTab(4)
                  }
                }}
                onClose={handleClose}
              />
            )}
            {activeTab === 1 && (
              <StepBenefits
                initiative={initiative}
                onNext={() => {
                  setLastTab(1)
                  setActiveTab(2)
                }}
                onBack={() => {
                  setLastTab(1)
                  setActiveTab(0)
                }}
              />
            )}
            {activeTab === 2 && (
              <StepResponsibilities
                isAplying={isAplying}
                onBack={() => {
                  setLastTab(2)
                  setActiveTab(1)
                }}
                onApply={() => {
                  // setActiveTab(3)
                  handleApplyInitiative()
                }}
              />
            )}
            {activeTab === 3 && <StepConfirmation initiative={initiative} onClose={handleClose} />}
            {activeTab === 4 && (
              <StepAddGitHub
                isAddingGitHub={isAddingGitHub}
                onBack={() => {
                  setLastTab(4)
                  setActiveTab(2)
                }}
                onAddGitHub={(gitHubUrl: string) => {
                  // setActiveTab(3)
                  handleAddGitHub(gitHubUrl)
                }}
              />
            )}
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
    <Box className="flex flex-col w-full">
      <DialogTitle className="grid gap-6 p-6">
        <Typography className="flex font-semibold text-xl justify-center items-center text-center">
          Necesidades de Colaboración
        </Typography>
        <Typography className="flex justify-center text-center">
          Esta iniciativa está buscando talentos para fortalecer su equipo.
          <br />
          Si tu perfil encaja con estas necesidades, ¡te invitamos a postularte!
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers={true}
        className="flex flex-wrap p-0 gap-6 p-6 items-center justify-center overflow-auto max-h-[46vh]"
      >
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

      <DialogActions className="p-4 gap-4">
        <Button onClick={onClose} variant="contained" className="m-0 text-[#404659] bg-[#DCE2F9] disabled:text-white">
          Cancelar
        </Button>
        <Button onClick={onNext} variant="contained" className="m-0 bg-[#3d7bff] disabled:text-white">
          Continuar
        </Button>
      </DialogActions>
    </Box>
  )
}

function StepBenefits({
  initiative,
  onNext,
  onBack,
}: {
  initiative: Initiative
  onNext: () => void
  onBack: () => void
}) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box className="flex flex-col items-center gap-4">
        <Box component="img" src={benefitsImg}></Box>
        <Typography className="text-(--color-primary) font-medium text-md">
          ¡Grandes Beneficios al Colaborar en <span className="font-semibold">{initiative.title}</span>!
        </Typography>

        <Typography className="font-medium">
          Al unirte a una iniciativa en OpenLab, no solo contribuyes a proyectos innovadores, sino que también obtienes:
        </Typography>

        <List className="flex flex-col gap-4">
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Recompensas en tokens del proyecto por tu trabajo.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Reconocimiento por tus contribuciones en tu perfil OpenLab.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText
              primary={<>Oportunidad de ser parte de una comunidad activa y construir el futuro.</>}
            ></ListItemText>
          </ListItem>
        </List>
      </Box>
      <DialogActions className="p-4 gap-4">
        <Button onClick={onBack} variant="contained" className="m-0 text-[#404659] bg-[#DCE2F9] disabled:text-white">
          Atrás
        </Button>
        <Button onClick={onNext} variant="contained" className="m-0 bg-[#3d7bff] disabled:text-white">
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
        <Typography className="text-(--color-primary) font-medium text-md">
          Tus Responsabilidades como Colaborador
        </Typography>

        <Typography className="font-medium">
          Para garantizar una colaboración exitosa y transparente, considera lo siguiente:
        </Typography>

        <List className="flex flex-col gap-4">
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Compromiso con las tareas que elijas en Dwork.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Comunicación activa con el equipo en Discord.</>}></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText
              primary={<>Cumplimiento de los plazos y estándares de calidad del proyecto.</>}
            ></ListItemText>
          </ListItem>
          <ListItem className="p-0 items-center">
            <ListItemIcon className="min-w-[1rem]">
              <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
            </ListItemIcon>
            <ListItemText primary={<>Participación constructiva en la comunidad de la iniciativa.</>}></ListItemText>
          </ListItem>
        </List>
      </Box>
      <DialogActions className="p-4 gap-4">
        <Button onClick={onBack} variant="contained" className="m-0 text-[#404659] bg-[#DCE2F9] disabled:text-white">
          Atrás
        </Button>
        <Button
          onClick={onApply}
          variant="contained"
          className="m-0 gap-2 bg-[#3d7bff] disabled:text-white"
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

function StepAddGitHub({
  isAddingGitHub,
  onBack,
  onAddGitHub,
}: {
  isAddingGitHub: boolean
  onBack: () => void
  onAddGitHub: (gitHubUrl: string) => void
}) {
  // Validate input GitHub
  const { githubUrl, error, isValid, setGithubUrl } = useGitHubValidation()
  const handleSubmitGitHub = () => {
    if (!isValid) return
    onAddGitHub(githubUrl)
  }

  return (
    <DialogContent className="flex flex-col items-center">
      <Box className="flex flex-col items-center gap-4">
        <Box component="img" src={logoGithubImg} className="w-12"></Box>
        <Typography className="text-(--color-primary) font-medium text-sm">
          Para continuar, es requerido agregar tu perfil de GitHub
        </Typography>
        <TextField
          label="Enlace de GitHub"
          size="small"
          variant="outlined"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          error={!!error}
          // helperText={error || "Ejemplo: https://github.com/usuario"}
          fullWidth
        />
        <FormHelperText className="text-center mt-[-.5rem]" error={!!error}>
          {error || "Ejemplo: https://github.com/usuario"}
        </FormHelperText>
      </Box>
      <DialogActions className="p-4 pb-0 gap-4">
        <Button onClick={onBack} variant="contained" className="m-0 text-[#404659] bg-[#DCE2F9] disabled:text-white">
          Atrás
        </Button>
        <Button
          // onClick={onAddGitHub}
          onClick={handleSubmitGitHub}
          variant="contained"
          className="m-0 gap-2 bg-[#3d7bff] disabled:text-white"
          disabled={isAddingGitHub}
        >
          {/* <StarsRoundedIcon /> */}
          <Box component="img" src={logoGithubImg} className="w-4 filter brightness-1000"></Box>
          {isAddingGitHub ? "Agregando..." : "Agregar GitHub"}
          {isAddingGitHub && (
            <CircularProgress size={16} color="inherit" />
            // <Box component="img" className="w-6 h-6 bg-white p-1" src={logoGithubImg}></Box>
          )}
        </Button>
      </DialogActions>
    </DialogContent>
  )
}

function StepConfirmation({ initiative, onClose }: { initiative: Initiative; onClose: () => void }) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box>
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <Lottie loop play animationData={arrowAnimation} style={{ width: "50%", height: "50%" }} />
          {initiative.state === InitiativeState.APPROVED ? (
            <Box className="flex flex-col gap-4">
              <Typography variant="h6" className="text-center font-semibold">
                ¡Te has registrado con éxito para participar en la iniciativa
                <span className="text-(--color-primary) font-semibold"> {initiative.title}</span>!
              </Typography>
              <Typography className="text-center text-gray-500">
                ¡Te damos la bienvenida al equipo! Ahora puedes acceder directamente a Dwork para ver las tareas y
                empezar a contribuir.
              </Typography>
            </Box>
          ) : (
            <Box className="flex flex-col gap-4">
              <Typography variant="h6" className="text-center font-semibold">
                ¡Te has registrado con éxito para participar en la iniciativa
                <span className="text-(--color-primary) font-semibold"> {initiative.title}</span>!
              </Typography>
              <Typography className="text-center text-gray-500">
                ¡Gracias por tu interés! Te invitamos a mantenerte al tanto de las actualizaciones de la iniciativa. Así
                cuando sea aprobada y activada, podrás acceder a sus herramientas de colaboración y empezar a
                contribuir.
              </Typography>
            </Box>
          )}
        </div>
      </Box>
      <DialogActions className="p-4 gap-4">
        <Button onClick={onClose} variant="contained" className="m-0 bg-[#3d7bff] disabled:text-white">
          Aceptar
        </Button>
      </DialogActions>
    </DialogContent>
  )
}
