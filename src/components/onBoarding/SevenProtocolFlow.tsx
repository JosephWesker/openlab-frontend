import React, { useMemo, useRef } from "react"
import ReactFlow, { Background, Controls, MarkerType, type Node, type Edge } from "reactflow"
import { motion, AnimatePresence } from "framer-motion"
import "reactflow/dist/style.css"

// Reutilizamos la misma definición que el componente original
interface FlowStep {
  id: string
  title: string
  subtitle?: string
  type: "single" | "split" | "merge" | "final" | "start"
  emoji: string
  color: string
  position: { x: number; y: number }
  connections?: string[]
}

const COLOR_DEFAULT = "#dbeafe"

const flowSteps: FlowStep[] = [
  {
    id: "user",
    title: "USUARIO (Visitantes)",
    type: "start",
    emoji: "👤",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 0 },
    connections: ["register"],
  },
  {
    id: "register",
    title: "REGISTRO & ONBOARDING",
    type: "single",
    emoji: "📝",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 120 },
    connections: ["explore"],
  },
  {
    id: "explore",
    title: "EXPLORAR INICIATIVAS",
    type: "single",
    emoji: "🔍",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 240 },
    connections: ["initiator", "collaborator"],
  },
  {
    id: "initiator",
    title: "INICIADOR",
    subtitle: "(Propone Ideas)",
    type: "split",
    emoji: "💡",
    color: COLOR_DEFAULT,
    position: { x: -280, y: 360 },
    connections: ["proposal"],
  },
  {
    id: "collaborator",
    title: "COLABORADOR",
    subtitle: "(Busca Tareas)",
    type: "split",
    emoji: "🤝",
    color: COLOR_DEFAULT,
    position: { x: 280, y: 360 },
    connections: ["postulate"],
  },
  {
    id: "proposal",
    title: "FORMULARIO DE PROPUESTA",
    type: "single",
    emoji: "📋",
    color: COLOR_DEFAULT,
    position: { x: -280, y: 480 },
    connections: ["validation"],
  },
  {
    id: "postulate",
    title: "POSTULARSE",
    subtitle: "(Carta de Presentación)",
    type: "single",
    emoji: "✍️",
    color: COLOR_DEFAULT,
    position: { x: 280, y: 480 },
    connections: ["review"],
  },
  {
    id: "validation",
    title: "VALIDACIÓN COMUNITARIA",
    subtitle: "(Votos/Comentarios)",
    type: "single",
    emoji: "🗳️",
    color: COLOR_DEFAULT,
    position: { x: -280, y: 600 },
    connections: ["approval-manual"],
  },
  {
    id: "review",
    title: "LÍDER REVISA POSTULACIONES",
    type: "single",
    emoji: "👀",
    color: COLOR_DEFAULT,
    position: { x: 280, y: 600 },
    connections: ["approval-redirect"],
  },
  {
    id: "approval-manual",
    title: "APROBACIÓN MANUAL ADMIN",
    subtitle: "(OpenLab)",
    type: "merge",
    emoji: "✅",
    color: "#3D7BFF",
    position: { x: -280, y: 720 },
    connections: ["active"],
  },
  {
    id: "approval-redirect",
    title: "ACEPTACIÓN/REDIRECCIÓN",
    type: "merge",
    emoji: "✅",
    color: "#3D7BFF",
    position: { x: 280, y: 720 },
    connections: ["active"],
  },
  {
    id: "active",
    title: "INICIATIVA ACTIVA",
    subtitle: "(con Enlaces Oficiales)",
    type: "single",
    emoji: "🚀",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 840 },
    connections: ["dwork", "aragon", "discord"],
  },
  {
    id: "dwork",
    title: "DWORK",
    subtitle: "(Tareas & Recompensas)",
    type: "split",
    emoji: "💼",
    color: COLOR_DEFAULT,
    position: { x: -350, y: 960 },
    connections: ["task-complete"],
  },
  {
    id: "aragon",
    title: "ARAGON DAO",
    subtitle: "(Gobernanza & Tesorería)",
    type: "split",
    emoji: "🏛️",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 960 },
    connections: ["investor-funds"],
  },
  {
    id: "discord",
    title: "DISCORD / GITHUB",
    subtitle: "(Comunicación & Código)",
    type: "split",
    emoji: "💬",
    color: COLOR_DEFAULT,
    position: { x: 350, y: 960 },
    connections: ["collaborative-dev"],
  },
  {
    id: "task-complete",
    title: "COLABORADOR COMPLETA TAREA",
    type: "single",
    emoji: "✅",
    color: COLOR_DEFAULT,
    position: { x: -350, y: 1080 },
    connections: ["payment"],
  },
  {
    id: "investor-funds",
    title: "INVERSOR APORTA FONDOS",
    subtitle: "(USDC in-app)",
    type: "single",
    emoji: "💰",
    color: "#735471",
    position: { x: 0, y: 1080 },
    connections: ["token-to-investor"],
  },
  {
    id: "collaborative-dev",
    title: "DESARROLLO COLABORATIVO",
    type: "single",
    emoji: "🔧",
    color: COLOR_DEFAULT,
    position: { x: 350, y: 1080 },
    connections: ["project-updates"],
  },
  {
    id: "payment",
    title: "PAGO DE TOKENS",
    subtitle: "(del Proyecto)",
    type: "single",
    emoji: "🪙",
    color: COLOR_DEFAULT,
    position: { x: -350, y: 1200 },
    connections: ["cycle"],
  },
  {
    id: "token-to-investor",
    title: "TOKENS AL INVERSOR",
    subtitle: "(Proyecto)",
    type: "single",
    emoji: "💎",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 1200 },
    connections: ["cycle"],
  },
  {
    id: "project-updates",
    title: "ACTUALIZACIONES",
    subtitle: "(de Proyecto)",
    type: "single",
    emoji: "📈",
    color: COLOR_DEFAULT,
    position: { x: 350, y: 1200 },
    connections: ["cycle"],
  },
  {
    id: "cycle",
    title: "CICLO CONTINUO DE VALOR Y GOBERNANZA",
    type: "final",
    emoji: "🔄",
    color: COLOR_DEFAULT,
    position: { x: 0, y: 1340 },
  },
]

