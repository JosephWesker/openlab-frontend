import React, { useState, useMemo, useCallback, useEffect } from "react"
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Close from "@mui/icons-material/Close"
import ZoomIn from "@mui/icons-material/ZoomIn"
import Star from "@mui/icons-material/Star"
import Collections from "@mui/icons-material/Collections"
import NavigateBefore from "@mui/icons-material/NavigateBefore"
import NavigateNext from "@mui/icons-material/NavigateNext"
import PlayArrow from "@mui/icons-material/PlayArrow"
import Image from "@mui/icons-material/Image"
import VideoLibrary from "@mui/icons-material/VideoLibrary"
import { motion } from "motion/react"

interface ImageSliderProps {
  mainImage?: string
  images: string[]
  onRemoveMain: () => void
  onRemoveImage: (index: number) => void
  disabled?: boolean
}

export const ImageSlider: React.FC<ImageSliderProps> = React.memo(
  ({ mainImage, images, onRemoveMain, onRemoveImage, disabled = false }) => {
    const theme = useTheme()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [zoomedImage, setZoomedImage] = useState<string | null>(null)
    const [zoomedImageTitle, setZoomedImageTitle] = useState<string>("")
    const [zoomedIndex, setZoomedIndex] = useState<number>(0)

    // Memoizar función de detección de video
    const isVideo = useCallback((url: string): boolean => {
      // Detectar por extensión en la URL
      const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv", "video"]
      const urlLower = url.toLowerCase()
      return videoExtensions.some((ext) => urlLower.includes(ext))
    }, [])

    // Memoizar las URLs para evitar recreación en cada render
    const imageData = useMemo(() => {
      // Las URLs ya están listas para usar
      const mainImageUrl = mainImage || null
      const imageUrls = images || []
      const allImages = mainImageUrl ? [mainImageUrl, ...imageUrls] : imageUrls
      const allFiles = allImages // Los archivos son las mismas URLs
      const allTitles = mainImageUrl
        ? [`Principal`, ...imageUrls.map((_, index) => `Opcional ${index + 1}`)]
        : imageUrls.map((_, index) => `Opcional ${index + 1}`)

      return {
        mainImageUrl,
        imageUrls,
        allImages,
        allFiles,
        allTitles,
      }
    }, [mainImage, images])

    // Ya no necesitamos limpiar URLs porque son URLs de Cloudinary
    // useEffect(() => {
    //   return () => {
    //     // Limpiar URLs previas para evitar memory leaks
    //     imageData.allImages.forEach((url) => {
    //       if (url) {
    //         URL.revokeObjectURL(url)
    //       }
    //     })
    //   }
    // }, [imageData.allImages])

    // Memoizar funciones del handler
    const handleZoom = useCallback((imageUrl: string, title: string, index: number) => {
      setZoomedImage(imageUrl)
      setZoomedImageTitle(title)
      setZoomedIndex(index)
    }, [])

    const handleCloseZoom = useCallback(() => {
      setZoomedImage(null)
      setZoomedImageTitle("")
      setZoomedIndex(0)
    }, [])

    const nextZoomedSlide = useCallback(() => {
      const nextIndex = (zoomedIndex + 1) % imageData.allImages.length
      setZoomedIndex(nextIndex)
      setZoomedImage(imageData.allImages[nextIndex])
      setZoomedImageTitle(imageData.allTitles[nextIndex])
    }, [zoomedIndex, imageData.allImages, imageData.allTitles])

    const prevZoomedSlide = useCallback(() => {
      const prevIndex = (zoomedIndex - 1 + imageData.allImages.length) % imageData.allImages.length
      setZoomedIndex(prevIndex)
      setZoomedImage(imageData.allImages[prevIndex])
      setZoomedImageTitle(imageData.allTitles[prevIndex])
    }, [zoomedIndex, imageData.allImages, imageData.allTitles])

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % imageData.allImages.length)
    }, [imageData.allImages.length])

    const prevSlide = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + imageData.allImages.length) % imageData.allImages.length)
    }, [imageData.allImages.length])

    const handleRemove = useCallback(
      (index: number) => {
        if (disabled) return
        if (imageData.mainImageUrl && index === 0) {
          onRemoveMain()
        } else {
          const imageIndex = imageData.mainImageUrl ? index - 1 : index
          onRemoveImage(imageIndex)
        }

        // Ajustar currentIndex si es necesario
        if (currentIndex >= imageData.allImages.length - 1) {
          setCurrentIndex(Math.max(0, imageData.allImages.length - 2))
        }
      },
      [imageData.mainImageUrl, imageData.allImages.length, currentIndex, onRemoveMain, onRemoveImage, disabled],
    )

    // Ajustar currentIndex cuando cambie el número de imágenes
    useEffect(() => {
      if (currentIndex >= imageData.allImages.length && imageData.allImages.length > 0) {
        setCurrentIndex(imageData.allImages.length - 1)
      }
    }, [currentIndex, imageData.allImages.length])

    if (imageData.allImages.length === 0) {
      return null
    }

    return (
      <>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header del slider */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Collections sx={{ mr: 1.5, color: "primary.main", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600" sx={{ flexGrow: 1 }}>
                Vista previa
              </Typography>
              <Chip
                label={`${imageData.allImages.length} ${imageData.allImages.length === 1 ? "archivo" : "archivos"}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Slider principal */}
            <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 240,
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover .image-overlay": {
                      opacity: 1,
                    },
                    "@media (min-width: 600px)": {
                      "&:hover .remove-button": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() =>
                    handleZoom(imageData.allImages[currentIndex], imageData.allTitles[currentIndex], currentIndex)
                  }
                >
                  {isVideo(imageData.allFiles[currentIndex]) ? (
                    <video
                      src={imageData.allImages[currentIndex]}
                      controls
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                        aspectRatio: "16/9",
                      }}
                    />
                  ) : (
                    <img
                      src={imageData.allImages[currentIndex]}
                      alt={imageData.allTitles[currentIndex]}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                        aspectRatio: "16/9",
                      }}
                    />
                  )}

                  {/* Overlay con efectos */}
                  <Box
                    className="image-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "all 0.3s ease",
                      borderRadius: 3,
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton
                        sx={{
                          bgcolor: alpha(theme.palette.common.white, 0.9),
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: theme.palette.common.white,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <ZoomIn fontSize="large" />
                      </IconButton>
                    </motion.div>
                  </Box>

                  {/* Badge de imagen principal */}
                  {imageData.mainImageUrl && currentIndex === 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                      <Chip
                        icon={<Star sx={{ color: theme.palette.warning.main }} />}
                        label="Principal"
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: 600,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Badge de imagen/video secundario */}
                  {currentIndex > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                      <Chip
                        icon={isVideo(imageData.allFiles[currentIndex]) ? <VideoLibrary /> : <Image />}
                        label="Opcional"
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: 600,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Botón de eliminar */}
                  <IconButton
                    className="remove-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(currentIndex)
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: alpha(theme.palette.error.main, 0.9),
                      color: "white",
                      opacity: { xs: 1, sm: 0 }, // Siempre visible en móvil, hover en desktop
                      transition: "all 0.2s ease",
                      zIndex: 10,
                      "&:hover": {
                        bgcolor: theme.palette.error.main,
                        transform: "scale(1.1)",
                      },
                      ...(disabled && {
                        display: "none",
                      }),
                    }}
                    disabled={disabled}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </motion.div>

              {/* Controles de navegación */}
              {imageData.allImages.length > 1 && (
                <>
                  <IconButton
                    onClick={prevSlide}
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      "&:hover": {
                        bgcolor: theme.palette.common.white,
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>

                  <IconButton
                    onClick={nextSlide}
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                      "&:hover": {
                        bgcolor: theme.palette.common.white,
                        transform: "translateY(-50%) scale(1.1)",
                      },
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnails */}
            {imageData.allImages.length > 1 && (
              <Box
                sx={{
                  mt: 2,
                  overflowX: "auto",
                  pb: 1,
                  "&::-webkit-scrollbar": {
                    height: 4,
                  },
                  "&::-webkit-scrollbar-track": {
                    bgcolor: alpha(theme.palette.divider, 0.1),
                    borderRadius: 2,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.5),
                    },
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-start", px: 1 }}>
                  {imageData.allImages.map((imageUrl, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Box
                        onClick={() => setCurrentIndex(index)}
                        sx={{
                          width: { xs: 50, sm: 60 },
                          height: { xs: 50, sm: 60 },
                          borderRadius: { xs: 1.5, sm: 2 },
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            currentIndex === index
                              ? `3px solid ${theme.palette.primary.main}`
                              : `3px solid transparent`,
                          transition: "all 0.3s ease",
                          position: "relative",
                          flexShrink: 0,
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        {isVideo(imageData.allFiles[index]) ? (
                          <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                            <video
                              src={imageUrl}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <PlayArrow
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                color: "white",
                                fontSize: 18,
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                              }}
                            />
                          </Box>
                        ) : (
                          <img
                            src={imageUrl}
                            alt={`Thumbnail ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}

                        {/* Iconos de tipo */}
                        {imageData.mainImageUrl && index === 0 && (
                          <Star
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              fontSize: 16,
                              color: theme.palette.primary.main,
                              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                            }}
                          />
                        )}

                        {index > 0 && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              fontSize: 14,
                              color: "primary.main",
                              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
                            }}
                          >
                            {isVideo(imageData.allFiles[index]) ? (
                              <VideoLibrary fontSize="inherit" />
                            ) : (
                              <Image fontSize="inherit" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            )}

            {/* Info de la imagen actual */}
            {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center", fontWeight: 500 }}>
              {imageData.allTitles[currentIndex]}
            </Typography> */}
          </Box>
        </motion.div>

        {/* Modal de zoom interactivo */}
        <Dialog
          open={!!zoomedImage}
          onClose={handleCloseZoom}
          maxWidth={false}
          fullScreen
          PaperProps={{
            sx: {
              background: alpha(theme.palette.common.black, 0.95),
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <DialogContent sx={{ p: 0, position: "relative", height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Botón de cerrar */}
            <IconButton
              onClick={handleCloseZoom}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: alpha(theme.palette.common.white, 0.1),
                color: "white",
                zIndex: 1000,
                "&:hover": {
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                },
              }}
            >
              <Close />
            </IconButton>

            {/* Área principal de imagen/video */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                height: "100vh", // Usar toda la altura del viewport
                width: "100vw",
                overflow: "hidden",
              }}
            >
              {zoomedImage && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 4,
                  }}
                >
                  {isVideo(imageData.allFiles[zoomedIndex]) ? (
                    <Box
                      component="video"
                      src={zoomedImage}
                      controls
                      autoPlay
                      sx={{
                        maxWidth: { xs: "calc(100vw - 100px)", sm: "calc(100vw - 160px)" }, // Menos espacio para botones en móvil
                        maxHeight: { xs: "calc(100vh - 140px)", sm: "calc(100vh - 180px)" }, // Menos espacio en móvil
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={zoomedImage}
                      alt={zoomedImageTitle}
                      sx={{
                        maxWidth: { xs: "calc(100vw - 100px)", sm: "calc(100vw - 160px)" }, // Menos espacio para botones en móvil
                        maxHeight: { xs: "calc(100vh - 140px)", sm: "calc(100vh - 180px)" }, // Menos espacio en móvil
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Controles de navegación fijos al viewport */}
              {imageData.allImages.length > 1 && (
                <>
                  <IconButton
                    onClick={prevZoomedSlide}
                    sx={{
                      position: "fixed",
                      left: { xs: 8, sm: 24 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: alpha(theme.palette.common.black, 0.6),
                      color: "white",
                      width: { xs: 44, sm: 56 },
                      height: { xs: 44, sm: 56 },
                      zIndex: 1001,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.common.black, 0.8),
                        transform: "translateY(-50%) scale(1.1)",
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <NavigateBefore fontSize="large" />
                  </IconButton>

                  <IconButton
                    onClick={nextZoomedSlide}
                    sx={{
                      position: "fixed",
                      right: { xs: 8, sm: 24 },
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: alpha(theme.palette.common.black, 0.6),
                      color: "white",
                      width: { xs: 44, sm: 56 },
                      height: { xs: 44, sm: 56 },
                      zIndex: 1001,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.common.black, 0.8),
                        transform: "translateY(-50%) scale(1.1)",
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <NavigateNext fontSize="large" />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Miniaturas fijas en la parte inferior */}
            {imageData.allImages.length > 1 && (
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 1, sm: 2 },
                  bgcolor: alpha(theme.palette.common.black, 0.8),
                  borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                  backdropFilter: "blur(10px)",
                  zIndex: 1000,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 0.5, sm: 1 },
                    justifyContent: "flex-start",
                    overflowX: "auto",
                    pb: 1,
                    px: { xs: 1, sm: 0 },
                    "&::-webkit-scrollbar": {
                      height: 4,
                    },
                    "&::-webkit-scrollbar-track": {
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      borderRadius: 2,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      bgcolor: alpha(theme.palette.common.white, 0.3),
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.common.white, 0.5),
                      },
                    },
                  }}
                >
                  {imageData.allImages.map((imageUrl, index) => (
                    <Box
                      key={index}
                      onClick={() => {
                        setZoomedIndex(index)
                        setZoomedImage(imageData.allImages[index])
                        setZoomedImageTitle(imageData.allTitles[index])
                      }}
                      sx={{
                        position: "relative",
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        borderRadius: { xs: 1.5, sm: 2 },
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          zoomedIndex === index ? `3px solid ${theme.palette.primary.main}` : `3px solid transparent`,
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {isVideo(imageData.allFiles[index]) ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            bgcolor: alpha(theme.palette.common.black, 0.5),
                          }}
                        >
                          <video
                            src={imageUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <PlayArrow
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              fontSize: { xs: 16, sm: 20 },
                            }}
                          />
                        </Box>
                      ) : (
                        <img
                          src={imageUrl}
                          alt={`Thumbnail ${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      {/* Indicadores de tipo */}
                      {imageData.mainImageUrl && index === 0 && (
                        <Star
                          sx={{
                            position: "absolute",
                            top: { xs: 2, sm: 4 },
                            right: { xs: 2, sm: 4 },
                            fontSize: { xs: 12, sm: 16 },
                            color: theme.palette.warning.main,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Título de la imagen/video - fijo en la parte superior */}
            <Typography
              variant="h6"
              sx={{
                position: "fixed",
                top: 70,
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                bgcolor: alpha(theme.palette.common.black, 0.7),
                px: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textAlign: "center",
                backdropFilter: "blur(10px)",
                zIndex: 1000,
                maxWidth: "calc(100vw - 32px)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {zoomedImageTitle}
            </Typography>
          </DialogContent>
        </Dialog>
      </>
    )
  },
)

ImageSlider.displayName = "ImageSlider"
