import { Tooltip } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import logoAragonImg from '@/assets/images/initiative-detail/logo_aragon.svg'
import logoDeworkImg from '@/assets/images/initiative-detail/logo_dework.png'
import logoDiscordImg from '@/assets/images/initiative-detail/logo_discord.svg'
import logoGithubImg from '@/assets/images/initiative-detail/logo_github.svg'
import { ARAGON_LINK, TOKEN_LINK } from "@/lib/constants"

interface ChipWithTooltipProps {
  appName: string
  url: string
}

// Initiative tools dictionary
const PLATFORM_STYLES: Record<string, {
  icon: string
  bgColor: string
  textColor: string
  label: string
}> = {
  Dework: {
    icon: logoDeworkImg,
    bgColor: "#8247e5",
    textColor: "#ffffff",
    label: "Dework"
  },
  Discord: {
    icon: logoDiscordImg,
    bgColor: "#5865F2",
    textColor: "#ffffff",
    label: "Discord"
  },
  Aragon: {
    icon: logoAragonImg,
    bgColor: "#003BF5",
    textColor: "#ffffff",
    label: "DAO"
  },
  Token: {
    icon: logoAragonImg,
    bgColor: "#003BF5",
    textColor: "#ffffff",
    label: "Token"
  },
  GitHubBack: {
    icon: logoGithubImg,
    bgColor: "#24292f",
    textColor: "#ffffff",
    label: "GitHub Back"
  },
  GitHubFront: {
    icon: logoGithubImg,
    bgColor: "#24292f",
    textColor: "#ffffff",
    label: "GitHub Front"
  }
}

export default function ChipWithTooltip({
  appName,
  url
}: ChipWithTooltipProps) {
  const { icon, bgColor, textColor, label } = PLATFORM_STYLES[appName] ?? {
    icon: "",
    bgColor: "#3D7BFF",
    textColor: "#ffffff",
    label: 'Desconocido'
  }

  if (appName === 'Aragon'){
    url = ARAGON_LINK(url)
  }

  if (appName === 'Token'){
    url = TOKEN_LINK(url)
  }

  return (
    <Tooltip title={url} placement="top" arrow>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Box
          className="flex items-center w-fit gap-2 rounded-full pl-1 pr-3 py-1 text-sm cursor-pointer transition hover:opacity-90"
          sx={{ backgroundColor: bgColor, color: textColor }}
        >
          <Box component="img" className="w-6 h-6 bg-white p-1 rounded-full" src={icon}></Box>
          <Typography variant="body2" className="text-sm font-medium">
            {label}
          </Typography>
        </Box>
      </a>
    </Tooltip>
  )
}