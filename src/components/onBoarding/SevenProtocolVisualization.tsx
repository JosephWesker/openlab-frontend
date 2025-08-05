import { motion } from "framer-motion"

interface FlowStep {
  id: string
  title: string
  subtitle?: string
  type: "single" | "split" | "merge" | "final" | "start"
  emoji: string
  color: string
  gradient: string
  position: { x: number; y: number }
  connections?: string[]
}

const flowSteps: FlowStep[] = [
  {
    id: "user",
    title: "USUARIO (Visitantes)",
    type: "start",
    emoji: "👤",
    color: "#3D7BFF",
    gradient: "linear-gradient(135deg, #3D7BFF 0%, #588CFF 100%)",
    position: { x: 50, y: 5 },
    connections: ["register"],
  },
  {
    id: "register",
    title: "REGISTRO & ONBOARDING",
    type: "single",
    emoji: "📝",
    color: "#588CFF",
    gradient: "linear-gradient(135deg, #588CFF 0%, #7B68EE 100%)",
    position: { x: 50, y: 12 },
    connections: ["explore"],
  },
  {
    id: "explore",
    title: "EXPLORAR INICIATIVAS",
    type: "single",
    emoji: "🔍",
    color: "#7B68EE",
    gradient: "linear-gradient(135deg, #7B68EE 0%, #8C58FF 100%)",
    position: { x: 50, y: 19 },
    connections: ["initiator", "collaborator"],
  },
  {
    id: "initiator",
    title: "INICIADOR",
    subtitle: "(Propone Ideas)",
    type: "split",
    emoji: "💡",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 30, y: 28 },
    connections: ["proposal"],
  },
  {
    id: "collaborator",
    title: "COLABORADOR",
    subtitle: "(Busca Tareas)",
    type: "split",
    emoji: "🤝",
    color: "#A855F7",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    position: { x: 70, y: 28 },
    connections: ["postulate"],
  },
  {
    id: "proposal",
    title: "FORMULARIO DE PROPUESTA",
    type: "single",
    emoji: "📋",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 30, y: 37 },
    connections: ["validation"],
  },
  {
    id: "postulate",
    title: "POSTULARSE",
    subtitle: "(Carta de Presentación)",
    type: "single",
    emoji: "✍️",
    color: "#A855F7",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    position: { x: 70, y: 37 },
    connections: ["review"],
  },
  {
    id: "validation",
    title: "VALIDACIÓN COMUNITARIA",
    subtitle: "(Votos/Comentarios)",
    type: "single",
    emoji: "🗳️",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 30, y: 46 },
    connections: ["approval"],
  },
  {
    id: "review",
    title: "LÍDER REVISA POSTULACIONES",
    type: "single",
    emoji: "👀",
    color: "#A855F7",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    position: { x: 70, y: 46 },
    connections: ["approval"],
  },
  {
    id: "approval",
    title: "APROBACIÓN & ACTIVACIÓN",
    subtitle: "(OpenLab)",
    type: "merge",
    emoji: "✅",
    color: "#3D7BFF",
    gradient: "linear-gradient(135deg, #3D7BFF 0%, #588CFF 100%)",
    position: { x: 50, y: 55 },
    connections: ["active"],
  },
  {
    id: "active",
    title: "INICIATIVA ACTIVA",
    subtitle: "(con Enlaces Oficiales)",
    type: "single",
    emoji: "🚀",
    color: "#7B68EE",
    gradient: "linear-gradient(135deg, #7B68EE 0%, #8C58FF 100%)",
    position: { x: 50, y: 64 },
    connections: ["dwork", "aragon", "discord"],
  },
  {
    id: "dwork",
    title: "DWORK",
    subtitle: "(Tareas & Recompensas)",
    type: "split",
    emoji: "💼",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 25, y: 73 },
    connections: ["task-complete"],
  },
  {
    id: "aragon",
    title: "ARAGON DAO",
    subtitle: "(Gobernanza & Tesorería)",
    type: "split",
    emoji: "🏛️",
    color: "#A855F7",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    position: { x: 50, y: 73 },
    connections: ["investor-funds"],
  },
  {
    id: "discord",
    title: "DISCORD / GITHUB",
    subtitle: "(Comunicación & Código)",
    type: "split",
    emoji: "💬",
    color: "#9333EA",
    gradient: "linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)",
    position: { x: 75, y: 73 },
    connections: ["collaborative-dev"],
  },
  {
    id: "task-complete",
    title: "COLABORADOR COMPLETA TAREA",
    type: "single",
    emoji: "✅",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 25, y: 82 },
    connections: ["payment"],
  },
  {
    id: "investor-funds",
    title: "INVERSOR APORTA FONDOS",
    subtitle: "(USDC in-app)",
    type: "single",
    emoji: "💰",
    color: "#A855F7",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    position: { x: 50, y: 82 },
    connections: ["token-to-investor"],
  },
  {
    id: "collaborative-dev",
    title: "DESARROLLO COLABORATIVO",
    type: "single",
    emoji: "🔧",
    color: "#9333EA",
    gradient: "linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)",
    position: { x: 75, y: 82 },
    connections: ["project-updates"],
  },
  {
    id: "payment",
    title: "PAGO DE TOKENS",
    subtitle: "(del Proyecto)",
    type: "merge",
    emoji: "🪙",
    color: "#3D7BFF",
    gradient: "linear-gradient(135deg, #3D7BFF 0%, #588CFF 100%)",
    position: { x: 30, y: 91 },
    connections: ["cycle"],
  },
  {
    id: "token-to-investor",
    title: "TOKENS AL INVERSOR",
    subtitle: "(Proyecto)",
    type: "merge",
    emoji: "💎",
    color: "#588CFF",
    gradient: "linear-gradient(135deg, #588CFF 0%, #7B68EE 100%)",
    position: { x: 50, y: 91 },
    connections: ["cycle"],
  },
  {
    id: "project-updates",
    title: "ACTUALIZACIONES",
    subtitle: "(de Proyecto)",
    type: "merge",
    emoji: "📈",
    color: "#7B68EE",
    gradient: "linear-gradient(135deg, #7B68EE 0%, #8C58FF 100%)",
    position: { x: 70, y: 91 },
    connections: ["cycle"],
  },
  {
    id: "cycle",
    title: "CICLO CONTINUO DE VALOR Y GOBERNANZA",
    type: "final",
    emoji: "🔄",
    color: "#8C58FF",
    gradient: "linear-gradient(135deg, #8C58FF 0%, #A855F7 100%)",
    position: { x: 50, y: 100 },
  },
]

