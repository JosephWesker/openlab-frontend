import React, { useState, useCallback } from "react"
import Cropper, { type Area } from "react-easy-crop"
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

interface ImageCropperDialogProps {
  /** Controla la visibilidad del diálogo */
  open: boolean
  /** Fuente de la imagen a recortar (data URL) */
  imageSrc: string
  /** Disparado al cancelar el recorte */
  onCancel: () => void
  /** Disparado al confirmar el recorte. Se devuelve el Blob resultante */
  onComplete: (blob: Blob) => void
}

/** Utilidad interna para convertir el resultado del recorte en un Blob */
async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = (err) => reject(err)
    image.src = imageSrc
  })

  const canvas = document.createElement("canvas")
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No se pudo obtener el contexto del canvas")
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("No se pudo crear el blob de la imagen"))
      },
      "image/jpeg",
      0.95,
    )
  })
}

/**
 * Diálogo reutilizable que permite al usuario recortar una imagen en formato cuadrado.
 * Utiliza react-easy-crop para la UI de recorte.
 */
export const ImageCropperDialog: React.FC<ImageCropperDialogProps> = ({ open, imageSrc, onCancel, onComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const handleCropComplete = useCallback((_ignored: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!croppedArea) return
    const blob = await getCroppedBlob(imageSrc, croppedArea)
    onComplete(blob)
  }, [croppedArea, imageSrc, onComplete])

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onCancel} sx={{ overflow: "hidden" }}>
      <DialogContent sx={{ position: "relative", height: 400, overflow: "hidden", backgroundColor: "white" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          minZoom={1}
          maxZoom={5}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          showGrid={false}
        />
        {/* Slider de zoom */}
        <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <Chip
            label={`Zoom ${zoom.toFixed(1)}x`}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.main",
              color: "white",
              width: "fit-content",
              margin: "0 auto",
              fontWeight: "600",
            }}
          />
          <Box sx={{ width: "100%", px: "1rem" }}>
            <Slider
              value={zoom}
              min={1}
              max={5}
              step={0.1}
              size="small"
              onChange={(_, value) => setZoom(value as number)}
              sx={{
                "& .MuiSlider-track": {
                  height: 4,
                },
                "& .MuiSlider-rail": {
                  height: 4,
                },
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                },
              }}
            />
          </Box>
          {/* Chips de valores de zoom */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Typography
                key={value}
                variant="caption"
                onClick={() => setZoom(value)}
                sx={{
                  color: "white",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                  fontWeight: "600",
                  fontSize: "0.5rem",
                  textAlign: "center",
                  padding: "2px 6px",
                  borderRadius: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(4px)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {value}.0x
              </Typography>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Recortar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
