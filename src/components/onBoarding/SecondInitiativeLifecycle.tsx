import React, { useState } from "react"
import { Box, Typography, Card, CardContent, Icon, Container } from "@mui/material"
import { motion } from "framer-motion"
import { Lightbulb, HowToVote, RocketLaunch, ArrowDownward } from "@mui/icons-material"

interface Phase {
  id: number
  title: string
  icon: React.ElementType
  emoji: string
}

const phases: Phase[] = [
  {
    id: 1,
    title: "Fase 1: Propuesta y Refinamiento",
    icon: Lightbulb,
    emoji: "💡",
  },
  {
    id: 2,
    title: "Fase 2: Validación Comunitaria (Votación)",
    icon: HowToVote,
    emoji: "👍👎",
  },
  {
    id: 3,
    title: "Fase 3: Lanzamiento y Desarrollo",
    icon: RocketLaunch,
    emoji: "🚀",
  },
]

export const SecondInitiativeLifecycle: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.8,
      },
    },
  }

  const subtitleVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 80,
        duration: 0.6,
      },
    },
  }

  const phaseVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
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
        delay: index * 0.2,
        duration: 0.8,
      },
    }),
  }

  const arrowVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.8,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        delay: index * 0.2 + 0.5,
        duration: 0.6,
      },
    }),
  }

  const activationTextVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0,
        duration: 0.8,
      },
    },
  }

  const infrastructureItemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.9,
    },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 0.15,
        duration: 0.6,
      },
    }),
  }

  return (
    <Box
      sx={{
        pt: { xs: 8, md: 12 },
        px: 4,
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
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div variants={titleVariants}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 600,
                  mb: 2,
                  color: "primary.main",
                  lineHeight: 1.2,
                }}
              >
                El Ciclo de Vida de una Iniciativa:
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 3,
                  lineHeight: 1.4,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                De la Chispa a la Realidad
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.primary",
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Toda gran iniciativa en OpenLab sigue un camino diseñado para asegurar su viabilidad y el apoyo genuino
                de la comunidad.
              </Typography>
            </motion.div>
          </Box>

          {/* Phases */}
          <Box sx={{ mb: 8 }}>
            {phases.map((phase, index) => (
              <Box key={phase.id}>
                <motion.div
                  variants={phaseVariants}
                  custom={index}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Card
                    elevation={hoveredIndex === index ? 12 : 4}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      // p: { xs: 3, md: 4 },
                      maxWidth: "700px",
                      mx: "auto",
                      // height: "100%",
                      borderRadius: 4,
                      transition: "box-shadow 0.3s ease-in-out",
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: { xs: "column", md: "row" },
                          textAlign: { xs: "center", md: "left" },
                        }}
                      >
                        {/* Icon */}
                        <Box
                          sx={{
                            maxWidth: 160,
                            height: 60,
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 2,
                            fontSize: "2rem",
                          }}
                        >
                          {phase.emoji}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h5"
                            component="h4"
                            sx={{
                              color: "primary.main",
                              fontWeight: 700,
                              // mb: 1,
                              fontSize: { xs: "1.3rem", md: "1.5rem" },
                            }}
                          >
                            {phase.title}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Arrow between phases */}
                {index < phases.length - 1 && (
                  <motion.div variants={arrowVariants} custom={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 4,
                      }}
                    >
                      <motion.div
                        animate={{
                          y: [0, 10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon
                          component={ArrowDownward}
                          sx={{
                            fontSize: 48,
                            color: "primary.main",
                            filter: "drop-shadow(0 4px 8px rgba(61, 123, 255, 0.3))",
                          }}
                        />
                      </motion.div>
                    </Box>
                  </motion.div>
                )}
              </Box>
            ))}
          </Box>

          {/* Activation Section */}
          <motion.div
            variants={activationTextVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textAlign: "center",
                  mb: 4,
                }}
              >
                Al activar la iniciativa nuestro protocolo crea su infraestructura descentralizada:
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                {[
                  {
                    title: "Acuñación de Tokens:",
                    description:
                      "Se crea un suministro inicial de tokens ERC-20 únicos para la iniciativa. Estos tokens representan propiedad, y son los que se distribuirán a fundadores, colaboradores e inversionistas.",
                  },
                  {
                    title: "Creación de la DAO:",
                    description:
                      "Se despliega una Organización Autónoma Descentralizada (DAO) en la blockchain de Polygon a través de Aragon, convirtiéndose en la entidad operativa para almacenamiento de tokens y fondos, y su distribución.",
                  },
                  {
                    title: "Transferencia a la Tesorería:",
                    description:
                      "Los tokens se distribuyen a través de la plataforma Dework, una vez que son validadas tareas que se cumplen para el desarrollo del proyecto.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={infrastructureItemVariants}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Box
                      sx={{
                        textAlign: "left",
                        p: 3,
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: 2,
                        border: "1px solid rgba(61, 123, 255, 0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h4"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          mb: 1,
                        }}
                      >
                        • {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  )
}
