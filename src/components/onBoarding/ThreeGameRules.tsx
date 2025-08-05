import React, { useState } from "react"
import { Box, Typography, Container, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"

interface GameRule {
  id: number
  title: string
  emoji: string
}

const gameRules: GameRule[] = [
  {
    id: 1,
    title: "Todas las contribuciones se pagan con tokens.",
    emoji: "🪙",
  },
  {
    id: 2,
    title: "Si no hay fondos en la DAO, no se pueden pagar contribuciones.",
    emoji: "🏦",
  },
  {
    id: 3,
    title: "Depositar fondos en una iniciativa",
    emoji: "💰",
  },
  {
    id: 4,
    title: "Sin colaboraciones validadas, no se generan tokens.",
    emoji: "✅",
  },
  {
    id: 5,
    title: "El pago es cronológico y justo.",
    emoji: "⏰",
  },
  {
    id: 6,
    title: "Las ganancias se distribuyen entre los poseedores de tokens.",
    emoji: "📊",
  },
  {
    id: 7,
    title: "Los tokens son activos y transferibles.",
    emoji: "🔄",
  },
]

export const ThreeGameRules: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
                  color: "primary.main",
                  lineHeight: 1.2,
                }}
              >
                Las Reglas del Juego:
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 3,
                }}
              >
                Nuestros 7 Principios Fundamentales
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.primary",
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                El protocolo de OpenLab opera bajo principios inmutables que aseguran la transparencia y la alineación
                de incentivos. Haz clic en cada axioma para ver su explicación.
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
    </Box>
  )
}
