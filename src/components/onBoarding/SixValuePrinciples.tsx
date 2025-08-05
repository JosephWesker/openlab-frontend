import React from "react"
import { Box, Typography, Container, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"
import {
  AccountBalance as IntrinsicIcon,
  TrendingUp as LiquidityIcon,
  Security as AntiWhaleIcon,
} from "@mui/icons-material"

interface ValuePrinciple {
  id: string
  title: string
  description: string
  details: string
  icon: React.ReactNode
  emoji: string
  color: string

}

const valuePrinciples: ValuePrinciple[] = [
  {
    id: "intrinsic",
    title: "Valor Intrínseco del Token",
    description:
      "Los tokens de proyecto están respaldados por la propiedad intelectual generada por la iniciativa y el derecho a futuras regalías/beneficios del proyecto, no solo por especulación.",
    details: "Esta vinculación es clave.",
    icon: <IntrinsicIcon sx={{ fontSize: 50 }} />,
    emoji: "💎",
    color: "#588CFF",
  },
  {
    id: "liquidity",
    title: "Liquidez y Mercado Secundario",
    description:
      "Una vez que exista un mercado secundario (exchange), los tokens serán líquidos y transferibles. Su valor fluctuará según la oferta y la demanda, que estará ligada al éxito del proyecto y su adopción.",
    details: "",
    icon: <LiquidityIcon sx={{ fontSize: 50 }} />,
    emoji: "🔄",
    color: "#8C58FF",
  },
  {
    id: "antiwhale",
    title: "Protección contra Manipulación (Anti-Whale)",
    description:
      "La acuñación continua de tokens en función de las colaboraciones validadas diluye el poder de los grandes poseedores a largo plazo, protegiendo la descentralización del proyecto contra la concentración excesiva de la propiedad.",
    details:
      "Mientras el proyecto genera trabajo y valor, los tokens se seguirán distribuyendo, asegurando que la propiedad permanezca en manos de los constructores activos.",
    icon: <AntiWhaleIcon sx={{ fontSize: 50 }} />,
    emoji: "🛡️",
    color: "#A855F7",
  },
]

export const SixValuePrinciples: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.8,
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
        delay: index * 0.2,
        duration: 0.8,
      },
    }),
  }

  const illustrationVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.5,
        duration: 1,
      },
    },
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
                  fontWeight: 700,
                  mb: 2,
                  color: "primary.main",
                  lineHeight: 1.2,
                }}
              >
                Principios de Valor y Liquidez
              </Typography>
            </motion.div>

            <motion.div variants={titleVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.primary",
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1.6,
                  mb: 6,
                }}
              >
                Nuestro modelo busca alinear incentivos y garantizar la salud económica de cada iniciativa:
              </Typography>
            </motion.div>
          </Box>

          <motion.div>
            <Card
              sx={{
                background: "#3D7BFF",
                borderRadius: 4,
                overflow: "visible",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  transition: "all 0.4s ease-in-out",
                  boxShadow: `0 25px 50px #3D7BFF40`,
                },
                transition: "all 0.4s ease-in-out",
                boxShadow: `0 12px 40px #3D7BFF25`,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "center", md: "flex-start" },
                    textAlign: { xs: "center", md: "left" },
                    gap: 3,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(10px)",
                      color: "white",
                      fontSize: "4rem",
                      flexShrink: 0,
                      boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    👁️
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: "1.2rem", md: "1.4rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      Para OpenLab, la transparencia y la meritocracia no son solo ideales, sino la ventaja competitiva
                      que nos diferencia.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 1.6,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        mb: 2,
                      }}
                    >
                      Al hacer que el funcionamiento interno de los proyectos sea visible y al recompensar el valor de
                      forma justa y programática, construimos un ecosistema donde la innovación no solo florece, sino
                      que es respaldada de quienes la hacen posible.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.9)",
                        lineHeight: 1.6,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        mb: 2,
                      }}
                    >
                      Esto es fundamental para atraer y retener a nuestra comunidad de iniciadores, colaboradores e
                      inversores.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Decorative floating element */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              />
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row items-center gap-8 mt-12">
            {/* Content Section */}
            <div className="w-full lg:w-2/3">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {valuePrinciples.map((principle, index) => (
                  <motion.div key={principle.id} variants={cardVariants} custom={index}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        overflow: "visible",
                        position: "relative",
                        background: `linear-gradient(135deg, #6193ff15 0%, #6193ff05 100%)`,

                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          transition: "all 0.4s ease-in-out",
                        },
                        transition: "all 0.4s ease-in-out",
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "center", md: "flex-start" },
                            textAlign: { xs: "center", md: "left" },
                            gap: 3,
                          }}
                        >
                          {/* Icon */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 100,
                              height: 100,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.25)",
                              backdropFilter: "blur(10px)",
                              color: "white",
                              fontSize: "4rem",
                              flexShrink: 0,
                              boxShadow: "0 8px 32px rgba(255, 255, 255, 0.2)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            {principle.emoji}
                          </Box>

                          {/* Content */}
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h5"
                              component="h4"
                              sx={{
                                color: "primary.main",
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: "1.2rem", md: "1.4rem" },
                                lineHeight: 1.3,
                              }}
                            >
                              {principle.title}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                lineHeight: 1.6,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                mb: principle.details ? 2 : 0,
                              }}
                            >
                              {principle.description}
                            </Typography>

                            {principle.details && (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontStyle: "italic",
                                  fontSize: { xs: "0.9rem", md: "1rem" },
                                  lineHeight: 1.5,
                                }}
                              >
                                {principle.details}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Decorative floating element */}
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        }}
                        style={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.3)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </div>

            {/* Illustration Section */}
            <div className="w-full lg:w-1/3">
              <motion.div variants={illustrationVariants}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: { xs: 3, md: 4 },
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 4,
                    boxShadow: "0 10px 40px rgba(61, 123, 255, 0.1)",
                    border: "2px solid rgba(61, 123, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: 300,
                  }}
                >
                  {/* Illustration content */}
                  <Box
                    sx={{
                      textAlign: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "8rem",
                          lineHeight: 1,
                          mb: 2,
                          filter: "drop-shadow(0 4px 20px rgba(61, 123, 255, 0.3))",
                        }}
                      >
                        💎
                      </Typography>
                    </motion.div>

                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Valor Real
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.9rem",
                      }}
                    >
                      Respaldado por trabajo verificado y propiedad intelectual
                    </Typography>
                  </Box>

                  {/* Animated background elements */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.3, 0.1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      top: "20%",
                      right: "10%",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(61, 123, 255, 0.2), transparent)",
                      zIndex: 1,
                    }}
                  />

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.25, 0.1],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      bottom: "15%",
                      left: "15%",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(140, 88, 255, 0.2), transparent)",
                      zIndex: 1,
                    }}
                  />
                </Box>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Box>
  )
}
