import React, { useMemo } from "react"
import { Box, Typography, Paper, Link, IconButton, Stack } from "@mui/material"
import {
  LinkedIn,
  Facebook,
  Instagram,
  Language,
  Twitter,
  GitHub,
  Work,
  ContentCopy,
  OpenInNew,
  People,
  Hub,
  InfoOutlined,
} from "@mui/icons-material"
import { motion } from "motion/react"
import { useFormContext } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
import { FormTextField } from "./shared/FormTextField"
import { useInitiativeForm } from "@/context/InitiativeFormContext"
// import { useAuthContext } from "@/hooks/useAuthContext"
import { useSnackbar } from "@/context/SnackbarContext"
import { ARAGON_LINK } from "@/lib/constants"
import type { Initiative } from "@/interfaces/initiative"

// const InfoLine = ({ text }: { text: string }) => (
//   <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 1 }}>
//     <InfoOutlined sx={{ fontSize: "1rem", color: "text.secondary", mt: 0.1 }} />
//     <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.4 }}>
//       {text}
//     </Typography>
//   </Box>
// )

const LinkDisplay = ({
  label,
  url,
  icon: Icon,
  onCopy,
  color = "text.primary",
  description,
  isAddressOnly = false,
}: {
  label: string
  url: string | null
  icon: React.ElementType
  onCopy: (text: string, message: string) => void
  color?: string
  description?: string
  isAddressOnly?: boolean
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Icon sx={{ color: "primary.main" }} />
        <Box>
          <Typography variant="body1" fontWeight={500} color={color}>
            {label}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      {url ? (
        <Paper
          elevation={1}
          sx={{
            p: 1,
            pl: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "white",
          }}
        >
          {isAddressOnly ? (
            // Para direcciones de DAO: solo texto, sin enlace
            <Typography
              sx={{
                wordBreak: "break-all",
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {url}
            </Typography>
          ) : (
            // Para URLs normales: con enlace
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                wordBreak: "break-all",
                textDecoration: "none",
                color: "text.primary",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {url}
            </Link>
          )}
          <Box sx={{ ml: "auto", display: "flex" }}>
            <IconButton size="small" onClick={() => onCopy(url, `${isAddressOnly ? 'Dirección' : 'Enlace'} de ${label} copiado`)} title={`Copiar ${isAddressOnly ? 'dirección' : 'enlace'}`}>
              <ContentCopy fontSize="small" />
            </IconButton>
            {!isAddressOnly && (
              <IconButton
                size="small"
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir enlace"
              >
                <OpenInNew fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: 1, pl: 2, display: "flex", alignItems: "center", gap: 1, bgcolor: "action.hover" }}
        >
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {isAddressOnly ? "Dirección no disponible" : "Link no disponible"}
          </Typography>
        </Paper>
      )}
    </motion.div>
  )
}

const Step4Component: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<InitiativeFormData>()

  const { isEditMode, initiativeData } = useInitiativeForm()
  // const { userFromApi } = useAuthContext()
  // const isAdmin = useMemo(() => userFromApi?.roles?.includes("ADMIN"), [userFromApi])
  const { showSnackbar } = useSnackbar()

  const isDisabled = useMemo(() => {
    if (!isEditMode || !initiativeData?.state) return false
    // if (isAdmin) return false

    const lockedStatus = ["approved"]
    return lockedStatus.includes(initiativeData.state)
  }, [isEditMode, initiativeData?.state])

  // Watch para obtener valores actuales
  const socialNetworksRaw = watch("socialNetworks")

  // Memorizar para evitar recrear objetos en cada render
  const socialNetworks = useMemo(() => socialNetworksRaw || {}, [socialNetworksRaw])

  const handleCopy = (textToCopy: string | null | undefined, message: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      showSnackbar({ title: "Copiado", message, severity: "success" })
    }
  }

  // Función auxiliar para obtener errores de manera type-safe
  const getFieldError = (section: "socialNetworks" | "externalLinks", fieldName: string) => {
    const sectionErrors = errors[section] as Record<string, { message: string }> | undefined
    if (sectionErrors && sectionErrors[fieldName]) {
      return {
        message: sectionErrors[fieldName].message,
        type: "validation" as const,
      }
    }
    return undefined
  }

  // Función mejorada para limpiar campo Y error
  const handleClearField = (section: "socialNetworks" | "externalLinks", fieldName: string) => {
    // Limpiar el valor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(`${section}.${fieldName}` as any, "")

    // Limpiar el error también (campo vacío = válido)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors(`${section}.${fieldName}` as any)
  }

  const socialNetworkFields = [
    { name: "linkedin", icon: LinkedIn, label: "LinkedIn", placeholder: "https://linkedin.com/company/tu-empresa" },
    { name: "facebook", icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/tu-pagina" },
    { name: "instagram", icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/tu-cuenta" },
    { name: "website", icon: Language, label: "Sitio Web", placeholder: "https://tu-sitio-web.com" },
    { name: "twitter", icon: Twitter, label: "Twitter", placeholder: "https://twitter.com/tu-cuenta" },
  ]

  const externalLinksFields = [
    {
      name: "githubFront",
      icon: GitHub,
      label: "GitHub (Frontend)",
      placeholder: "https://github.com/tu-proyecto-front",
      subtitle: "Repositorio de código para el frontend del proyecto.",
      description: undefined,
      isAddressOnly: false,
    },
    {
      name: "githubBack",
      icon: GitHub,
      label: "GitHub (Backend)",
      placeholder: "https://github.com/tu-proyecto-back",
      subtitle: "Repositorio de código para el backend del proyecto.",
      description: undefined,
      isAddressOnly: false,
    },
    {
      name: "aragonAddress",
      icon: Hub,
      label: "Dirección de la DAO (Aragon)",
      placeholder: "0x...",
      subtitle: "Dirección del smart contract de la DAO en la blockchain.",
      isAddressOnly: true,
    },
    {
      name: "aragonGovernance",
      icon: Hub,
      label: "Url de Gobernanza (Aragon)",
      placeholder: "https://app.aragon.org/#/daos/mainnet/0x...",
      subtitle: "URL de la web para participar en la gobernanza de la DAO.",
      isAddressOnly: false,
    },
    {
      name: "discord",
      icon: People,
      label: "Discord",
      placeholder: "https://discord.gg/tu-servidor",
      subtitle: "Canal para la comunicación interna y con la comunidad.",
      description: undefined,
      isAddressOnly: false,
    },
    {
      name: "dework",
      icon: Work,
      label: "Dework",
      placeholder: "https://app.dework.xyz/tu-organizacion",
      subtitle: "Gestión de tareas y distribución de recompensas.",
      description: undefined,
      isAddressOnly: false,
    },
    // {
    //   name: "figma",
    //   icon: AppRegistrationRounded,
    //   label: "Figma",
    //   placeholder: "https://app.figma.com/file/tu-proyecto",
    //   subtitle: "Diseño y prototipado del producto.",
    // },
  ]

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Herramientas externas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Si tu iniciativa ya tiene presencia en otras plataformas, añade sus enlaces. Esto facilita que otros se unan
            y colaboren.
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        {/* Redes Sociales */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, fontSize: "1.15rem" }} color="primary.main">
            Redes Sociales y Web de la iniciativa
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {socialNetworkFields.map((social, index) => (
              <motion.div
                key={social.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FormTextField
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  register={register(`socialNetworks.${social.name}` as any)}
                  label={social.label}
                  placeholder={social.placeholder}
                  value={socialNetworks[social.name as keyof typeof socialNetworks] || ""}
                  onClear={() => handleClearField("socialNetworks", social.name)}
                  icon={social.icon}
                  labelFontSize="1.15rem"
                  legendFontSize="0.875rem"
                  error={getFieldError("socialNetworks", social.name)}
                  disabled={isDisabled}
                />
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Enlaces Externos */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontSize: "1.15rem" }} color="primary.main">
            Herramientas de Colaboración y Gobernanza (OpenLab)
          </Typography>

          <Stack spacing={2}>
            {initiativeData?.state !== "approved" && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", textAlign: "center" }}>
                Los enlaces a estas herramientas se configurarán una vez que la iniciativa sea aprobada por un
                administrador.
              </Typography>
            )}

            {externalLinksFields.map((external) => {
              let linkValue: string | null = null

              // Manejar los campos de Aragon por separado
              if (external.name === "aragonAddress") {
                linkValue = initiativeData?.externalLinks?.aragon || null
              } else if (external.name === "aragonGovernance") {
                linkValue = initiativeData?.externalLinks?.aragon ? ARAGON_LINK(initiativeData.externalLinks.aragon) : null
              } else if (external.name === "otros") {
                // El campo 'otros' es un array, no un string, así que no se puede mostrar directamente
                linkValue = null
              } else {
                // Solo acceder a campos que sabemos que son string | null
                const fieldName = external.name as Exclude<keyof Initiative["externalLinks"], "otros">
                linkValue = initiativeData?.externalLinks?.[fieldName] || null
              }

              return (
                <Paper key={external.name} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <LinkDisplay
                    label={external.label}
                    url={linkValue}
                    icon={external.icon}
                    onCopy={handleCopy}
                    color={"primary.main"}
                    description={external.description}
                    isAddressOnly={external.isAddressOnly}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, ml: 1 }}
                  >
                    <InfoOutlined sx={{ fontSize: "1rem" }} />
                    {external.subtitle}
                  </Typography>
                </Paper>
              )
            })}
          </Stack>
        </Box>
      </motion.div>
    </Box>
  )
}

export default Step4Component