export const SevenProtocolVisualization = () => {
  // Factor para espaciar más los componentes verticalmente
  const scaleY = 1.15
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.08,
      },
    },
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8,
      },
    },
  }

  const stepVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
      y: 30,
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 120,
        delay: index * 0.05,
        duration: 0.5,
      },
    }),
  }

  const arrowVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: (delay: number) => ({
      opacity: 0.8,
      pathLength: 1,
      transition: {
        pathLength: { duration: 0.6, delay },
        opacity: { duration: 0.2, delay },
      },
    }),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderConnection = (from: any, to: any, index: number) => {
    const fromX = from.position.x
    const fromY = (from.position.y + 4) * scaleY
    const toX = to.position.x
    const toY = (to.position.y - 1.5) * scaleY

    const delay = index * 0.03 + 0.8
    const isHorizontalSplit = Math.abs(fromX - toX) > 10

    if (isHorizontalSplit) {
      // Curved connection for splits/merges
      const controlY = fromY + (toY - fromY) * 0.3
      const path = `M ${fromX} ${fromY} Q ${fromX} ${controlY} ${toX} ${toY}`

      return (
        <motion.path
          key={`connection-${from.id}-${to.id}`}
          d={path}
          stroke="url(#arrowGradient)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead)"
          strokeLinecap="round"
          opacity={0.6}
          variants={arrowVariants}
          custom={delay}
          style={{
            filter: "none",
          }}
        />
      )
    } else {
      // Straight vertical connection
      return (
        <motion.line
          key={`connection-${from.id}-${to.id}`}
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="url(#arrowGradient)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
          strokeLinecap="round"
          opacity={0.6}
          variants={arrowVariants}
          custom={delay}
          style={{
            filter: "none",
          }}
        />
      )
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-6 py-8 px-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 variants={titleVariants} className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Visualización del Protocolo Completo
          </motion.h1>
          <motion.p variants={titleVariants} className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            El siguiente diagrama ilustra cómo todas estas fases, reglas y roles se interconectan para formar el
            ecosistema completo de OpenLab de forma transparente y descentralizada.
          </motion.p>
        </div>

        {/* Flow Diagram */}
        <div className="relative w-full" style={{ height: "2000px" }}>
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 105"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="arrowGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#CBD5F7" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="4"
                refX="5"
                refY="2"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 6 2, 0 4" fill="#6366F1" opacity="0.6" />
              </marker>
            </defs>

            {flowSteps.map((step, stepIndex) =>
              step.connections?.map((connectionId, connIndex) => {
                const targetStep = flowSteps.find((s) => s.id === connectionId)
                if (targetStep) {
                  return renderConnection(step, targetStep, stepIndex + connIndex)
                }
                return null
              }),
            )}
          </svg>

          {/* Flow Steps */}
          {flowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={stepVariants}
              custom={index}
              className="absolute transform -translate-x-1/2"
              style={{
                left: `${step.position.x}%`,
                top: `${step.position.y * scaleY}%`,
              }}
            >
              <div
                className="relative group cursor-pointer"
                style={{
                  background: step.gradient,
                  borderRadius: "16px",
                  padding: "20px",
                  minWidth: "240px",
                  maxWidth: "240px",
                  boxShadow: `0 8px 32px ${step.color}25`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)"
                  e.currentTarget.style.boxShadow = `0 16px 48px ${step.color}35`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = `0 8px 32px ${step.color}25`
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-3 rounded-full bg-white bg-opacity-25 backdrop-blur-sm text-3xl">
                  {step.emoji}
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-center mb-1 text-sm leading-tight">{step.title}</h3>

                {/* Subtitle */}
                {step.subtitle && (
                  <p className="text-white text-opacity-80 text-center text-xs italic">{step.subtitle}</p>
                )}

                {/* Special glow for start and final */}
                {(step.type === "start" || step.type === "final") && (
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-1 rounded-2xl border-2 border-white border-opacity-50"
                    style={{ zIndex: -1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
