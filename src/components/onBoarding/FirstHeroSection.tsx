import React from "react"
import { Box, Typography, Container } from "@mui/material"
import { motion } from "framer-motion"

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
}

export const FirstHeroSection: React.FC<HeroSectionProps> = ({
  title = "Cómo Funciona OpenLab:",
  subtitle = "Un Ecosistema Transparente para la Innovación",
  description = "En OpenLab, hemos diseñado un protocolo que transforma la manera en que las ideas se validan, financian y construyen. Nuestra misión es simple: crear un ecosistema transparente y meritocrático donde el valor fluye hacia quienes lo crean. A continuación, te explicamos el ciclo de vida de cada iniciativa y las reglas fundamentales que garantizan un juego justo para todos.",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
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
      y: 30,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 80,
        duration: 0.7,
      },
    },
  }

  const descriptionVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.6,
      },
    },
  }

  return (
    <Box
      sx={{
        pt: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top center, rgba(61, 123, 255, 0.05) 0%, transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            <motion.div variants={titleVariants}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                  fontWeight: 600,
                  color: "primary.main",
                  mb: 2,
                  lineHeight: 1.3,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                {title}
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
                {subtitle}
              </Typography>
            </motion.div>

            <motion.div variants={descriptionVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: "text.primary",
                  maxWidth: "1200px",
                  mx: "auto",
                  lineHeight: 1.7,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  "& br": {
                    content: '""',
                    margin: "0.5em 0",
                  },
                }}
              >
                {description}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Elementos decorativos animados */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(61, 123, 255, 0.1), rgba(140, 88, 255, 0.1))",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          rotate: -360,
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          position: "absolute",
          bottom: "30%",
          left: "5%",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(88, 140, 255, 0.1), rgba(61, 123, 255, 0.1))",
          zIndex: 0,
        }}
      />
    </Box>
  )
}
