import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import StarsRoundedIcon from "@mui/icons-material/StarsRounded"
import TextField from "@mui/material/TextField"
import { useInitiativeApi } from "../../../stores/initiativeStore"
import { useSnackbar } from "@/context/SnackbarContext"
import { useIsUserCofounder } from "../hooks/useIsUserCofounder"
import { type Announcement, type InitiativeFull } from "../../../schemas/initiativeSchema"
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
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { UserProfileResponseDTO } from "../../../schemas/userProfileSchema"

export default function CoFoundingApplyModal({
  initiativeFull,
  announcement,
  onCollaborationChange,
  onCofoundingChange,
}: {
  initiativeFull: InitiativeFull
  announcement: Announcement
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
        message: "Ya has aplicado como cofundador",
        severity: "error",
      })
      return
    }

    setLastTab(0)
    // setActiveTab(0)

    if (
      (userFromApi?.social.github && userFromApi?.social.github !== "") ||
      (userProfile?.github && userProfile.github !== "") ||
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

  // const [isGettingUser, setGettingUser] = useState(false)
  // const [user, setUser] = useState<UserResponseDTO>()
  // const { getUser, updateUser } = useInitiativeApi()
  // useEffect(() => {
  //   const getUserData = async () => {
  //     if (isGettingUser) return
  //     if (!userId) return

  //     setGettingUser(true)

  //     try {
  //       const userResponse = await getUser(userId)
  //       console.log(userResponse)

  //       const parsed = UserResponseDTO.safeParse(userResponse)
  //       console.log(parsed)

  //       if (!parsed.success) {
  //         showSnackbar({
  //           title: "Servicio no disponible",
  //           message: "Servicio no disponible",
  //           severity: "error",
  //         })
  //         // console.error("parse failed:", parsed.error.format())
  //         console.error("issues detail:", parsed.error.issues)
  //         throw new Error("Ocurrió un error inesperado al cargar el usuario.")
  //       }
  //       console.log("initiative", parsed.data)
  //       setUser(parsed.data)
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         console.log("err.message", err.message)
  //         showSnackbar({
  //           title: "Ups, algo salio mal",
  //           message: "Ups, algo salio mal",
  //           severity: "error",
  //         })
  //       }
  //     } finally {
  //       setGettingUser(false)
  //     }
  //   }

  //   getUserData()
  // }, [])

  // Get current profile user to get active vote and GitHub
  // ToDo: this auto request must not be on clicking open modal to prevent multi requests?
  const [isGettingUserProfile, setGettingUserProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfileResponseDTO>()
  const { updateUser, getUserProfile } = useInitiativeApi()
  useEffect(() => {
    const getUserProfileData = async () => {
      if (isGettingUserProfile) return

      setGettingUserProfile(true)

      try {
        const userProfileResponse = await getUserProfile()
        console.log(userProfileResponse)

        const parsed = UserProfileResponseDTO.safeParse(userProfileResponse)
        console.log(parsed)

        if (!parsed.success) {
          showSnackbar({
            title: "Servicio no disponible",
            message: "Servicio no disponible",
            severity: "error",
          })
          // console.error("parse failed:", parsed.error.format())
          console.error("issues detail:", parsed.error.issues)
          throw new Error("Ocurrió un error inesperado al conseguir datos del usuario.")
        }
        console.log("initiative", parsed.data)
        setUserProfile(parsed.data)
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
        setGettingUserProfile(false)
      }
    }

    getUserProfileData()
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
      const userProfileResponse = await getUserProfile()
      console.log(userProfileResponse)

      const parsedGetUserProfile = UserProfileResponseDTO.safeParse(userProfileResponse)
      console.log("parsedGetUser", parsedGetUserProfile)

      if (!parsedGetUserProfile.success) {
        showSnackbar({
          title: "Servicio no disponible",
          message: "Servicio no disponible",
          severity: "error",
        })
        // console.error("parse failed:", parsed.error.format())
        console.error("issues detail:", parsedGetUserProfile.error.issues)
        throw new Error("Ocurrió un error inesperado al cargar el usuario.")
      }
      // console.log("initiative", parsed.data)
      // setUser(parsed.data)

      if (parsedGetUserProfile.data.github && parsedGetUserProfile.data.github !== "") {
        setUserProfile(parsedGetUserProfile.data)
      } else {
        const responseUpdateUser = await updateUser({
          id: parsedGetUserProfile.data.id,
          name: parsedGetUserProfile.data.name,
          email: userFromApi.email,
          profilePic: parsedGetUserProfile.data.profilePic,
          wallet: userFromApi.wallet,
          github: gitHubUrl,
          linkd: parsedGetUserProfile.data.linkd,
          discord: parsedGetUserProfile.data.discord,
          facebook: parsedGetUserProfile.data.facebook,
          twitter: parsedGetUserProfile.data.twitter,
          instagram: parsedGetUserProfile.data.instagram,
          other: parsedGetUserProfile.data.other,
          skills: parsedGetUserProfile.data.skills.map((skill) => skill.name),
          description: parsedGetUserProfile.data.description,
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

    if (!userSkillsGeneral || userSkillsGeneral.length === 0) {
      showSnackbar({
        title: "Es necesario tener habilidades generales",
        message: "Para postularte necesitas tener habilidades generales",
        severity: "error",
      })
      return
    }

    // Get the user again and validate if it has GitHub
    setIsAplying(true)

    try {
      const userProfileResponse = await getUserProfile()
      console.log(userProfileResponse)

      const parsedGetUserProfile = UserProfileResponseDTO.safeParse(userProfileResponse)
      console.log("parsedGetUserProfile", parsedGetUserProfile)

      if (!parsedGetUserProfile.success) {
        showSnackbar({
          title: "Servicio no disponible",
          message: "Servicio no disponible",
          severity: "error",
        })
        // console.error("parse failed:", parsed.error.format())
        console.error("issues detail:", parsedGetUserProfile.error.issues)
        throw new Error("Ocurrió un error inesperado al cargar el usuario.")
      }

      if (parsedGetUserProfile.data.github && parsedGetUserProfile.data.github !== "") {
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
            announcement.id,
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

          onCofoundingChange(true) // ToDo: check initiative is updating in order to block the modal to prevent to apply again
          setLastTab(1)
          setActiveTab(2)

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
            {activeTab === 1 && userProfile && (
              <StepIntro
                // initiative={initiativeFull.initiative}
                announcement={announcement}
                description={description}
                userProfile={userProfile}
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
  // initiative,
  announcement,
  description,
  userProfile,
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
  // initiative: Initiative
  announcement: Announcement
  description: string
  userProfile: UserProfileResponseDTO
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

      <DialogContent dividers={true} className="flex gap-6 p-6 items-center w-full max-h-[64vh]">
        <Box>
          {/* {initiative.announcements.map((need, index: number) => ( */}
          {/* <Box key={index}> */}
          <Card elevation={2} className="w-[16rem]">
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
                    label={announcement.gSkill}
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
                  {announcement.hardSkills.slice(0, 3).map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="secondary" sx={{ fontSize: "0.7rem" }} />
                  ))}
                  {announcement.hardSkills.length > 3 && (
                    <Chip
                      label={`+${announcement.hardSkills.length - 3}`}
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
          {/* </Box>
            {need.id === announcementId && need.id} */}
          {/* ))} */}
        </Box>
        <Box className="flex flex-col w-full items-center gap-2">
          <Avatar className="w-20 h-20" alt="" src={userProfile.profilePic ? userProfile.profilePic : ""} />
          <Typography className="flex font-semibold text-xl justify-center">{userProfile.name}</Typography>
          <Typography className="flex justify-center text-center">{userFromApi?.email}</Typography>
          <Box>
            {userProfile.discord && (
              <ButtonBase href={userProfile.discord} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoDiscordImg}></Box>
              </ButtonBase>
            )}
            {userProfile.github && (
              <ButtonBase href={userProfile.github} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoGithubImg}></Box>
              </ButtonBase>
            )}
            {userProfile.linkd && (
              <ButtonBase href={userProfile.linkd} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoLinkedinImg}></Box>
              </ButtonBase>
            )}
            {userProfile.instagram && (
              <ButtonBase href={userProfile.instagram} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoInstagramImg}></Box>
              </ButtonBase>
            )}
            {userProfile.facebook && (
              <ButtonBase href={userProfile.facebook} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoFacebookImg}></Box>
              </ButtonBase>
            )}
            {userProfile.twitter && (
              <ButtonBase href={userProfile.twitter} target="_blank">
                <Box component="img" className="w-6 h-6 bg-white p-1" src={logoXImg}></Box>
              </ButtonBase>
            )}
            {userProfile.other && (
              <ButtonBase href={userProfile.other} target="_blank">
                <LinkIcon></LinkIcon>
              </ButtonBase>
            )}
          </Box>
          {!userProfile.description ? (
            <Typography className="flex justify-center text-center italic text-gray-500">
              ¡Aún no tienes una descripción de tu perfil!
            </Typography>
          ) : (
            <Typography className="flex justify-center text-center">{userProfile.description}</Typography>
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
                : "Postularme como cofundador"}
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
          <Lottie play animationData={arrowAnimation} style={{ width: "50%", height: "50%" }} />
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
