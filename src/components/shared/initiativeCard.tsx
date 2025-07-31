import type { Collaborator, Initiative } from "../../pages/protected/dashboard/initiative/schemas/initiativeSchema"
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import CardMedia from "@mui/material/CardMedia"
import AvatarGroup from "@mui/material/AvatarGroup"
import Box from "@mui/material/Box"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import { InitiativeState, InitiativeStateNames, UserRole } from "@/interfaces/general-enum"
import { useSlugNavigation } from "../../hooks/useSlugNav"
import { stateClassColor } from "../../pages/protected/dashboard/initiatives/utils/stateClassColor"
import { useInitiativeUsers } from "../../hooks/useInitiativeUsers"
import { useHoverVideo } from "@/hooks/userHoverVídeo"
import Paper from "@mui/material/Paper"
import ButtonBase from "@mui/material/ButtonBase"
// import Button from "@mui/material/Button"

export default function InitiativeCard({ initiative, isDraft }: { initiative: Initiative, isDraft?: boolean }) {
  const { goToInitiative } = useSlugNavigation()
  const { hasRole, getCollaboratorsByRole } = useInitiativeUsers(initiative)
  const cofounders = getCollaboratorsByRole(UserRole.COFOUNDER)
  const collaborators = getCollaboratorsByRole(UserRole.COLLABORATOR)
  const stateKey = InitiativeStateNames[initiative.state.toUpperCase() as keyof typeof InitiativeStateNames]
  const isVideo = /\.(mp4|webm|ogg)$/i.test(initiative.img)
  const { videoRef, showControls, handleMouseEnter, handleMouseLeave } = useHoverVideo({ controls: false })

  return (
    <Paper elevation={2} className="rounded-2xl w-xs border-t-1 border-gray-200 hover:shadow-lg transition duration-200 hover:-translate-y-1">
      <ButtonBase
        onClick={() => {
          goToInitiative(initiative, '', isDraft)
        }}
        className="h-full w-full rounded-2xl">
        <Card
          className="flex flex-col rounded-2xl gap-y-2 bg-white p-6 h-full w-full"
          onMouseEnter={isVideo ? handleMouseEnter : undefined}
          onMouseLeave={isVideo ? handleMouseLeave : undefined}
          >
          <Box className="flex items-center gap-2">
            <Box component="span" className={`text-black text-xs text-black px-2 py-1 rounded-lg ${stateClassColor[initiative.state]} min-w-fit h-fit`}>
              {stateKey}
            </Box>
            <Box className="flex ml-auto items-center gap-1 min-w-0">
              <Typography component="span" className="flex text-xs text-[#9095A0] leading-5">Líder:</Typography>
              <Box className="flex items-center min-h-10">
                <Typography className="text-sm font-bold text-black ml-auto text-right w-fit"
                  sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '6rem',
                  }}
                >
                  {initiative.user.name}
                </Typography>
              </Box>
            </Box>
            <Box className="h-full flex items-center">
              <Avatar className="w-8 h-8" alt="" src={initiative.user.profilePic}/>
            </Box>
          </Box>
          <Box className="flex justify-end f-1 gap-1">
            {hasRole(UserRole.COFOUNDER) ? (
              <AvatarGroup max={6} className="flex-row">
                {cofounders.map((collaborator: Collaborator) => (
                  <Avatar className="size-[1.5rem]" alt={collaborator.name} src={collaborator.profilePic}/>
                ))}
              </AvatarGroup>
            ) : (
              <Typography component="span" className="flex items-center text-sm font-bold">Sin equipo</Typography>
            )}
          </Box>
          <Box className="flex min-h-10 items-center">
            <Typography variant="h6" component="div" className="text-base line-clamp-2 leading-5">
              {initiative.title}
            </Typography>
          </Box>
          {isVideo ? (
            <CardMedia
              component="video"
              src={initiative.img}
              ref={videoRef}
              controls={showControls}
              autoPlay={false}
              muted
              playsInline
              loop
              className="rounded-lg h-40 w-full object-cover"
            />
          ) : (
            <CardMedia
              component="img"
              image={initiative.img}
              className="rounded-lg h-40 w-full object-cover"
              alt=""
            />
          )}
          <Typography variant="body2" className="text-xs text-[#9095A0] h-16 line-clamp-5 leading-none">
            {initiative.motto}
          </Typography>
          <Box className="grid mt-4">
            {/* <Box className=""> */}
            <Box className="flex items-center justify-center f-1 gap-2">
            {hasRole(UserRole.COLLABORATOR) ? (
              <AvatarGroup
                max={4}
                className=""
                slotProps={{
                  additionalAvatar: {
                    sx: { width: '1.5rem', height: '1.5rem', fontSize: '.8rem' },
                  },
                }}
              >
                {collaborators.map((collaborator: Collaborator) => (
                  <Avatar className="size-[1.5rem]" alt={collaborator.name} src={collaborator.profilePic}/>
                ))}
              </AvatarGroup>
            ) : (
              <Typography className="flex items-center text-sm font-bold" component="span">Sin participantes</Typography>
            )}
            </Box>
            <Box className="flex items-center justify-center gap-2">
              <InsertDriveFileIcon className="size-[.875rem] text-[#3d7bff]"></InsertDriveFileIcon>
              <Typography component="span" className="flex items-center justify-center text-sm font-bold">
                {initiative.votesInFavor} {initiative.votesInFavor === 1 ? "voto" : "votos"}
              </Typography>
            </Box>
          </Box>
          <Box className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary-2)] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
            {initiative.state === InitiativeState.PROPOSAL ? "Votar ahora" : "Ver iniciativa"}
          </Box>
        </Card>
      </ButtonBase>
    </Paper>
  )
}