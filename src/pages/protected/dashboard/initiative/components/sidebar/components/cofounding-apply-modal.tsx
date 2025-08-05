import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
import TextField from "@mui/material/TextField"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { useSnackbar } from "@/context/SnackbarContext"
import { useIsUserCofounder } from "../hooks/useIsUserCofounder"
import { UserResponseDTO, type Initiative, type InitiativeFull } from "../../../schemas/initiativeSchema"
import { useAuthContext } from "@/hooks/useAuthContext"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { AnimatePresence, motion } from "motion/react"
import Lottie from "react-lottie-player"
import arrowAnimation from "@/animations/completed-successfully.json"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import { useResponsiveModalWidth } from "../hooks/useResponsiveModalWidth"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
// import type { UserEntity } from "@/interfaces/user"
import logoDiscordImg from "@/assets/images/initiative-detail/logo_discord.svg"
import logoGithubImg from "@/assets/images/initiative-detail/logo_github.svg"
// import logoDeworkImg from '@/assets/images/initiative-detail/logo_dework.png'
// import logoLinkedinImg from '@/assets/images/initiative-detail/logo_linkedin.svg'
import logoInstagramImg from "@/assets/images/initiative-detail/logo_instagram.svg"
import logoLinkedinImg from "@/assets/images/initiative-detail/logo_linkedin.svg"
import logoXImg from "@/assets/images/initiative-detail/logo_x.svg"
import logoFacebookImg from "@/assets/images/initiative-detail/logo_facebook.svg"
// import logoDefaultAvatar2Img from "@/assets/images/initiative-detail/default_avatar_2.png"
import LinkIcon from "@mui/icons-material/Link"
import ButtonBase from "@mui/material/ButtonBase"
import type { UserEntity } from "@/interfaces/user"
import { UpdateUserResponseDTO } from "../../../schemas/userSchema"
import FormHelperText from "@mui/material/FormHelperText"
import { useGitHubValidation } from "../hooks/useGitHubValidation"
// import { ButtonBase } from "@mui/material"
import { engagementEvents } from "@/lib/clarityEvents"

