import React, { useState, useCallback, useRef } from "react"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Star from "@mui/icons-material/Star";
import Image from "@mui/icons-material/Image";
import { ImageCropperDialog } from "./ImageCropperDialog"
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/utils/upload-cloudinary"
import type { FieldError } from "react-hook-form"

interface ImageUploadProps {
  mainImage?: string
  images: string[]
  onMainImageSelect: (url: string) => void
  onImagesSelect: (urls: string[]) => void
  maxSecondaryImages?: number
  error?: FieldError
  disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  mainImage,
  images,
  onMainImageSelect,
  onImagesSelect,
  maxSecondaryImages = 5,
  error,
  disabled = false,
}) => {
  const theme = useTheme()
  const [dragActive, setDragActive] = useState<"main" | "secondary" | null>(null)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingSecondary, setUploadingSecondary] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  /* ---------------------------- Estados recorte --------------------------- */
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string>("")
  const [fileBeingCropped, setFileBeingCropped] = useState<{ file: File; isMain: boolean } | null>(null)
  const queueRef = useRef<Array<{ file: File; isMain: boolean }>>([])

  /** Abre el diálogo de recorte para el archivo indicado */
  const prepareCropper = useCallback((file: File, isMain: boolean) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string)
      setFileBeingCropped({ file, isMain })
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
  }, [])

  /** Cuando finaliza o se cancela un recorte, procesa el siguiente en cola */
  const processNextInQueue = useCallback(() => {
    if (queueRef.current.length === 0) return
    const next = queueRef.current.shift()!
    prepareCropper(next.file, next.isMain)
  }, [prepareCropper])

  const handleCropCancel = useCallback(() => {
    setCropperOpen(false)
    setFileBeingCropped(null)
    setCropImageSrc("")
    processNextInQueue()
  }, [processNextInQueue])

  const showError = useCallback((message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 4000)
  }, [])

  // Validar tipos de archivo permitidos
  const validateFileType = useCallback((file: File): boolean => {
    const allowedTypes = [
      // Imágenes
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      // Videos
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
      "video/x-msvideo",
    ]

    return allowedTypes.includes(file.type.toLowerCase())
  }, [])

  // Validar tamaño de archivo
  const validateFileSize = useCallback((file: File): { isValid: boolean; error?: string } => {
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    const maxImageSize = 10 * 1024 * 1024 // 10 MB
    const maxVideoSize = 50 * 1024 * 1024 // 50 MB

    if (isImage && file.size > maxImageSize) {
      return {
        isValid: false,
        error: `La imagen "${file.name}" es muy grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo permitido: 10 MB.`,
      }
    }

    if (isVideo && file.size > maxVideoSize) {
      return {
        isValid: false,
        error: `El video "${file.name}" es muy grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo permitido: 50 MB.`,
      }
    }

    return { isValid: true }
  }, [])

  // Upload real a Cloudinary - usar declaraciones de función para permitir hoisting
  const uploadSingleFile = useCallback(async (file: File): Promise<string> => {
    try {
      const url = await uploadToCloudinary(file)
      return url
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }, [])

  const uploadMultipleFiles = useCallback(
    async (files: File[]): Promise<{ successful: string[]; failed: { file: string; error: string }[] }> => {
      try {
        const result = await uploadMultipleToCloudinary(files)
        return result
      } catch (error) {
        console.error("Error uploading multiple files:", error)
        throw error
      }
    },
    [],
  )

  const handleDrag = useCallback(
    (e: React.DragEvent, type: "main" | "secondary") => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(type)
      } else if (e.type === "dragleave") {
        setDragActive(null)
      }
    },
    [disabled],
  )

  const handleMainImageDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      setDragActive(null)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]

        // Validar tipo de archivo
        if (!validateFileType(file)) {
          showError(
            `El archivo "${file.name}" no es una imagen o video válido. Solo se permiten imágenes (JPG, PNG, GIF, WebP, SVG, BMP) y videos (MP4, WebM, OGG, AVI, MOV).`,
          )
          return
        }

        // Validar tamaño de archivo
        const sizeValidation = validateFileSize(file)
        if (!sizeValidation.isValid) {
          showError(sizeValidation.error!)
          return
        }

        // Si es imagen abrimos el recorte
        if (file.type.startsWith("image/")) {
          if (cropperOpen) {
            queueRef.current.push({ file, isMain: true })
          } else {
            prepareCropper(file, true)
          }
          return
        }

        // Para videos continuamos flujo original
        setUploadingMain(true)
        try {
          const url = await uploadSingleFile(file)
          onMainImageSelect(url)
        } catch {
          showError("Error al subir la imagen principal. Inténtalo de nuevo.")
        } finally {
          setUploadingMain(false)
        }
      }
    },
    [
      disabled,
      validateFileType,
      validateFileSize,
      showError,
      cropperOpen,
      prepareCropper,
      queueRef,
      uploadSingleFile,
      onMainImageSelect,
    ],
  )

  const handleSecondaryImagesDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      setDragActive(null)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const allFiles = Array.from(e.dataTransfer.files)
        const availableSlots = maxSecondaryImages - images.length

        // Validar tipos de archivo
        const validFiles = allFiles.filter((file) => {
          if (!validateFileType(file)) {
            showError(`El archivo "${file.name}" no es una imagen o video válido y será omitido.`)
            return false
          }

          const sizeValidation = validateFileSize(file)
          if (!sizeValidation.isValid) {
            showError(sizeValidation.error!)
            return false
          }

          return true
        })

        if (validFiles.length === 0) {
          return
        }

        const newFiles = validFiles.slice(0, availableSlots)

        if (newFiles.length > 0) {
          const videos: File[] = []

          newFiles.forEach((file) => {
            if (file.type.startsWith("image/")) {
              if (cropperOpen) {
                queueRef.current.push({ file, isMain: false })
              } else {
                prepareCropper(file, false)
              }
            } else {
              videos.push(file)
            }
          })

          if (videos.length > 0) {
            setUploadingSecondary(true)
            try {
              const result = await uploadMultipleFiles(videos)
              const newUrls = [...images, ...result.successful]
              onImagesSelect(newUrls)

              if (result.failed.length > 0) {
                const failedNames = result.failed.map((f) => f.file).join(", ")
                showError(`Error al subir: ${failedNames}`)
              }
            } catch {
              showError("Error al subir las imágenes. Inténtalo de nuevo.")
            } finally {
              setUploadingSecondary(false)
            }
          }

          if (validFiles.length > availableSlots) {
            showError(
              `Solo se pudieron procesar ${newFiles.length} archivos. Límite de ${maxSecondaryImages} imágenes alcanzado.`,
            )
          }
        }
      }
    },
    [
      images,
      maxSecondaryImages,
      onImagesSelect,
      validateFileType,
      validateFileSize,
      showError,
      disabled,
      cropperOpen,
      prepareCropper,
      uploadMultipleFiles,
    ],
  )

  const handleMainImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validar tipo de archivo
      if (!validateFileType(file)) {
        showError(
          `El archivo "${file.name}" no es una imagen o video válido. Solo se permiten imágenes (JPG, PNG, GIF, WebP, SVG, BMP) y videos (MP4, WebM, OGG, AVI, MOV).`,
        )
        e.target.value = "" // Limpiar input
        return
      }

      // Validar tamaño de archivo
      const sizeValidation = validateFileSize(file)
      if (!sizeValidation.isValid) {
        showError(sizeValidation.error!)
        e.target.value = "" // Limpiar input
        return
      }

      if (file.type.startsWith("image/")) {
        if (cropperOpen) {
          queueRef.current.push({ file, isMain: true })
        } else {
          prepareCropper(file, true)
        }
      } else {
        setUploadingMain(true)
        try {
          const url = await uploadSingleFile(file)
          onMainImageSelect(url)
        } catch {
          showError("Error al subir la imagen principal. Inténtalo de nuevo.")
        } finally {
          setUploadingMain(false)
        }
      }

      e.target.value = "" // Limpiar input
    }
  }

  const handleSecondaryImagesInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.target.files) {
      const allFiles = Array.from(e.target.files)
      const availableSlots = maxSecondaryImages - images.length

      // Validar tipos de archivo
      const validFiles = allFiles.filter((file) => {
        if (!validateFileType(file)) {
          showError(`El archivo "${file.name}" no es una imagen o video válido y será omitido.`)
          return false
        }

        const sizeValidation = validateFileSize(file)
        if (!sizeValidation.isValid) {
          showError(sizeValidation.error!)
          return false
        }

        return true
      })

      if (validFiles.length === 0) {
        e.target.value = "" // Limpiar input
        return
      }

      const newFiles = validFiles.slice(0, availableSlots)

      if (newFiles.length > 0) {
        const videos: File[] = []

        newFiles.forEach((file) => {
          if (file.type.startsWith("image/")) {
            if (cropperOpen) {
              queueRef.current.push({ file, isMain: false })
            } else {
              prepareCropper(file, false)
            }
          } else {
            videos.push(file)
          }
        })

        if (videos.length > 0) {
          setUploadingSecondary(true)
          try {
            const result = await uploadMultipleFiles(videos)
            const newUrls = [...images, ...result.successful]
            onImagesSelect(newUrls)

            if (result.failed.length > 0) {
              const failedNames = result.failed.map((f) => f.file).join(", ")
              showError(`Error al subir: ${failedNames}`)
            }
          } catch {
            showError("Error al subir las imágenes. Inténtalo de nuevo.")
          } finally {
            setUploadingSecondary(false)
          }
        }

        if (validFiles.length > availableSlots) {
          showError(
            `Solo se pudieron procesar ${newFiles.length} archivos. Límite de ${maxSecondaryImages} imágenes alcanzado.`,
          )
        }
      }

      e.target.value = "" // Limpiar input para permitir seleccionar los mismos archivos otra vez
    }
  }

  const handleCropComplete = useCallback(
    async (blob: Blob) => {
      if (!fileBeingCropped) return

      const { file, isMain } = fileBeingCropped
      const croppedFile = new File([blob], file.name, { type: file.type })

      if (isMain) {
        setUploadingMain(true)
        try {
          const url = await uploadSingleFile(croppedFile)
          onMainImageSelect(url)
        } catch {
          showError("Error al subir la imagen recortada. Inténtalo de nuevo.")
        } finally {
          setUploadingMain(false)
        }
      } else {
        setUploadingSecondary(true)
        try {
          const url = await uploadSingleFile(croppedFile)
          const newUrls = [...images, url]
          onImagesSelect(newUrls)
        } catch {
          showError("Error al subir la imagen recortada. Inténtalo de nuevo.")
        } finally {
          setUploadingSecondary(false)
        }
      }

      setCropperOpen(false)
      setFileBeingCropped(null)
      setCropImageSrc("")
      processNextInQueue()
    },
    [fileBeingCropped, uploadSingleFile, onMainImageSelect, onImagesSelect, images, showError, processNextInQueue],
  )

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Imagen Principal - Compacta */}
        <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Star sx={{ mr: 1, color: "primary.main", fontSize: 18 }} />
            <Typography variant="subtitle2" fontWeight="600" color="text.primary">
              Principal
            </Typography>
            {mainImage && (
              <Chip
                label={mainImage ? "✓" : "Requerida"}
                size="small"
                color={mainImage ? "primary" : "warning"}
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box
            onDragEnter={(e) => handleDrag(e, "main")}
            onDragLeave={(e) => handleDrag(e, "main")}
            onDragOver={(e) => handleDrag(e, "main")}
            onDrop={handleMainImageDrop}
            sx={{
              border: `2px dashed ${
                dragActive === "main" ? theme.palette.warning.main : alpha(theme.palette.divider, 0.3)
              }`,
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: uploadingMain || disabled ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              background:
                dragActive === "main"
                  ? alpha(theme.palette.warning.main, 0.05)
                  : alpha(theme.palette.background.paper, 0.5),
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              opacity: disabled ? 0.6 : 1,
              "&:hover":
                !uploadingMain && !disabled
                  ? {
                      borderColor: theme.palette.warning.main,
                      background: alpha(theme.palette.warning.main, 0.05),
                    }
                  : {},
            }}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMainImageInput}
              style={{ display: "none" }}
              id="main-image-upload"
              disabled={uploadingMain || disabled}
            />

            {uploadingMain ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CircularProgress size={24} thickness={4} sx={{ color: theme.palette.warning.main, mb: 1 }} />
                <Typography variant="caption" color="warning.main" fontWeight="600">
                  Subiendo...
                </Typography>
              </Box>
            ) : (
              <label
                htmlFor="main-image-upload"
                style={{
                  cursor: disabled ? "not-allowed" : "pointer",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Image
                  sx={{
                    fontSize: 32,
                    color: dragActive === "main" ? "warning.main" : "text.secondary",
                    mb: 1,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  {disabled
                    ? "Subida de archivos deshabilitada"
                    : dragActive === "main"
                      ? "Suelta aquí"
                      : "Imagen o video principal"}
                </Typography>
              </label>
            )}
          </Box>

          {/* Mensaje de error para imagen principal */}
          {error && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
              {error.message}
            </Typography>
          )}
        </Box>

        {/* Galería Secundaria - Compacta */}
        <Box sx={{ flex: "1 1 300px", minWidth: 250 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Image sx={{ mr: 1, color: "primary.main", fontSize: 18 }} />
            <Typography variant="subtitle2" fontWeight="600" color="text.primary">
              Opcional
            </Typography>
            <Chip
              label={`${images.length}/${maxSecondaryImages}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>

          <Box
            onDragEnter={(e) => handleDrag(e, "secondary")}
            onDragLeave={(e) => handleDrag(e, "secondary")}
            onDragOver={(e) => handleDrag(e, "secondary")}
            onDrop={handleSecondaryImagesDrop}
            sx={{
              border: `2px dashed ${
                dragActive === "secondary" ? theme.palette.primary.main : alpha(theme.palette.divider, 0.3)
              }`,
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              cursor: uploadingSecondary || images.length >= maxSecondaryImages || disabled ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              background:
                dragActive === "secondary"
                  ? alpha(theme.palette.primary.main, 0.05)
                  : alpha(theme.palette.background.paper, 0.5),
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              opacity: images.length >= maxSecondaryImages || disabled ? 0.6 : 1,
              "&:hover":
                !uploadingSecondary && images.length < maxSecondaryImages && !disabled
                  ? {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.05),
                    }
                  : {},
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleSecondaryImagesInput}
              style={{ display: "none" }}
              id="secondary-images-upload"
              disabled={uploadingSecondary || images.length >= maxSecondaryImages || disabled}
            />

            {uploadingSecondary ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CircularProgress size={24} thickness={4} sx={{ color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="caption" color="primary.main" fontWeight="600">
                  Subiendo...
                </Typography>
              </Box>
            ) : (
              <label
                htmlFor="secondary-images-upload"
                style={{
                  cursor: disabled || images.length >= maxSecondaryImages ? "not-allowed" : "pointer",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <CloudUpload
                  sx={{
                    fontSize: 32,
                    color: dragActive === "secondary" ? "primary.main" : "text.secondary",
                    mb: 1,
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  {disabled
                    ? "Subida de archivos deshabilitada"
                    : images.length >= maxSecondaryImages
                      ? "Límite alcanzado"
                      : dragActive === "secondary"
                        ? "Suelta aquí"
                        : "Arrastra o selecciona archivos"}
                </Typography>
              </label>
            )}
          </Box>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1, fontSize: 12 }}>
        Tamaño máximo: 10 MB para imágenes y 50 MB para videos
      </Typography>

      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar para mostrar éxitos */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Diálogo de recorte */}
      <ImageCropperDialog
        open={cropperOpen}
        onCancel={handleCropCancel}
        onComplete={handleCropComplete}
        imageSrc={cropImageSrc}
      />
    </>
  )
}
