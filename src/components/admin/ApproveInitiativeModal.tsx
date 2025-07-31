import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Close from "@mui/icons-material/Close"
import GitHub from "@mui/icons-material/GitHub"
import Work from "@mui/icons-material/Work"
import People from "@mui/icons-material/People"
import Hub from "@mui/icons-material/Hub"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { motion } from "motion/react"
import { API_PATH, API_URL, ARAGON_LINK, INITIATIVE_FALLBACK_IMAGE } from "@/lib/constants"
import InitiativeCard from "@/components/shared/initiativeCard"
import { LinkDisplay } from "@/components/admin/ApproveLinkDisplay"
import { FormTextField } from "@/components/initiative/steps/shared/FormTextField"
import { useMemo } from "react"
import { theme } from "@/lib/theme"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useSnackbar } from "@/context/SnackbarContext"
import type { Initiative } from "@/interfaces/initiative"
import { approveInitiativeSchema, type ApproveInitiativeFormData } from "@/schemas/approveInitiative"

interface ApproveInitiativeModalProps {
  open: boolean
  onClose: () => void
  initiative: Initiative
}

const formFields = [
  { name: "aragon", label: "Aragon App", icon: Hub, subtitle: "Para la gobernanza y tesorería descentralizada." },
  { name: "discord", label: "Discord", icon: People, subtitle: "Para la comunicación del equipo y la comunidad." },
  { name: "dework", label: "Dework", icon: Work, subtitle: "Para la gestión de tareas y recompensas." },
]