export default function CoFoundingApplyModal({
  initiativeFull,
  announcementId,
  onCollaborationChange,
  onCofoundingChange,
}: {
  initiativeFull: InitiativeFull
  announcementId: number
  onCollaborationChange: (status: boolean) => void
  onCofoundingChange: (status: boolean) => void
}) {
  const [description, setDescription] = useState("")

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    // Handle validations here before open the modal
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
        message: "Ya has aplicado como cofundador en esta postulación",
        severity: "error",
      })
      return
    }

    setLastTab(0)
    // setActiveTab(0)

    if (
      (userFromApi?.social.github && userFromApi?.social.github !== "") ||
      (user?.user.github && user?.user.github !== "") ||
      userAddedGitHub !== ""
    ) {
      setActiveTab(1)
    } else {
      setActiveTab(0)
    }

    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const [lastTab, setLastTab] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const { showSnackbar } = useSnackbar()
  const [isAplying, setIsAplying] = useState(false)
  const { initiativeApplyCofounding } = useInitiativeApi()

  const { userFromApi } = useAuthContext()
  // const userId = userFromApi?.id ?? ""
  const userEmail = userFromApi?.email ?? ""
  const userSkillsGeneral = userFromApi?.skills.general ?? []
  const userSkillsTechnical = userFromApi?.skills.technical ?? []
  // const userGitHub = userFromApi?.social.github ?? ""
  const { isCofounder, isApplicant } = useIsUserCofounder(initiativeFull.initiative, userEmail)
  const { windowWidth } = useResponsiveModalWidth()

  // const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const userId = userFromApi?.id ?? null // ToDo: Auth Context must retrieve non optional/undefined values

  const getModalWidth = (step: number) => {
    const isMobile = windowWidth < 960

    switch (step) {
      case 0:
        return isMobile ? "95vw" : "30rem"
      case 1:
        return isMobile ? "95vw" : "50rem"
      case 3:
        return isMobile ? "95vw" : "32rem"
      default:
        return isMobile ? "95vw" : "45rem"
    }
  }

  const [isGettingUser, setGettingUser] = useState(false)
  const [user, setUser] = useState<UserResponseDTO>()
  const { getUser, updateUser } = useInitiativeApi()
  useEffect(() => {
    const getUserData = async () => {
      if (isGettingUser) return
      if (!userId) return

      setGettingUser(true)

      try {
        const userResponse = await getUser(userId)
        console.log(userResponse)

        const parsed = UserResponseDTO.safeParse(userResponse)
        console.log(parsed)

        if (!parsed.success) {
          showSnackbar({
            title: "Servicio no disponible",
            message: "Servicio no disponible",
            severity: "error",
          })
          // console.error("parse failed:", parsed.error.format())
          console.error("issues detail:", parsed.error.issues)
          throw new Error("Ocurrió un error inesperado al cargar el usuario.")
        }
        console.log("initiative", parsed.data)
        setUser(parsed.data)
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
        setGettingUser(false)
      }
    }

    getUserData()
  }, [])

  // Add GitHub requests
  const [isAddingGitHub, setIsAddingGitHub] = useState(false)
  // const [user, setUser] = useState<UserResponseDTO | undefined>(undefined)
  // const [updatedUser, setUpdatedUser] = useState<UpdateUserResponseDTO>()
  // const { getUser, updateUser } = useInitiativeApi()
  const [userAddedGitHub, setUserAddedGitHub] = useState("")
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

        setLastTab(0)
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

  const handleApplyCoFounding = async () => {
    if (isAplying) return
    if (!userFromApi) return

    // Get the user again and validate if it has GitHub
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

      if (parsedGetUser.data.user.github && parsedGetUser.data.user.github !== "") {
        // if (
        //   userFromApi?.social.github &&
        //   userFromApi?.social.github === "" &&
        //   user?.user.github &&
        //   user?.user.github === "" &&
        //   userAddedGitHub === ""
        // ) {
        //   showSnackbar({
        //     title: "Información requerida",
        //     message: "Para postularte es requerido tener un perfil de GitHub", // ToDo: invite the user to edit their profile from a modal
        //     severity: "error",
        //   })
        //   return
        // }

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
          const response = await initiativeApplyCofounding(
            announcementId,
            description,
            userSkillsGeneral[0],
            userSkillsTechnical,
          )

          if (!response) {
            showSnackbar({
              title: "Servicio no disponible",
              message: "Servicio no disponible",
              severity: "error",
            })
            throw new Error("Ocurrió un error inesperado al aplicar, intenta de nuevo más tarde.")
          }

          onCofoundingChange(true)
          setLastTab(0)
          setActiveTab(1)

          engagementEvents.postulationSubmitted({
            initiativeId: initiativeFull.initiative.id.toString(),
            title: initiativeFull.initiative.title,
            role: "COFOUNDER",
          })

          localStorage.setItem(
            "user_cofounding",
            JSON.stringify([{ email: userEmail, initiativeId: initiativeFull.initiative.id }]),
          )
        } catch (err) {
          if (err instanceof Error) {
            console.log("err.message", err.message)
            showSnackbar({
              title: "Ups, algo salio mal",
              message: "Ups, algo salio mal",
              severity: "error",
            })
          }
        }
      } else {
        setLastTab(1)
        setActiveTab(0)
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

    // finally {
    //   setIsAplying(false)
    // }
  }

  return (
    <>
      <Button onClick={handleOpen} className="ml-0 text-xs font-normal" variant="contained">
        Aplicar
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
              <StepAddGitHub
                isAddingGitHub={isAddingGitHub}
                onBack={() => {
                  // setLastTab(4)
                  // setActiveTab(0)
                  handleClose()
                }}
                onAddGitHub={(gitHubUrl: string) => {
                  // setActiveTab(3)
                  handleAddGitHub(gitHubUrl)
                }}
              />
            )}
            {activeTab === 1 && user && (
              <StepIntro
                initiative={initiativeFull.initiative}
                announcementId={announcementId}
                description={description}
                user={user}
                userFromApi={userFromApi}
                isCofounder={isCofounder}
                isApplicant={isApplicant}
                userSkillsGeneral={userSkillsGeneral}
                userSkillsTechnical={userSkillsTechnical}
                setDescription={setDescription}
                isAplying={isAplying}
                onClose={handleClose}
                onApply={() => {
                  // setActiveTab(3)
                  handleApplyCoFounding()
                }}
              />
            )}
            {activeTab === 2 && <StepConfirmation onClose={handleClose} />}
          </motion.div>
        </AnimatePresence>
      </Dialog>
    </>
  )
}