const nodeStyle = (color: string) => ({
  padding: 16,
  borderRadius: 12,
  color: "#fff",
  fontWeight: 600,
  background: color,
  boxShadow: `0 4px 16px ${color}44`,
  textAlign: "center" as const,
  width: 280,
  lineHeight: 1.3,
  cursor: "default",
})

export const SevenProtocolFlow: React.FC = () => {
  // Detectamos mobile (pantallas < 640px)
  // const isMobile = typeof window !== "undefined" && window.innerWidth < 640

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

  // Factores de separación más moderados
  const SPACING_X = 1.4
  const SPACING_Y = 1.3

  const nodes: Node[] = useMemo(
    () =>
      flowSteps.map((s) => ({
        id: s.id,
        data: {
          label: (
            <div style={{ fontSize: 14, cursor: "default" }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>{`${s.emoji}`}</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  lineHeight: 1.25,
                  color:
                    s.id === "approval-manual" || s.id === "approval-redirect" || s.id === "investor-funds"
                      ? "white"
                      : "#3D7BFF",
                }}
              >
                {s.title}
              </div>
              {s.subtitle && (
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.9,
                    marginTop: 2,
                    color:
                      s.id === "approval-manual" || s.id === "approval-redirect" || s.id === "investor-funds"
                        ? "white"
                        : "#3D7BFF",
                  }}
                >
                  {s.subtitle}
                </div>
              )}
            </div>
          ),
        },
        position: {
          x: s.position.x * SPACING_X,
          y: s.position.y * SPACING_Y,
        },
        style: nodeStyle(s.color),
        draggable: false,
      })),
    [],
  )

  const edges: Edge[] = useMemo(() => {
    const list: Edge[] = []
    flowSteps.forEach((s) => {
      s.connections?.forEach((target) => {
        list.push({
          id: `${s.id}-${target}`,
          source: s.id,
          target,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#3D7BFF", width: 20, height: 20 },
          style: { stroke: "#3D7BFF", strokeWidth: 2 },
        })
      })
    })
    return list
  }, [])

  // Referencia al contenedor con scroll
  const flowContainerRef = useRef<HTMLDivElement | null>(null)
  const showHint = true

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 px-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto">
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
        <div
          ref={flowContainerRef}
          className="w-full border border-gray-200 rounded-lg shadow-lg bg-white relative"
          style={{
            // height: "100vh",
            height: "1700px",
            minHeight: 600,
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={true}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            preventScrolling={false}
            defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
            fitViewOptions={{
              padding: 0.15,
              includeHiddenNodes: false,
              minZoom: 0.75,
              maxZoom: 2,
            }}
            minZoom={0.75}
            maxZoom={2}
            onInit={(reactFlowInstance) => {
              // Centramos en el nodo inicial después de cargar
              setTimeout(() => {
                reactFlowInstance.fitView({
                  padding: 0.15,
                  duration: 800,
                  minZoom: 0.75,
                })
              }, 100)
            }}
          >
            <Background gap={16} color="#e2e8f0" size={1} />
            <Controls position="top-right" showZoom={true} showFitView={true} showInteractive={false} />
          </ReactFlow>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="absolute top-4 left-4 pointer-events-none z-10"
              >
                <div className="bg-blue-600/90 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                  Usa +/- para zoom y arrastra para explorar
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default SevenProtocolFlow