export const ApproveInitiativeModal: React.FC<ApproveInitiativeModalProps> = ({ open, onClose, initiative }) => {
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const { userFromApi } = useAuthContext()
  const token = userFromApi?.token

  const isViewMode = useMemo(() => initiative?.state === "approved", [initiative])

  const {
    handleSubmit,
    reset,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<ApproveInitiativeFormData>({
    resolver: zodResolver(approveInitiativeSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      dework: "",
      discord: "",
      aragon: {
        address: "",
        tokenName: "",
        tokenSymbol: "",
      },
    },
  })

  const watchedValues = watch()

  const initiativeFromApi = useMemo(
    () => ({
      id: initiative?.id || 0,
      title: initiative?.title || "Título de la Propuesta",
      img: initiative?.img || INITIATIVE_FALLBACK_IMAGE,
      user: {
        id: initiative?.user?.id || 0,
        name: initiative?.user?.name || "Usuario",
        email: initiative?.user?.email || "usuario@openlab.com",
        profilePic: initiative?.user?.profilePic || "",
      },
      description: initiative?.description || "Descripción de la iniciativa",
      state: initiative?.state || "proposal",
      motto: initiative?.motto || "Lema de la iniciativa",
      collaborators: initiative?.collaborators || [],
      votesAgainst: initiative?.votesAgainst || 0,
      votesInFavor: initiative?.votesInFavor || 0,
      date: initiative?.date || new Date().toISOString(),
      problemToBeSolved: initiative?.problemToBeSolved || "Problema a resolver",
      marketInformation: initiative?.marketInformation || "Información del mercado",
      productFeatures: initiative?.productFeatures || "Características del producto",
      objectives: initiative?.objectives || [],
      externalLinks: {
        dework: initiative?.externalLinks?.dework || null,
        discord: initiative?.externalLinks?.discord || null,
        otros: [
          {
            id: 1,
            nombre: "facebook",
            url: "https://www.facebook.com",
            img: "https://www.facebook.com/favicon.ico",
          },
        ],
      },
      tags: initiative?.tags || [],
      multimedia: initiative?.multimedia || [],
      roadmap: initiative?.roadmap || [],
      update: initiative?.update || [],
      needs: initiative?.needs || [],
      announcements: [],
    }),
    [initiative],
  )

  const approveMutation = useMutation({
    mutationFn: async (data: ApproveInitiativeFormData) => {
      if (!initiative) throw new Error("Initiative not found")

      const res = await fetch(`${API_URL}${API_PATH.INITIATIVE_TO_APPROVE}/${initiative.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // 1️⃣
        body: JSON.stringify({
          dework: data.dework,
          discord: data.discord,
          aragon: data.aragon.address,
          dtoCreateToken: {
            name: data.aragon.tokenName,
            symbol: data.aragon.tokenSymbol,
          },
        }),
      })

      // 2️⃣ Intentar leer el cuerpo (puede venir vacío o no-JSON)
      let payload: unknown = null
      try {
        const text = await res.text()
        payload = text ? JSON.parse(text) : null
      } catch {
        /* cuerpo vacío o inválido → payload seguirá en null */
      }

      // 3️⃣ Si hay error HTTP, propaga el mensaje que mande el backend
      if (!res.ok) {
        const msg =
          (payload as { message?: string })?.message || // ← tu backend envía { message: '…' }
          (payload as { error?: string })?.error || // ← por si usas otra key
          `${res.status} ${res.statusText}`
        throw new Error(msg)
      }

      // ok ⇒ devolvemos el JSON (ya lo tenemos en payload)
      return payload
    },
    onSuccess: () => {
      showSnackbar({ message: "Iniciativa aprobada correctamente.", severity: "success", title: "Éxito" })
      onClose()
      reset()
    },
    onError: (error) => {
      showSnackbar({ message: error.message, severity: "error", title: "Error" })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["initiatives", "admin"] })
    },
  })

  const onSubmit = (data: ApproveInitiativeFormData) => approveMutation.mutate(data)

  const isSubmitting = approveMutation.isPending

  const handleCopy = (textToCopy: string, message: string) => {
    navigator.clipboard.writeText(textToCopy)
    showSnackbar({ title: "Copiado", message, severity: "success" })
  }

  const aragonUrl = useMemo(() => {
    const aragonAddress = initiative?.externalLinks?.aragon
    if (isViewMode && aragonAddress) {
      return ARAGON_LINK(aragonAddress)
    }

    return null
  }, [initiative, isViewMode])

  const linksToDisplay = useMemo(() => {
    if (!isViewMode || !initiative?.externalLinks) return []
    const { githubFront, githubBack, dework, discord, aragon } = initiative.externalLinks

    const links = [
      { label: "GitHub Frontend", url: githubFront, icon: GitHub },
      { label: "GitHub Backend", url: githubBack, icon: GitHub },
      // Separar la dirección y URL de la DAO de Aragon
      {
        label: "Dirección de la DAO (Aragon)",
        url: aragon,
        icon: Hub,
        description: "Dirección del smart contract de la DAO en la blockchain",
        isAddressOnly: true,
      },
      {
        label: "Url de Gobernanza (Aragon)",
        url: aragonUrl,
        icon: Hub,
        description: "URL de la web para participar en la gobernanza de la DAO",
        isAddressOnly: false,
      },
      { label: "Dework", url: dework, icon: Work },
      { label: "Discord", url: discord, icon: People },
    ]

    return links
  }, [isViewMode, initiative, aragonUrl])

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "7px" },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: "3px",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            },
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.primary.main} transparent`,
          },
        },
      }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2, px: 3 }}>
          <Typography
            component="div"
            variant="h5"
            fontWeight={700}
            color="primary.main"
            sx={{ textAlign: "center", flex: 1 }}
          >
            {isViewMode ? "Enlaces de la Iniciativa" : "Revisión y Activación de Iniciativa"}
          </Typography>
          <IconButton onClick={onClose} disabled={isSubmitting}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3,
            overflowY: "auto",
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {isViewMode
              ? "Estos son los enlaces de colaboración y gobernanza de la iniciativa."
              : "Aquí puedes revisar los detalles de la propuesta y, si cumple los criterios, activar la iniciativa y configurar sus enlaces a herramientas externas."}
          </Typography>
          <Box className="flex justify-center items-center gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <InitiativeCard initiative={initiativeFromApi} />
            </motion.div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, textAlign: "center" }} color="primary.main">
                Herramientas de Colaboración y Gobernanza
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isViewMode
                  ? "Enlaces activos de la iniciativa."
                  : "Configura los enlaces a las herramientas que se activarán una vez aprobada la iniciativa."}
              </Typography>
              {isViewMode ? (
                <Stack spacing={2}>
                  {linksToDisplay.map((link) => (
                    <LinkDisplay
                      key={link.label}
                      label={link.label}
                      url={link.url}
                      icon={link.icon}
                      onCopy={handleCopy}
                      description={link.description}
                      isAddressOnly={link.isAddressOnly}
                    />
                  ))}
                </Stack>
              ) : (
                <Box
                  component="form"
                  id="approve-form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "7px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "grey.100",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "primary.main",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                  }}
                >
                  <Box className="grid grid-cols-1 gap-6">
                    {formFields.map((field) => {
                      if (field.name === "aragon") {
                        return (
                          <Paper key="aragon-group" variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              {<field.icon />}
                              <Typography variant="body1" fontWeight={500} color="primary.main">
                                {field.label}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                              {field.subtitle}
                            </Typography>
                            <Stack spacing={2}>
                              <FormTextField
                                register={register("aragon.address")}
                                label="Dirección de la DAO"
                                placeholder="0x..."
                                value={watchedValues.aragon.address}
                                error={errors.aragon?.address}
                                disabled={isSubmitting}
                                onClear={() => setValue("aragon.address", "")}
                                legendFontSize="0.75rem"
                                labelFontSize="1rem"
                              />
                              <FormTextField
                                register={register("aragon.tokenName")}
                                label="Nombre del Token"
                                placeholder="Ej: OpenLab Token"
                                value={watchedValues.aragon.tokenName}
                                error={errors.aragon?.tokenName}
                                disabled={isSubmitting}
                                onClear={() => setValue("aragon.tokenName", "")}
                                legendFontSize="0.75rem"
                                labelFontSize="1rem"
                              />
                              <FormTextField
                                register={register("aragon.tokenSymbol")}
                                label="Símbolo del Token"
                                placeholder="Ej: OPL"
                                value={watchedValues.aragon.tokenSymbol}
                                error={errors.aragon?.tokenSymbol}
                                disabled={isSubmitting}
                                onClear={() => setValue("aragon.tokenSymbol", "")}
                                inputProps={{
                                  maxLength: 3,
                                  style: { textTransform: "uppercase" },
                                }}
                                labelFontSize="1rem"
                                legendFontSize="0.75rem"
                              />
                            </Stack>
                          </Paper>
                        )
                      }

                      return (
                        <Box key={field.name}>
                          <FormTextField
                            register={register(field.name as "dework" | "discord")}
                            label={field.label}
                            placeholder={`https://${field.label.toLowerCase()}.com`}
                            value={watchedValues[field.name as "dework" | "discord"]}
                            error={errors[field.name as "dework" | "discord"]}
                            disabled={isSubmitting}
                            icon={field.icon}
                            onClear={() => setValue(field.name as "dework" | "discord", "")}
                            sx={{}}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.5, ml: 1 }}
                          >
                            {field.subtitle}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}
            </motion.div>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2, bgcolor: "grey.100" }}>
          <Button onClick={onClose} variant="outlined" color="secondary" disabled={isSubmitting}>
            {isViewMode ? "Cerrar" : "Cancelar"}
          </Button>
          <Button
            type="submit"
            form="approve-form"
            variant="contained"
            disabled={isSubmitting || isViewMode}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? "Activando..." : "Activar Iniciativa"}
          </Button>
        </Box>
      </motion.div>
    </Dialog>
  )
}
