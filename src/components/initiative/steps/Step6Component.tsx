import React from "react"
import { Box, Typography, useTheme } from "@mui/material"
import { motion } from "motion/react"
import { useFormContext } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"

import { useStepLogic } from "@/hooks/useStepLogic"
import { useAuthContext } from "@/hooks/useAuthContext"
import InitiativeCard from "@/components/shared/initiativeCard"
// import { INITIATIVE_FALLBACK_IMAGE } from "@/lib/constants"
import { useInitiativeForm } from "@/context/InitiativeFormContext"

// import noPicturePlaceholderImg from "@/assets/images/initiative-detail/no-image-placeholder.jpg"
import { INITIATIVE_FALLBACK_IMAGE } from "@/lib/constants"

const Step6Component: React.FC = () => {
  const theme = useTheme()
  const { watch } = useFormContext<InitiativeFormData>()
  const { getRequiredStepsProgress } = useStepLogic()
  const { userFromApi } = useAuthContext()
  const { isEditMode, initiativeData: originalInitiative } = useInitiativeForm()

  const formData = watch()

  const requiredProgress = getRequiredStepsProgress()
  const areRequiredStepsComplete = requiredProgress.completed === requiredProgress.total

  const getHeaderText = () => {
    if (!areRequiredStepsComplete) {
      return "¡Completa los Pasos Requeridos!"
    }
    if (isEditMode) {
      return "¡Revisa y Actualiza!"
    }
    return "¡Lista para la Comunidad!"
  }

  return (
    <Box>
      {/* El header se mantiene en el Step6, ya que es específico de este paso. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: theme.palette.primary.main,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {getHeaderText()}
            </Typography>
          </motion.div>
        </Box>
      </motion.div>

      <Box className="max-w-sm mx-auto [&>div]:mx-auto">
        <InitiativeCard
          initiative={{
            id: originalInitiative?.id || 0,
            title: formData.title || "Título de la Propuesta",
            img: formData.mainImage || INITIATIVE_FALLBACK_IMAGE,
            user: {
              id: userFromApi?.id || 0,
              name: userFromApi?.name || "Usuario",
              email: userFromApi?.email || "usuario@openlab.com",
              profilePic: userFromApi?.image || "",
            },
            description: formData.detailedDescription || "Descripción de la iniciativa",
            state: isEditMode ? originalInitiative!.state : "Borrador",
            motto: formData.motto || "Lema de la iniciativa",
            votesAgainst: originalInitiative?.votesAgainst || 0,
            votesInFavor: originalInitiative?.votesInFavor || 0,
            date: isEditMode ? (originalInitiative?.date ?? new Date().toISOString()) : new Date().toISOString(),
            problemToBeSolved: formData.problemSolved || "Problema a resolver",
            marketInformation: formData.marketInfo || "Información del mercado",
            productFeatures: formData.productCharacteristics || "Características del producto",
            externalLinks: {
              dework: originalInitiative?.externalLinks.dework || null,
              discord: originalInitiative?.externalLinks.discord || null,
              otros: Object.entries(formData?.socialNetworks ?? {})
                .filter(([, url]) => !!url)
                .map(([key, url], index) => ({
                  id: index + 1,
                  nombre: key,
                  url: url!,
                  img: "",
                })) || [],
              aragon: originalInitiative?.externalLinks.aragon,
              githubBack: originalInitiative?.externalLinks.githubBack,
              githubFront: originalInitiative?.externalLinks.githubFront,
              dtoCreateToken: originalInitiative?.externalLinks.dtoCreateToken,
            },
            objectives: formData?.objectives.map((obj) => obj.description),
            tags: formData?.tags || [],
            multimedia: formData.images || [],
            roadmap:
              formData?.roadmapPhases?.map((road) => ({
                name: road.title,
                description: road.description,
                status: road.status,
                phaseName: road.title,
              })) || [],
            update:
              formData?.updates?.map((update) => ({
                name: update.title,
                description: update.description,
              })) || [],
            needs:
              formData?.seekingProfiles
                ?.filter((p) => p.roles.includes("COLLABORATOR"))
                .map((collaborator) => ({
                  id: 0,
                  role: "COLLABORATOR",
                  gSkills: collaborator.generalSkills[0],
                  hardSkills: collaborator.technicalSkills,
                })) || [],
            collaborators: originalInitiative?.collaborators || [],
            announcements: originalInitiative?.announcements || [],
          }}
          isDraft={true}
        />
      </Box>
    </Box>
  )
}

export default Step6Component
