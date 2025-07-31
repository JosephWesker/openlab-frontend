import { useCallback, useMemo, memo } from "react"
import { Box, Typography, Stack } from "@mui/material"
import { motion } from "motion/react"
import { useFormContext } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useInitiativeForm } from "@/context/InitiativeFormContext"
import { FormTextField } from "./shared/FormTextField"
import { ImageSlider } from "./shared/ImageSlider"
import { ImageUpload } from "./shared/ImageUpload"

const Step1Component: React.FC = memo(() => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<InitiativeFormData>()

  const { userFromApi } = useAuthContext()
  const { isEditMode, initiativeData } = useInitiativeForm()

  const isDisabled = useMemo(() => {
    if (!isEditMode || !initiativeData?.state) return false

    const lockedStatus = ["approved"]
    return lockedStatus.includes(initiativeData.state)
  }, [isEditMode, initiativeData?.state])

  // Usar watch selectivo en lugar de múltiples llamadas
  const watchedFields = watch(["title", "motto", "mainImage", "images"])
  const [title, motto, mainImage, images] = watchedFields

  // Memoizar las funciones de limpieza para evitar re-renders
  const clearTitle = useCallback(() => {
    if (isDisabled) return
    setValue("title", "")
  }, [setValue, isDisabled])
  const clearMainImage = useCallback(() => {
    if (isDisabled) return
    setValue("mainImage", "")
  }, [setValue, isDisabled])

  const handleMainImageSelect = useCallback(
    (url: string | undefined) => {
      if (isDisabled) return
      setValue("mainImage", url || "")
    },
    [setValue, isDisabled],
  )

  const handleImagesSelect = useCallback(
    (urls: string[]) => {
      if (isDisabled) return
      setValue("images", urls)
    },
    [setValue, isDisabled],
  )

  const handleRemoveImage = useCallback(
    (index: number) => {
      if (isDisabled) return
      const currentImages = images || []
      const newImages = currentImages.filter((_, i) => i !== index)
      setValue("images", newImages)
    },
    [images, setValue, isDisabled],
  )

  // Separar valores de texto de valores de imagen para evitar re-renders innecesarios
  const textValues = useMemo(
    () => ({
      title: title || "", // Usar el valor directo, no el debounced
      motto: motto || "", // Usar el valor directo, no el debounced
    }),
    [title, motto],
  )

  // Memoizar valores de imagen por separado - solo cambian cuando las imágenes cambian
  const imageValues = useMemo(
    () => ({
      mainImage,
      images: images || [],
    }),
    [mainImage, images],
  )

  return (
    <Box>
      {/* Header mejorado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                ¡Tu Gran Idea!
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="500">
                Comienza por lo esencial: dale un nombre impactante y un lema memorable
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <Stack spacing={2}>
        {/* Formulario Principal - Diseño perfeccionado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Título de la iniciativa */}
          <FormTextField
            register={register("title")}
            label="Título de la iniciativa"
            placeholder="Título claro y conciso de la iniciativa"
            value={textValues.title}
            error={errors.title}
            maxLength={100}
            onClear={clearTitle}
            disabled={isDisabled}
          />

          {/* Líder de la iniciativa - Solo para mostrar, no parte del formulario */}
          <FormTextField
            register={{
              name: "leader",
              onChange: async () => {},
              onBlur: async () => {},
              ref: () => {},
            }}
            label="Líder de la iniciativa"
            placeholder="Obtenido automáticamente de tu perfil"
            value={userFromApi?.name || ""}
            error={undefined}
            disabled={true}
            onClear={() => {}} // Función vacía ya que está disabled
          />

          {/* Lema de la iniciativa */}
          <FormTextField
            register={register("motto")}
            label="Lema de la iniciativa"
            placeholder="Lema claro y conciso de la iniciativa"
            value={textValues.motto}
            error={errors.motto}
            maxLength={200}
            multiline={true}
            maxRows={6}
            minRows={2}
            labelFontSize="1.45rem"
            legendFontSize="1.1rem"
            disabled={isDisabled}
          />
        </motion.div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
          {/* Sección de Imágenes mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                  Sube imágenes o videos que muestren tu iniciativa
                </Typography>
                {/* <Chip label="Opcional" size="small" sx={{ ml: 1.5 }} color="default" /> */}
              </Box>
            </Box>

            {/* Componente de upload - más compacto */}
            <ImageUpload
              mainImage={imageValues.mainImage}
              images={imageValues.images}
              onMainImageSelect={handleMainImageSelect}
              onImagesSelect={handleImagesSelect}
              maxSecondaryImages={5}
              error={errors.mainImage}
              disabled={isDisabled}
            />
          </motion.div>

          {/* Slider de imágenes */}
          <ImageSlider
            mainImage={imageValues.mainImage}
            images={imageValues.images}
            onRemoveMain={clearMainImage}
            onRemoveImage={handleRemoveImage}
            disabled={isDisabled}
          />
        </Box>
      </Stack>
    </Box>
  )
})

Step1Component.displayName = "Step1Component"

export default Step1Component
