import React, { useState } from "react"
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Typography,
  Container,
  useTheme,
  alpha,
  Fade,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Fab,
  StepConnector,
  stepConnectorClasses,
  styled,
  MobileStepper,
} from "@mui/material"
import { Lightbulb, Visibility, Group, Link, Update, CheckCircle, Close, ContactSupport } from "@mui/icons-material"
import { motion, AnimatePresence } from "motion/react"
import { useInitiativeStore } from "../../stores/initiativeStore"
import { useStepLogic } from "../../hooks/useStepLogic"
import NavigationButtons from "./NavigationButtons"
import StepTips from "./StepTips"

// Importar los componentes de cada paso
import Step1Component from "./steps/Step1Component"
import Step2Component from "./steps/Step2Component"
import Step3Component from "./steps/Step3Component"
import Step4Component from "./steps/Step4Component"
import Step5Component from "./steps/Step5Component"
import Step6Component from "./steps/Step6Component"

// Conector personalizado inspirado en la documentación de MUI
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: "calc(-50% + 24px)",
    right: "calc(50% + 24px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.primary.main,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.primary.main,
      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transition: "all 0.3s ease",
  },
}))

// Icono personalizado del step
const CustomStepIcon = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.1),
  zIndex: 1,
  color: ownerState.active || ownerState.completed ? "#fff" : theme.palette.primary.main,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  border: `3px solid ${
    ownerState.active || ownerState.completed ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)
  }`,
  boxShadow: ownerState.active
    ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
    : ownerState.completed
      ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`
      : `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  transform: ownerState.active ? "scale(1.15)" : "scale(1)",

  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
    backgroundColor:
      ownerState.active || ownerState.completed ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2),
  },

  // Responsive sizes
  [theme.breakpoints.down("md")]: {
    width: 40,
    height: 40,
  },
  [theme.breakpoints.down("sm")]: {
    width: 35,
    height: 35,
    border: `2px solid ${
      ownerState.active || ownerState.completed ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)
    }`,
  },
}))

const steps = [
  {
    label: "1. La Idea",
    shortLabel: "",
    icon: Lightbulb,
    required: true,
  },
  {
    label: "2. El Producto",
    shortLabel: "",
    icon: Visibility,
    required: true,
  },
  {
    label: "3. El Equipo",
    shortLabel: "",
    icon: Group,
    required: false,
  },
  {
    label: "4. Herramientas Externas",
    shortLabel: "",
    icon: Link,
    required: false,
  },
  {
    label: "5. Actualizaciones y Roadmap",
    shortLabel: "",
    icon: Update,
    required: false,
  },
  {
    label: "6. Revisión",
    shortLabel: "",
    icon: CheckCircle,
    required: false,
  },
]

interface InitiativeStepperProps {
  isEditMode?: boolean
}