function StepIntro({
  initiative,
  announcementId,
  description,
  user,
  userFromApi,
  isAplying,
  isCofounder,
  isApplicant,
  userSkillsGeneral,
  userSkillsTechnical,
  setDescription,
  onClose,
  onApply,
}: {
  initiative: Initiative
  announcementId: number
  description: string
  user: UserResponseDTO
  userFromApi: UserEntity | null
  isAplying: boolean
  isCofounder: boolean
  isApplicant: boolean
  userSkillsGeneral: string[]
  userSkillsTechnical: string[]
  setDescription: (description: string) => void
  onClose: () => void
  onApply: () => void
}) {
  return (
    <Box className="flex flex-col w-full">
      <DialogTitle className="grid gap-6 p-6">
        <Typography className="flex font-semibold text-xl justify-center">Necesidades de Colaboración</Typography>
        <Typography className="flex justify-center text-center">
          Esta iniciativa está buscando talentos para fortalecer su equipo.
          <br />
          ¡Te invitamos a postularte!
        </Typography>
      </DialogTitle>

      <DialogContent dividers={true} className="flex gap-0 p-6  w-full max-h-[64vh]">
        <Box>
          {initiative.needs.map((need, index: number) => (
            <Box key={index}>
              {/* <span>need id {need.id}<br/></span>
              <span>announcementId {announcementId}</span> */}
              {need.id === announcementId && ""}
            </Box>
          ))}
        </Box>
        <Box className="flex flex-col w-full items-center gap-2">
          <Avatar className="w-20 h-20" alt="Travis Howard" src={user.user.profilePic} />
          <Typography className="flex font-semibold text-xl justify-center">{user.user.name}</Typography>
          <Typography className="flex justify-center text-center">{userFromApi?.email}</Typography>
          <Box>
            {user.user.discord && (
              <ButtonBase href={user.user.discord} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoDiscordImg}></Box>
              </ButtonBase>
            )}
            {user.user.github && (
              <ButtonBase href={user.user.github} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoGithubImg}></Box>
              </ButtonBase>
            )}
            {user.user.linkd && (
              <ButtonBase href={user.user.linkd} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoLinkedinImg}></Box>
              </ButtonBase>
            )}
            {user.user.instagram && (
              <ButtonBase href={user.user.instagram} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoInstagramImg}></Box>
              </ButtonBase>
            )}
            {user.user.facebook && (
              <ButtonBase href={user.user.facebook} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoFacebookImg}></Box>
              </ButtonBase>
            )}
            {user.user.twitter && (
              <ButtonBase href={user.user.twitter} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoXImg}></Box>
              </ButtonBase>
            )}
            {user.user.other && (
              <ButtonBase href={user.user.other} target="_blank">
                <LinkIcon></LinkIcon>
              </ButtonBase>
            )}
          </Box>
          {!user.user.description ? (
            <Typography className="flex justify-center text-center italic text-gray-500">
              ¡Aún no tienes una descripción de tu perfil!
            </Typography>
          ) : (
            <Typography className="flex justify-center text-center">{user.user.description}</Typography>
          )}

          <Typography className="font-normal text-md">Habilidades generales:</Typography>
          <div className="flex justify-center flex-wrap gap-2">
            {userSkillsGeneral.length > 0 ? (
              userSkillsGeneral.map((userSkill, index: number) => (
                <Chip key={index} label={userSkill} className="rounded-md" />
              ))
            ) : (
              <Typography className="flex justify-center text-center italic text-gray-500">
                No tienes habilidades generales
              </Typography>
            )}
          </div>

          <Typography className="font-normal text-md">Habilidades técnicas:</Typography>
          <div className="flex justify-center flex-wrap gap-2">
            {userSkillsTechnical.length > 0 ? (
              userSkillsTechnical.map((userSkill, index) => (
                <Chip key={index} label={userSkill} className="rounded-md" />
              ))
            ) : (
              <Typography className="flex justify-center text-center italic text-gray-500">
                No tienes habilidades técnicas
              </Typography>
            )}
          </div>

          <TextField
            className="w-full mt-4"
            label="Presentación"
            placeholder="Describe por qué quieres participar en esta iniciativa"
            variant="outlined"
            multiline
            minRows={2}
            maxRows={8}
            autoFocus
            value={description}
            onChange={(e) => {
              const val = e.target.value.slice(0, 250)
              setDescription(val)
            }}
          />
          <div className="text-center text-xs">{description.length}/250</div>
        </Box>
      </DialogContent>

      <DialogActions className="flex justify-center p-4 gap-4">
        <Button onClick={onClose} variant="contained" className="m-0 text-[#404659] bg-[#DCE2F9] disabled:text-white">
          Cancelar
        </Button>
        {/* <Button onClick={onNext} variant="contained" className="gap-4 bg-[#3d7bff] disabled:text-white">
          Continuar
        </Button> */}
        <Button
          onClick={onApply}
          className="m-0 gap-2 flex items-center bg-[#3d7bff] disabled:text-white"
          variant="contained"
          // loadingPosition="end"
          // loading={isAplying || loading}
          disabled={isAplying}
          // startIcon={<StarsRoundedIcon />}
        >
          <StarsRoundedIcon />
          {isAplying
            ? "Verificando estado..."
            : isCofounder
              ? "Ya eres Cofundador"
              : isApplicant
                ? "Solicitud en revisión"
                : "Postularme a cofundador"}
          {isAplying || (isAplying && <CircularProgress size={16} color="inherit" />)}
        </Button>
      </DialogActions>
    </Box>
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
          Para aplicar, es requerido agregar tu perfil de GitHub
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
          Cancelar
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

function StepConfirmation({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent className="flex flex-col items-center">
      <Box>
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          {/* <div className="flex flex-col items-center justify-center gap-4 p-4"> */}
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
            // onClick={() => setShowSuccessMessage(false)}
            onClick={() => {
              // setShowSuccessMessage(false)
              // handleClose()
            }}
          >
            Aceptar
          </Button>
          {/* </div> */}
        </div>
      </Box>
      <DialogActions>
        <Button onClick={onClose} variant="contained" className="gap-4 bg-[#3d7bff] disabled:text-white">
          Aceptar
        </Button>
      </DialogActions>
    </DialogContent>
  )
}
