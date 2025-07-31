import React from "react"
import { Box, Typography } from "@mui/material"

interface StepTipsProps {
  step: number
}

const StepTips: React.FC<StepTipsProps> = ({ step }) => {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              🧠 Paso 1: La Idea
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Título:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                ¡El anzuelo! 🎣 Debe ser claro, único y memorable. Piensa en el nombre de tu proyecto.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Lema:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                En una frase, ¿qué problema resuelves o qué creas? Sé conciso y atractivo.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Visual:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Tu primera impresión. 📸 Una imagen o video potente que represente fielmente tu visión.
              </Typography>
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              🛠️ Paso 2: El Producto
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Etiquetas:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Usa palabras clave relevantes. Facilitará que te descubran.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Descripción Detallada:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Explica la visión completa. Sé específico sobre el problema, la solución y tu visión a largo plazo.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Información del Mercado:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                ¿Cuál es la oportunidad real? Describe brevemente el problema en el mercado y cómo encaja tu iniciativa.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Características:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Destaca las funcionalidades clave o aspectos únicos que te hacen diferente o valioso.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Objetivos Iniciales:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Define metas realistas y medibles para las primeras fases. Genera confianza y claridad para
                colaboradores.
              </Typography>
            </Box>
          </Box>
        )

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              🤝 Paso 3: El Equipo
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Co-fundadores:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Un equipo inicial sólido es fundamental para el éxito y la pre-aprobación. Incluye a quienes ya están
                comprometidos con tu iniciativa y tu visión.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Perfiles que estás buscando:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Sé específico sobre roles y habilidades necesarias. Ayuda a conectar con colaboradores adecuados y el
                valor que aportan.
              </Typography>
            </Box>
          </Box>
        )

      case 4:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              🔗 Paso 4: Herramientas Externas
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Redes Sociales:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Comparte tus perfiles sociales relevantes. Son un canal clave para la comunidad y visibilidad.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Enlaces Externos:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Si ya tienes presencia o usas plataformas (Discord, GitHub, Dwork, Aragon), proporciona los enlaces
                directos. Facilita la unión de colaboradores.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "error.dark" }}>
                Importante:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, color: "error.dark" }}>
                Enlaces a Dwork, Aragon, Discord y GitHub para la gestión oficial serán activados por OpenLab una vez
                aprobada tu iniciativa.
              </Typography>
            </Box>
          </Box>
        )

      case 5:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              📈 Paso 5: Actualizaciones y Roadmap Mantén a tu Comunidad Informada
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Actualizaciones:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Comparte avances, hitos logrados y novedades. La transparencia genera confianza y compromiso.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Roadmap:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Delinea las fases y el plan a futuro. Un roadmap claro muestra dirección y potencial de crecimiento.
                Define hitos clave y su estado (ej. "Desarrollo del MVP", "Lanzamiento Beta").
              </Typography>
            </Box>
          </Box>
        )

      case 6:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              ✅ Paso 6: Revisión
            </Typography>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Revisa Todo:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Asegúrate de que la información sea clara, precisa y refleje fielmente tu visión. Esta es la versión que
                verá la comunidad.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                Completa los Pasos:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Verifica que todos los campos requeridos estén llenos. No podrás enviar sin información completa.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "primary.main" }}>
                ¿Listo para la Comunidad?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Una vez enviado, tu propuesta será visible. Te notificaremos sobre su progreso y si alcanza el umbral de
                pre-aprobación.
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                ¡Éxito con tu propuesta en OpenLab!
              </Typography>
            </Box>
          </Box>
        )

      default:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Consejos no disponibles para este paso.
            </Typography>
          </Box>
        )
    }
  }

  return renderStepContent()
}

export default StepTips
