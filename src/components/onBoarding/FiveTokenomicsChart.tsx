import React from "react"
import { Box, Typography, Container, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"
import { PieChart } from "@mui/x-charts/PieChart"
import { Group as CommunityIcon, Person as LeaderIcon, TrendingUp as InvestorIcon } from "@mui/icons-material"

interface TokenDistribution {
  id: string
  label: string
  value: number
  color: string
  icon: React.ReactNode
  emoji: string
  description: string
}

const tokenDistribution: TokenDistribution[] = [
  {
    id: "community",
    label: "Comunidad y Ecosistema",
    value: 30,
    color: "#735471",
    icon: <CommunityIcon sx={{ fontSize: 40 }} />,
    emoji: "👥",
    description:
      "Tokens destinados a recompensar a colaboradores activos por su trabajo validado en Dework, incentivos a la participación y expansión del ecosistema.",
  },
  {
    id: "founders",
    label: "Líder y Equipo Fundador",
    value: 30,
    color: "#3D7BFF",
    icon: <LeaderIcon sx={{ fontSize: 40 }} />,
    emoji: "👨‍💼",
    description:
      'Tokens asignados al líder y cofundadores de la iniciativa, sujetos a un calendario de "vesting" (liberación gradual) para asegurar su compromiso a largo plazo con el proyecto.',
  },
  {
    id: "investors",
    label: "Inversionistas",
    value: 30,
    color: "#c87b53",
    icon: <InvestorIcon sx={{ fontSize: 40 }} />,
    emoji: "💰",
    description:
      "Tokens recibidos por quienes aportan capital a la tesorería de la DAO. Esta asignación también puede estar sujeta a vesting o condiciones específicas de la iniciativa.",
  },
  {
    id: "openlab",
    label: "OpenLab",
    value: 10,
    // color: "#c87b53",
    color: "#6193ff",
    icon: (
      <img
        src="/favicon.ico"
        alt="OpenLab"
        style={{
          width: 40,
          height: 40,
          objectFit: "contain",
        }}
      />
    ),
    emoji: "⚙️",
    description:
      "Porcentaje destinado a OpenLab para el mantenimiento de la plataforma, desarrollo de infraestructura y apoyo al ecosistema general.",
  },
]

export const FiveTokenomicsChart: React.FC = () => {
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

  const chartVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      rotateY: 90,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 1.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      scale: 0.8,
    },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.3 + index * 0.15,
        duration: 0.8,
      },
    }),
  }

  // Prepare data for PieChart
  const chartData = tokenDistribution.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.label,
    color: item.color,
  }))

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
                Tokenomics Sostenible:
              </Typography>
            </motion.div>

            <motion.div variants={titleVariants}>
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
                La Distribución de Propiedad en OpenLab
              </Typography>
            </motion.div>

            <motion.div variants={titleVariants}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.primary",
                  maxWidth: "1200px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                La distribución inicial de los tokens del proyecto es crucial para su salud y el equilibrio del
                ecosistema, alineando los intereses de todos los participantes con el éxito a largo plazo de la
                iniciativa. La distribución de los tokens es dinámica. La cantidad de tokens en circulación, es siempre
                proporcional a la cantidad de trabajo validado por la comunidad. Es decir que si una iniciativa no tiene
                colaboraciones, entonces no tiene tokens generados.
              </Typography>
            </motion.div>
          </Box>

          {/* Chart and Distribution Grid */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Chart Section */}
            <div className="w-full lg:w-1/2">
              <motion.div variants={chartVariants}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: { xs: 2, md: 4 },
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 4,
                    boxShadow: "0 10px 40px rgba(61, 123, 255, 0.1)",
                    border: "2px solid rgba(61, 123, 255, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 60,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: chartData,
                          highlightScope: { fade: "global", highlight: "item" },
                          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                          valueFormatter: (value) => `${value.value}%`,
                          innerRadius: 60,
                          outerRadius: 120,
                          paddingAngle: 2,
                          cornerRadius: 8,
                        },
                      ]}
                      width={400}
                      height={300}
                      margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
                      slotProps={{
                        legend: {
                          // @ts-expect-error - hidden property exists on legend slotProps
                          hidden: true,
                        },
                      }}
                    />
                  </motion.div>

                  {/* Animated background elements */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 4,
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
                      zIndex: 0,
                    }}
                  />
                </Box>
              </motion.div>
            </div>

            {/* Distribution Cards */}
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col gap-2">
                {tokenDistribution.map((item, index) => (
                  <motion.div key={item.id} variants={cardVariants} custom={index}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                        border: `2px solid ${item.color}30`,
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        "&:hover": {
                          transform: "translateX(8px) scale(1.02)",
                          transition: "all 0.3s ease-in-out",
                          boxShadow: `0 8px 32px ${item.color}40`,
                        },
                        transition: "all 0.3s ease-in-out",
                        cursor: "pointer",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          {/* Icon and Percentage */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              minWidth: 80,
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: item.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "2rem",
                                mb: 1,
                                boxShadow: `0 4px 20px ${item.color}40`,
                                overflow: "hidden",
                              }}
                            >
                              {item.id === "openlab" ? (
                                <img
                                  src="/favicon.ico"
                                  alt="OpenLab"
                                  style={{
                                    width: "60%",
                                    height: "60%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                  }}
                                />
                              ) : (
                                item.emoji
                              )}
                            </Box>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                color: item.color,
                                fontSize: "1.5rem",
                              }}
                            >
                              {item.value}%
                            </Typography>
                          </Box>

                          {/* Content */}
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              component="h4"
                              sx={{
                                fontWeight: 700,
                                color: item.color,
                                mb: 1,
                                fontSize: "1.1rem",
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.primary",
                                lineHeight: 1.5,
                                fontSize: "0.9rem",
                                mb: 1,
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Decorative element */}
                      <motion.div
                        animate={{
                          x: [0, 10, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: item.color,
                        }}
                      />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Box>
  )
}
