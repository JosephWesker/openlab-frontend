import React, { useState } from "react"
import { Box, Typography, Container, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"
import { theme } from "@/lib/theme"
import collaboratorImage from "@/assets/images/onBoarding/collaborator.png"
import investorImage from "@/assets/images/onBoarding/investor.png"
import leaderImage from "@/assets/images/onBoarding/leader.png"

interface Participant {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
}

const participants: Participant[] = [
  {
    id: "collaborators",
    title: "Colaboradores",
    subtitle: "(El Talento)",
    description:
      "Una vez activa, la iniciativa se integra con Dework. El líder descompone el trabajo en tareas y bounties. Al completar tareas, recibes pagos en tokens del proyecto. Tu trabajo se convierte en propiedad.",
    image: collaboratorImage,
  },
  {
    id: "investors",
    title: "Inversionistas",
    subtitle: "(El Capital)",
    description:
      "Puedes aportar capital directamente a la tesorería de la DAO pero esta no compra tokens, hasta que haya trabajo validado. A cambio, recibes una cantidad proporcional de tokens del proyecto, convirtiéndote en co-propietario.",
    image: investorImage,
  },
  {
    id: "founders",
    title: "Líder de la iniciativa",
    subtitle: "(La Visión)",
    description:
      "El líder y cofundadores no reciben pagos solo hasta que estos se generen de manera dinámica conforme se van generando de los colaboradores e inversionistas, para que siempre mantengan la proporción del 30% de la totalidad del proyecto, lo que asegura su compromiso a largo plazo con el proyecto.",
    image: leaderImage,
  },
]

export const FourIncentiveArchitecture: React.FC = () => {
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
      y: -40,
      scale: 0.9,
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateY: -15,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 0.3,
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
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.2,
                  color: "primary.main",
                }}
              >
                ¿Cómo Participas Tú?
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
                La Arquitectura de Incentivos
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.primary",
                  maxWidth: "700px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                El éxito de un proyecto depende de alinear los intereses de todos. Así es como nuestro protocolo
                distribuye la propiedad:
              </Typography>
            </motion.div>
          </Box>

          {/* Participants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                variants={cardVariants}
                custom={index}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card
                  elevation={hoveredIndex === index ? 12 : 4}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px", // ⬅️  radio único
                    background: `linear-gradient(145deg,
                 ${theme.palette.background.paper},
                 ${theme.palette.background.default})`,
                    ...(hoveredIndex === index && {
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0, // cubre todo el Card
                        padding: "3px", // grosor del borde
                        borderRadius: "inherit", // ⬅️  hereda 16 px
                        background: `conic-gradient(
            from 180deg at 50% 50%,
           ${theme.palette.primary.main} 0%,
            ${theme.palette.primary.main} 50%,
            ${theme.palette.primary.main} 100%)`,
                        // animation: "spin 4s linear infinite",
                        /* genera “agujero” para que se vea el fondo interior */
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, \
           linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      },
                      // "@keyframes spin": {
                      //   to: { transform: "rotate(1turn)" },
                      // },
                    }),
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 }, height: "100%", position: "relative", zIndex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        height: "100%",
                      }}
                    >
                      {/* Image */}
                      <motion.div
                        style={{
                          position: "relative",
                          width: 160,
                          height: 160,
                          marginBottom: 24,
                        }}
                        animate={{ scale: hoveredIndex === index ? 1.05 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {hoveredIndex === index && (
                          <motion.div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              border: `4px solid ${theme.palette.primary.main}`,
                              borderRadius: "50%",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <motion.div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            padding: 8,
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <motion.img
                            src={participant.image}
                            alt={participant.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              aspectRatio: "1 / 1",
                              borderRadius: "50%",
                            }}
                            // animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                            // transition={{ type: "spring", stiffness: 300 }}
                          />
                        </motion.div>
                      </motion.div>

                      {/* Title */}
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
                        {participant.title}
                      </Typography>

                      {/* Subtitle */}
                      <Typography variant="subtitle1" sx={{ color: "primary.main", mb: 3, fontWeight: 500 }}>
                        {participant.subtitle}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.7,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          flexGrow: 1,
                        }}
                      >
                        {participant.description}
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
