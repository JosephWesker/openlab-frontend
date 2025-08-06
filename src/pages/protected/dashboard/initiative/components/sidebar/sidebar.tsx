import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CollaborationApplyModal from "./components/collaboration-apply-modal"
import CofoundingApplyModal from "./components/cofounding-apply-modal"
import type { Announcement, Collaborator, Initiative, InitiativeFull } from "../../schemas/initiativeSchema"
import Chip from "@mui/material/Chip"
import InvestApplyModal from "./components/invest-apply-modal"
import { useInitiativeUsers } from "@/hooks/useInitiativeUsers"
import { GovernanceLinks, UserRole } from "@/interfaces/general-enum"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { useUpdateInitiative } from "./hooks/useUpdateInitiativeOnApply"
import Typography from "@mui/material/Typography"
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded"
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded"
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded"
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded"
import WalletRoundedIcon from "@mui/icons-material/WalletRounded"
import cryptoWalletImg from "@/assets/images/initiative-detail/cryptowallets.svg"
import cofoundersImg from "@/assets/images/initiative-detail/cofounders.svg"
import collaboratorsImg from "@/assets/images/initiative-detail/collaborators.svg"
import investorsImg from "@/assets/images/initiative-detail/investors.svg"
import ChipWithTooltip from "./common/ChipWithTooltip"
// import { useUpdateUserApplications } from "./hooks/useUpdateUserApplications"
// import ButtonBase from "@mui/material/ButtonBase"
import UserProfileCollabModal from "./components/user-profile-modal"