const InitiativeStepper: React.FC<InitiativeStepperProps> = ({ isEditMode = false }) => {
  const theme = useTheme()
  const { currentStep, setCurrentStep } = useInitiativeStore()
  const isStep3Optional = isEditMode
  const { getStepInfo } = useStepLogic({ isStep3Optional })
  const [helpModalOpen, setHelpModalOpen] = useState(false)

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"))

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  const handleHelpClick = () => {
    setHelpModalOpen(true)
  }

  const handleHelpClose = () => {
    setHelpModalOpen(false)
  }

  const renderStepContent = () => {
    const stepComponents = [
      <Step1Component key="step1" />,
      <Step2Component key="step2" />,
      <Step3Component key="step3" />,
      <Step4Component key="step4" />,
      <Step5Component key="step5" />,
      <Step6Component key="step6" />,
    ]

    return stepComponents[currentStep - 1]
  }

  return (
    <Container sx={{ py: isMobile ? 2 : 4, position: "relative" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full flex justify-center text-center mb-4"
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "primary.main" }}>
          {isEditMode ? "Editando Iniciativa" : "Creando una nueva Iniciativa"}
        </Typography>
      </motion.div>
      {/* Stepper personalizado y responsive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-6 justify-center items-center w-full"
      >
        {/* Stepper Desktop */}
        {!isMobile && (
          <Paper
            elevation={isTablet ? 1 : 2}
            sx={{
              px: isTablet ? 2 : 2.5,
              py: isTablet ? 2 : 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
              position: "relative",
              overflow: "hidden",
              borderRadius: isTablet ? "16px" : "24px",
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
            className="w-full flex-1"
          >
            <Stepper
              nonLinear
              activeStep={currentStep - 1}
              alternativeLabel
              connector={<CustomConnector />}
              sx={{
                // Responsive padding
                px: isTablet ? 1 : 2,
              }}
            >
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const stepInfo = getStepInfo(stepNumber)
                const isCompleted = stepInfo.status === "completed"
                const isActive = currentStep === stepNumber

                return (
                  <Step key={step.label} completed={isCompleted}>
                    <StepButton
                      onClick={() => handleStepClick(stepNumber)}
                      sx={{
                        "& .MuiStepLabel-root": {
                          cursor: "pointer !important",
                          transition: "all 0.3s ease",
                        },
                        "& .MuiStepLabel-label": {
                          fontWeight: isActive ? "700" : "500",
                          color: isActive ? "primary.main" : "inherit",
                          fontSize: isTablet ? "0.875rem" : isActive ? "1rem" : "0.875rem",
                          transition: "all 0.3s ease",
                          "&.Mui-disabled": {
                            color: "inherit",
                          },
                        },
                        "&:hover": {
                          zIndex: 5,
                          "& .MuiStepLabel-label": {
                            color: "primary.main",
                            transform: "translateY(-1px)",
                          },
                        },
                        "&.Mui-disabled": {
                          opacity: 1,
                          cursor: "pointer",
                        },
                      }}
                    >
                      <StepLabel
                        slots={{
                          stepIcon: () => (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CustomStepIcon
                                ownerState={{
                                  completed: isCompleted,
                                  active: isActive,
                                }}
                              >
                                <step.icon
                                  sx={{
                                    fontSize: isTablet ? 20 : 24,
                                  }}
                                />
                              </CustomStepIcon>
                            </motion.div>
                          ),
                        }}
                      >
                        <Box sx={{ textAlign: "center", mt: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={isActive ? 700 : 500}
                            color={isActive ? "primary.main" : "text.primary"}
                            sx={{
                              transition: "all 0.3s ease",
                              lineHeight: 1.2,
                            }}
                          >
                            {step.label}
                          </Typography>
                        </Box>
                      </StepLabel>
                    </StepButton>
                  </Step>
                )
              })}
            </Stepper>
          </Paper>
        )}

        {/* Mobile Stepper con Dots */}
        {isMobile && (
          <Paper
            elevation={0}
            sx={{
              py: 2,
              background: "transparent",
              position: "relative",
              overflow: "hidden",
              borderRadius: "16px",
            }}
            className="w-full flex-1"
          >
            <MobileStepper
              steps={6}
              position="static"
              activeStep={currentStep - 1}
              variant="dots"
              sx={{
                background: "transparent",
                justifyContent: "center",
                "& .MuiMobileStepper-dot": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  margin: "0 8px",
                  width: 12,
                  height: 12,
                  transition: "all 0.3s ease",
                },
                "& .MuiMobileStepper-dotActive": {
                  backgroundColor: theme.palette.primary.main,
                  boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: "scale(1.3)",
                },
              }}
              nextButton={<div />} // Vacío para no mostrar botones
              backButton={<div />} // Vacío para no mostrar botones
            />

            {/* Texto del paso actual en móvil */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" fontWeight="600" color="primary.main" sx={{ fontSize: "0.875rem" }}>
                {steps[currentStep - 1]?.shortLabel}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Botón de ayuda responsive */}
        {!isMobile ? (
          <Paper
            elevation={2}
            sx={{
              p: isTablet ? 1.5 : 2,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
              borderRadius: "50%",
              cursor: "pointer",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
            onClick={handleHelpClick}
          >
            <ContactSupport
              sx={{
                color: "primary.main",
                fontSize: isTablet ? 20 : 24,
              }}
            />
          </Paper>
        ) : (
          // FAB para móviles - más sutil
          <Fab
            size="small"
            onClick={handleHelpClick}
            sx={{
              position: "absolute",
              // top: 16,
              right: 16,
              zIndex: 0,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              color: "primary.main",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
              backdropFilter: "blur(10px)",
            }}
          >
            <ContactSupport sx={{ fontSize: 20 }} />
          </Fab>
        )}
      </motion.div>

      {/* Contenido del paso actual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Fade in={true} timeout={500}>
            <Box
              sx={{
                mt: isMobile ? 2 : 4,
                maxWidth: isLargeScreen ? 860 : isTablet ? "100%" : 860,
                mx: "auto",
                px: isMobile ? 1 : 0,
              }}
            >
              {renderStepContent()}

              {/* NavigationButtons al final de cada paso */}
              <Box sx={{ mt: isMobile ? 2 : 4 }}>
                <NavigationButtons stepNumber={currentStep} />
              </Box>
            </Box>
          </Fade>
        </motion.div>
      </AnimatePresence>

      {/* Modal de ayuda con consejos - responsive */}
      <Dialog
        open={helpModalOpen}
        onClose={handleHelpClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: isMobile ? 0 : 2,
            position: "relative",
            // margin: isMobile ? 0 : 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ContactSupport sx={{ color: "primary.main" }} />
            <Typography variant={isMobile ? "h6" : "h6"} fontWeight="bold" color="primary.main">
              Consejos para tu Propuesta
            </Typography>
          </Box>
          <IconButton
            onClick={handleHelpClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: isMobile ? 3 : 2 }}>
          <StepTips step={currentStep} />
          {/* Consejo adicional para móviles */}
          {isMobile && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>
                💡 Tip para móvil:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Usa los dots para ver tu progreso y los botones de abajo para guardar tu borrador.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default InitiativeStepper
