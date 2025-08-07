import React, { useState } from "react"
import { Box, Typography, Container, Card, CardContent, Modal } from "@mui/material"
import { motion } from "framer-motion"

interface GameRule {
  id: number
  title: string
  emoji: string
  description: string
}

const gameRules: GameRule[] = [
  {
    id: 1,
    title: "Todas las contribuciones se pagan con tokens.",
    emoji: "🪙",
    description:
      "Toda aportación de valor validada (trabajo, código, diseño) a un proyecto se recompensa con los tokens nativos de esa iniciativa, convirtiendo el trabajo en propiedad.",
  },
  {
    id: 2,
    title: "Si no hay fondos en la DAO, no se pueden pagar contribuciones.",
    emoji: "🏦",
    description:
      "La capacidad de un proyecto para recompensar el trabajo está directamente limitada por el capital que ha atraído. El protocolo no puede crear valor de la nada.",
  },
  {
    id: 3,
    title: "Depositar fondos en una iniciativa",
    emoji: "💰",
    description:
      "Al depositar fondos en una iniciativa, estos únicamente se invierten, cuando hay trabajo validado por la comunidad. La cantidad de tokens que cada inversionista genera, es proporcional a la cantidad de fondos que tiene ingresados en la iniciativa.",
  },
  {
    id: 4,
    title: "Sin colaboraciones validadas, no se generan tokens.",
    emoji: "✅",
    description:
      "El capital por sí solo no genera propiedad; esta se crea a través del trabajo validado. Los inversionistas reciben tokens en proporción al trabajo que su capital financia, no solo por depositarlo.",
  },
  {
    id: 5,
    title: "El pago es cronológico y justo.",
    emoji: "⏰",
    description:
      'El protocolo opera bajo un principio de "primero en trabajar, primero en ser pagado". Las contribuciones se recompensan en el orden en que fueron validadas, a medida que los fondos están disponibles.',
  },
  {
    id: 6,
    title: "Las ganancias se distribuyen entre los poseedores de tokens.",
    emoji: "📊",
    description:
      "La posesión de tokens otorga un derecho proporcional a los beneficios o ingresos que la iniciativa genere en el futuro, alineando a todos los dueños con el éxito a largo plazo.",
  },
  {
    id: 7,
    title: "Los tokens son activos y transferibles.",
    emoji: "🔄",
    description:
      "Una vez que existe un mercado secundario, los poseedores tienen la libertad de vender su participación. Los tokens son completamente de tu propiedad, y puedes transferirlos libremente como te plazca.",
  },
]

export const ThreeGameRules: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 1,
      },
    },
  }

  const subtitleVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 80,
        duration: 0.8,
      },
    },
  }

  const ruleVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.7,
      rotateX: -20,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 0.15,
        duration: 0.8,
      },
    }),
  }

  const handleCardClick = (index: number) => {
    setShowModal(index)
  }

  const handleCloseModal = () => {
    setShowModal(null)
  }

  return (
    <Box
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div variants={titleVariants}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 600,
                  mb: 2,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                🎯 Las Reglas del Juego
              </Typography>
            </motion.div>
            <motion.div variants={subtitleVariants}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  color: "text.secondary",
                  fontWeight: 400,
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Principios fundamentales que rigen cómo funciona el protocolo OpenLab
              </Typography>
            </motion.div>
          </Box>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameRules.map((rule, index) => (
              <motion.div
                className={index === 6 ? "lg:col-start-2" : ""}
                key={rule.id}
                variants={ruleVariants}
                custom={index}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => handleCardClick(index)}
              >
                <Card
                  elevation={hoveredIndex === index ? 12 : 4}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    textAlign: "center",
                    transition: "all 0.3s ease-in-out",
                    borderLeft: (theme) => `6px solid ${theme.palette.primary.main}`,
                    cursor: "pointer",
                  }}
                >
                  <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "3rem",
                          mb: 2,
                        }}
                      >
                        {rule.emoji}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        Principio {rule.id}:
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          mb: 2,
                        }}
                      >
                        {rule.title}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Simple MUI Modal */}
      <Modal
        open={showModal !== null}
        onClose={handleCloseModal}
        disableScrollLock={true}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            margin: "20px",
            maxWidth: "600px",
            width: "90%",
            outline: "none",
          }}
        >
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Box
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "2.5rem",
                  mb: 1,
                }}
              >
                {showModal !== null ? gameRules[showModal]?.emoji : ""}
              </Typography>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Principio {showModal !== null ? gameRules[showModal]?.id : ""}
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                component="h4"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                {showModal !== null ? gameRules[showModal]?.title : ""}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  textAlign: "justify",
                  color: "text.primary",
                }}
              >
                {showModal !== null ? gameRules[showModal]?.description : ""}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  )
}
