import { useState, useCallback } from "react"
import { Box, Typography, IconButton, Modal, CircularProgress, Alert, Snackbar } from "@mui/material"
import { Close as CloseIcon, CameraAlt, UploadFile, ZoomIn, PhotoCamera, Close, CloudUpload } from "@mui/icons-material"
import { useDropzone, type FileRejection } from "react-dropzone"
import { motion, AnimatePresence } from "motion/react"
import { alpha } from "@mui/material/styles"
import { uploadToCloudinary } from "@/utils/upload-cloudinary"

interface ProfileImageUploadProps {
  profileImage: string | undefined
  onImageSelect: (url: string | undefined) => void
  disabled?: boolean
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImage,
  onImageSelect,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const showError = useCallback((message: string) => {
    setErrorMessage(message)
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0]
        if (firstError.code === "file-invalid-type") {
          showError("Tipo de archivo no válido. Solo se permiten imágenes.")
        } else if (firstError.code === "file-too-large") {
          showError("La imagen es muy grande. El máximo es 5MB.")
        } else {
          showError(firstError.message)
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploading(true)
        setErrorMessage(null)
        try {
          const url = await uploadToCloudinary(file)
          onImageSelect(url)
        } catch (error) {
          console.error("Error uploading file:", error)
          showError("Error al subir la imagen. Inténtalo de nuevo.")
        } finally {
          setUploading(false)
        }
      }
    },
    [onImageSelect, showError],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
      "image/svg+xml": [],
      "image/bmp": [],
    },
    // maxSize: 5 * 1024 * 1024, // 5 MB
    multiple: false,
    noClick: true, // Desactivamos el click automático para manejarlo manualmente
    noKeyboard: true,
    disabled: disabled || uploading,
  })

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageSelect(undefined)
  }

  const handleZoomImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (profileImage) {
      setZoomedImage(profileImage)
    }
  }

  const handleCloseZoom = () => {
    setZoomedImage(null)
  }

  const handleOpenFileDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    open()
  }

  return (
    <>
      <Box
        {...getRootProps()}
        onClick={handleOpenFileDialog}
        sx={{
          position: "relative",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: "3px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.400",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          bgcolor: isDragActive ? alpha("#6366f1", 0.1) : "grey.100",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "primary.dark",
            transform: "scale(1.03)",
            boxShadow: `0 0 15px 5px ${alpha("#6366f1", 0.2)}`,
          },
          ...(isDragActive && {
            transform: "scale(1.05)",
            boxShadow: `0 0 20px 8px ${alpha("#6366f1", 0.3)}`,
          }),
        }}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <CircularProgress />
        ) : (
          <AnimatePresence>
            {profileImage ? (
              <>
                <motion.img
                  src={profileImage}
                  alt="Imagen de perfil"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  className="image-overlay"
                  onClick={(e) => e.stopPropagation()} // Evita que el click en el overlay abra el diálogo
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <IconButton onClick={handleZoomImage} sx={{ color: "white" }}>
                    <ZoomIn />
                  </IconButton>
                  <IconButton onClick={() => handleOpenFileDialog()} component="span" sx={{ color: "white" }}>
                    <PhotoCamera />
                  </IconButton>
                  <IconButton onClick={handleRemoveImage} sx={{ color: "white" }}>
                    <Close />
                  </IconButton>
                </Box>
                {isDragActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(99, 102, 241, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: isDragActive ? "primary.main" : "text.secondary",
                  transition: "color 0.3s ease",
                  backgroundColor: alpha("#ffffff", 0.7),
                  p: 2,
                }}
              >
                {isDragActive ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <UploadFile sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Suelta la imagen aquí
                    </Typography>
                  </motion.div>
                ) : (
                  <>
                    <CameraAlt sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Arrastra o haz clic
                    </Typography>
                    <Typography variant="caption">para cambiar la imagen</Typography>
                  </>
                )}
              </Box>
            )}
          </AnimatePresence>
        )}
      </Box>

      <Modal open={!!zoomedImage} onClose={handleCloseZoom}>
        <Box
          onClick={handleCloseZoom}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            cursor: "pointer",
          }}
        >
          <AnimatePresence>
            {zoomedImage && (
              <motion.img
                src={zoomedImage}
                alt="Vista ampliada"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxHeight: "90%",
                  maxWidth: "90%",
                  borderRadius: 8,
                  cursor: "default",
                }}
              />
            )}
          </AnimatePresence>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleCloseZoom()
            }}
            sx={{ position: "absolute", top: 16, right: 16, color: "black", backgroundColor: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>

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
    </>
  )
}
