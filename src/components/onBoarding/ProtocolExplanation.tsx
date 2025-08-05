import { Box, Typography, Button, Paper, Card } from "@mui/material"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

interface ProtocolExplanationProps {
  showBothButtons?: boolean
  onContinue?: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
}

const arrowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  animate: {
    x: [0, 5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.5,
    },
  },
}

export default function ProtocolExplanation({ showBothButtons = false, onContinue }: ProtocolExplanationProps) {
  const navigate = useNavigate()

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      navigate("/")
    }
  }

  const handleMoreInfo = () => {
    navigate("/moreinfo")
  }

  const commonChipStyles = {
    height: "auto",
    padding: "16px 24px",
    borderRadius: "50px",
    fontWeight: 500,
    fontSize: { xs: "0.8rem", md: "0.9rem" },
    "& .MuiChip-label": {
      whiteSpace: "normal",
      lineHeight: 1.4,
    },
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: showBothButtons ? "#f0f2f5" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 1100,
          width: "100%",
          borderRadius: 4,
          p: { xs: 3, sm: 4, md: 6 },
          boxShadow: showBothButtons ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box textAlign="center" mb={4}>
              {showBothButtons && (
                <Box display="flex" justifyContent="center">
                  <Box component="img" src="/src/assets/images/logo.webp" alt="OpenLab" sx={{ height: 40, mb: 2 }} />
                </Box>
              )}
              {showBothButtons && (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  ¡Bienvenido a OpenLab!
                </Typography>
              )}
              <Typography
                variant="h5"
                sx={{ color: "primary.main", fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
              >
                ¿Cómo funciona el protocolo de OpenLab?
              </Typography>
            </Box>
          </motion.div>

          {/* Main Description */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                maxWidth: 700,
                mx: "auto",
                mb: 5,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              En OpenLab, hemos diseñado un protocolo que transforma la manera en que las ideas se validan, financian y
              construyen.
            </Typography>
          </motion.div>

          {/* Step 1 */}
          <motion.div variants={itemVariants}>
            <Box mb={6} textAlign="center">
              <motion.div variants={numberVariants}>
                <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                  1.
                </Typography>
              </motion.div>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3, textAlign: "left", maxWidth: 800, mx: "auto" }}
              >
                La propiedad de los proyectos se divide en partes iguales entre fundadores, colaboradores e
                inversionistas (30%-30%-30%) y un 10% para Openlab.
              </Typography>

              <Box display="flex" justifyContent="center" gap={{ xs: 1.5, md: 3 }} flexWrap="wrap" mb={4}>
                {[
                  { label: "Fundadores 30%", outlined: true },
                  { label: "Colaboradores 30%", outlined: true },
                  { label: "Inversionistas 30%", outlined: true },
                  { label: "Openlab 10%", outlined: false },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    animate={
                      item.label === "Openlab 10%"
                        ? { scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity } }
                        : {}
                    }
                    style={{ width: "100%", maxWidth: "240px", borderRadius: "25px" }}
                  >
                    <Card
                      elevation={item.outlined ? 2 : 4}
                      sx={{
                        ...commonChipStyles,
                        border: "1px solid",
                        borderColor: item.outlined ? "grey.300" : "primary.main",
                        backgroundColor: item.outlined ? "#ffffff" : "primary.main",
                        color: item.outlined ? "#4a5568" : "white",
                        textAlign: "center",
                        width: "100%",
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants}>
            <Box mb={6} textAlign="center">
              <motion.div variants={numberVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  2.
                </Typography>
              </motion.div>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3, textAlign: "left", maxWidth: 800, mx: "auto" }}
              >
                Los tokens se distribuyen a los colaboradores según sus actividades validadas por la comunidad, y estos
                representan su participación en la propiedad del proyecto.
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={{ xs: 2, md: 4 }}
                flexWrap="wrap"
                mb={4}
              >
                {["Colaborador completa tarea", "Comunidad valida tarea", "DAO transfiere tokens a colaborador"].map(
                  (step) => (
                    <Box key={step} display="flex" alignItems="center" gap={2}>
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap={{ scale: 0.95 }}
                        style={{ width: "100%", maxWidth: "240px", borderRadius: "50px" }}
                      >
                        <Card
                          elevation={2}
                          sx={{
                            ...commonChipStyles,
                            borderRadius: "50px",
                            border: "1px solid",
                            borderColor: "grey.300",
                            backgroundColor: "#ffffff",
                            color: "#4a5568",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          {step}
                        </Card>
                      </motion.div>
                      {step !== "DAO transfiere tokens a colaborador" && (
                        <motion.div variants={arrowVariants} animate="animate">
                          <ArrowForwardIcon
                            sx={{
                              color: "#000",
                              fontSize: { xs: 30, md: 40 },
                              display: { xs: "none", md: "block" },
                            }}
                          />
                        </motion.div>
                      )}
                    </Box>
                  ),
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants}>
            <Box mb={6} textAlign="center">
              <motion.div variants={numberVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  3.
                </Typography>
              </motion.div>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3, textAlign: "left", maxWidth: 800, mx: "auto" }}
              >
                Los fondos aportados a las DAO's por los inversionistas, únicamente se utilizan, cuando hay
                contribuciones validadas por la comunidad. Cuando hay contribuciones, automáticamente se transfieren los
                fondos a las personas que participaron en los proyectos en el orden en el que fueron ejecutadas.
              </Typography>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={{ xs: 2, md: 4 }}
                flexWrap="wrap"
                mb={6}
              >
                {[
                  "Inversores transfieren fondos a DAO",
                  "Comunidad valida trabajo",
                  "Se transfieren fondos a colaborador",
                  "DAO distribuye tokens a inversionistas",
                ].map((step) => (
                  <Box key={step} display="flex" alignItems="center" gap={2}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.95 }}
                      style={{ width: "100%", maxWidth: "240px", borderRadius: "50px" }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          ...commonChipStyles,
                          backgroundColor: "#ffffff",
                          color: "#4a5568",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        {step}
                      </Paper>
                    </motion.div>
                    {step !== "DAO distribuye tokens a inversionistas" && (
                      <motion.div variants={arrowVariants} animate="animate">
                        <ArrowForwardIcon
                          sx={{
                            color: "#000",
                            fontSize: { xs: 30, md: 40 },
                            display: { xs: "none", md: "block" },
                          }}
                        />
                      </motion.div>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants}>
            <Box
              display="flex"
              justifyContent="center"
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems="center"
              mt={8}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleMoreInfo}
                  sx={{
                    minWidth: 150,
                    py: 1,
                    borderRadius: "24px",
                    color: "white",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: "tertiary.light",
                    "&:hover": {
                      backgroundColor: "tertiary.main",
                    },
                  }}
                >
                  Más información
                </Button>
              </motion.div>

              {showBothButtons && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    sx={{
                      py: 1,
                      borderRadius: "24px",
                      backgroundColor: "primary.main",
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Continuar
                  </Button>
                </motion.div>
              )}
            </Box>
          </motion.div>
        </motion.div>
      </Paper>
    </Box>
  )
}