export default function Sidebar({ initiativeFull }: { initiativeFull: InitiativeFull }) {
  const [localInitiative, updateInitiative] = useState<Initiative>(initiativeFull.initiative)

  const [collaborationStatus, setCollaborationStatus] = useState(false)
  const { updatedInitiative } = useUpdateInitiative(collaborationStatus, localInitiative.id)

  // const [applyStatus, setApplyStatus] = useState(false)
  // const { updatedUserApplications } = useUpdateUserApplications(applyStatus, localInitiative.id)

  const { hasRole, getCollaboratorsByRole, getAnnouncements } = useInitiativeUsers(localInitiative)
  const cofounders = getCollaboratorsByRole(UserRole.COFOUNDER)
  const collaborators = getCollaboratorsByRole(UserRole.COLLABORATOR)
  const investors = getCollaboratorsByRole(UserRole.INVESTOR)
  const announcements = getAnnouncements()

  useEffect(() => {
    if (updatedInitiative) {
      updateInitiative(updatedInitiative)
    }
  }, [updatedInitiative])

  // const isInApplications = (announcementId: number) => {
  //   return updatedUserApplications?.some((app) => app.initiativeId === announcementId)
  // }

  return (
    <div className="grid gap-6">
      <Card className="rounded-xl bg-[#FAF8FF]">
        <CardContent className="flex flex-col p-4 gap-4">
          <Box className="flex justify-center font-normal text-center text-[#3D7BFF] gap-2">
            Herramientas y comunidad
            <HandymanRoundedIcon className="text-(--color-primary)" />
          </Box>
          {localInitiative.externalLinks.dework ||
          localInitiative.externalLinks.discord ||
          localInitiative.externalLinks.aragon ||
          localInitiative.externalLinks.dtoCreateToken ||
          localInitiative.externalLinks.githubBack ||
          localInitiative.externalLinks.githubFront ? (
            <Box className="flex flex-wrap gap-4">
              <Box className="flex flex-wrap gap-2">
                <Typography>Tareas y comunicación</Typography>
                <Box className="flex flex-wrap gap-2 w-full">
                  {localInitiative.externalLinks.dework && (
                    <ChipWithTooltip appName={GovernanceLinks.DEWORK} url={localInitiative.externalLinks.dework} />
                  )}
                  {localInitiative.externalLinks.discord && (
                    <ChipWithTooltip appName={GovernanceLinks.DISCORD} url={localInitiative.externalLinks.discord} />
                  )}
                </Box>
              </Box>
              <Box className="flex flex-wrap gap-2">
                <Typography>Gobernanza</Typography>
                <Box className="flex flex-wrap gap-2 w-full">
                  {localInitiative.externalLinks.aragon && (
                    <ChipWithTooltip appName={GovernanceLinks.ARAGON} url={localInitiative.externalLinks.aragon} />
                  )}
                  {localInitiative.externalLinks.dtoCreateToken && (
                    <ChipWithTooltip
                      appName={GovernanceLinks.DTO_CREATE_TOKEN}
                      url={localInitiative.externalLinks.dtoCreateToken}
                    />
                  )}
                </Box>
              </Box>
              <Box className="flex flex-wrap gap-2">
                <Typography>Repositorios</Typography>
                <Box className="flex flex-wrap gap-2 w-full">
                  {localInitiative.externalLinks.githubFront && (
                    <ChipWithTooltip
                      appName={GovernanceLinks.GITHUB_FRONT}
                      url={localInitiative.externalLinks.githubFront}
                    />
                  )}
                  {localInitiative.externalLinks.githubBack && (
                    <ChipWithTooltip
                      appName={GovernanceLinks.GITHUB_BACK}
                      url={localInitiative.externalLinks.githubBack}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <Card className="flex flex-col items-center rounded-xl p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
              <Box component="img" src={cryptoWalletImg}></Box>
              <Typography className="text-(--color-primary) font-medium text-sm">Conectando el ecosistema</Typography>
              <Typography className="text-xs text-[#304578] text-center">
                Una vez que esta propuesta sea aprobada, aquí encontrarás los enlaces directos a su DAO en aragon de
                esta iniciativa, a la comunidad en Discord, su repositorio en GitHub y su tablero de tareas en Dwork.
              </Typography>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-[#FAF8FF]">
        <CardContent className="p-4 flex flex-col gap-4">
          <Box className="font-normal text-center text-[#3D7BFF] flex justify-center gap-2">
            Líder
            <AssignmentIndRoundedIcon className="text-(--color-primary)" />
          </Box>
          <UserProfileCollabModal userId={localInitiative.user.id}>
            <Box className="flex items-center space-x-2">
              <Avatar alt="" className="w-12 h-12" src={localInitiative.user.profilePic} />
              {/* <div> */}
                {/* <p className="text-xs text-gray-500">??????</p> */}
                <Typography
                  className="text-lg w-full max-w-[12rem] md:max-w-[18rem] lg:max-w-[18rem] xl:max-w-[18rem]"
                  // <Typography className="w-full max-w-[12rem] md:max-w-[18rem] lg:max-w-[12rem] xl:max-w-[16rem]"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    // maxWidth: '20vw',
                  }}
                >
                  {localInitiative.user.name}
                </Typography>
              {/* </div> */}
            </Box>
          </UserProfileCollabModal>

          <Box className="font-normal text-center text-[#3D7BFF] flex justify-center gap-2">
            Co fundadores
            <PeopleRoundedIcon className="text-(--color-primary)" />
          </Box>
          {announcements.length === 0 && cofounders.length === 0 && (
            <CardContent className="flex flex-col items-center p-4 gap-4">
              <Card className="flex flex-col items-center rounded-xl p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
                <Box component="img" src={cofoundersImg}></Box>
                <Typography className="text-(--color-primary) font-medium text-sm">Formando el Núcleo</Typography>
                <Typography className="text-xs text-[#304578] text-center">
                  Busca a tus socios estratégicos. Publica las vacantes de cofundador para construir el núcleo de tu
                  equipo.
                </Typography>
              </Card>
            </CardContent>
          )}

          {hasRole(UserRole.COFOUNDER) && (
            <>
              {cofounders.map((collaborator: Collaborator, index: number) => (
                <div key={index}>
                  <UserProfileCollabModal userId={collaborator.id}>
                    <Box className="flex items-center space-x-2">
                      <Avatar alt="" className="w-8 h-8" src={collaborator.profilePic} />
                      <div className="flex flex-col items-start">
                        <p className="text-md">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.role}</p>
                      </div>
                    </Box>
                  </UserProfileCollabModal>
                </div>
              ))}
            </>
          )}

          {announcements.map((announcement: Announcement, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Avatar alt="" className="w-8 h-8" src="" />
              <div>
                <p className="text-sm max-w-[7rem]">{announcement.gSkill}</p>
              </div>
              {/* {isInApplications(announcement.id) ? ( */}
              {initiativeFull.coFounderAnnouncementId === announcement.id ? (
                <Chip label="Postulado" className="rounded-full bg-blue-100 ml-auto text-xs" />
              ) : (
                <Chip label="Buscando" className="rounded-full bg-green-100 ml-auto text-xs" />
              )}
              <CofoundingApplyModal
                initiativeFull={initiativeFull}
                announcement={announcement}
                onCollaborationChange={(status) => {
                  setCollaborationStatus(status)
                }}
                onCofoundingChange={(status) => {
                  // setApplyStatus(status)
                  setCollaborationStatus(status)
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-[#FAF8FF]">
        <CardContent className="flex flex-col p-4 gap-4">
          <Box className="font-normal text-center text-[#3D7BFF] flex justify-center gap-2">
            Colaboradores
            <Diversity2RoundedIcon className="text-(--color-primary)" />
          </Box>
          {hasRole(UserRole.COLLABORATOR) ? (
            <>
              {collaborators.map((collaborator: Collaborator, index: number) => (
                <div key={index}>
                  <UserProfileCollabModal userId={collaborator.id}>
                    <Box className="flex items-center space-x-2">
                      <Avatar alt="" className="w-8 h-8" src={collaborator.profilePic} />
                      <div className="flex flex-col items-start">
                        <p className="text-md">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">{collaborator.role}</p>
                      </div>
                    </Box>
                  </UserProfileCollabModal>
                </div>
              ))}
            </>
          ) : (
            <CardContent className="flex flex-col items-center p-0 gap-4">
              <Card className="flex flex-col items-center rounded-xl p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
                <Box component="img" src={collaboratorsImg}></Box>
                <Typography className="text-(--color-primary) font-medium text-sm">Reuniendo al Equipo</Typography>
                <Typography className="text-xs text-[#304578] text-center">
                  Tu proyecto está listo para crecer. Invita a colaboradores para que aporten su talento a tu
                  iniciativa.
                </Typography>
              </Card>
            </CardContent>
          )}
          <CollaborationApplyModal
            initiative={initiativeFull.initiative}
            onCollaborationChange={(status) => {
              setCollaborationStatus(status)
            }}
          />
        </CardContent>
      </Card>

      <Card className="rounded-xl bg-[#FAF8FF]">
        <CardContent className="flex flex-col p-4 gap-4">
          <Box className="font-normal text-center text-[#3D7BFF] flex justify-center gap-2">
            Inversionistas
            <WalletRoundedIcon className="text-(--color-primary)" />
          </Box>
          {hasRole(UserRole.INVESTOR) ? (
            <>
              {investors.map((investor: Collaborator, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Avatar alt="" className="w-8 h-8" src="" />
                  <div>
                    <p>{investor.name}</p>
                    <p className="text-xs text-gray-500">{investor.role}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <CardContent className="flex flex-col items-center p-0 gap-4">
              <Card className="flex flex-col items-center rounded-xl p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
                <Box component="img" src={investorsImg}></Box>
                <Typography className="text-(--color-primary) font-medium text-sm">Buscando Catalizadores</Typography>
                <Typography className="text-xs text-[#304578] text-center">
                  Esta iniciativa está lista para ser impulsada. Sé uno de los primeros en creer en su potencial y ayuda
                  a catalizar su crecimiento.
                </Typography>
              </Card>
            </CardContent>
          )}
          <InvestApplyModal initiativeId={localInitiative.id} />
        </CardContent>
      </Card>
    </div>
  )
}
