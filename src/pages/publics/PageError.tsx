import { motion } from  "motion/react"
import { useNavigate } from "react-router"
import { useErrorPageContext } from "@/hooks/useErrorPageContext"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

export default function PageError() {
  const { errorData } = useErrorPageContext()
  const navigate = useNavigate()

  // Variantes para las animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.8,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const blurVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.8, 1.2, 1],
      opacity: [0, 0.8, 0.4],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  }

  // Nuevas variantes para el logo con efecto pulsante y flotante
  const logoVariants = {
    initial: { y: 0, scale: 1, boxShadow: "0 0 20px rgba(59,130,246,0.5)" },
    animate: {
      y: [-8, 8, -8], // Movimiento flotante arriba y abajo
      scale: [1, 1.1, 1], // Efecto pulsante
      boxShadow: ["0 0 20px rgba(59,130,246,0.5)", "0 0 40px rgba(59,130,246,0.8)", "0 0 20px rgba(59,130,246,0.5)"],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    },
  }

  const laserVariants = {
    initial: { width: 0, opacity: 0 },
    animate: {
      width: ["0%", "100%", "0%"],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  }

  // Valores de título y mensaje a mostrar
  const title = errorData.title || "Error Desconocido"
  const message = errorData.message || "Ha ocurrido un error inesperado"

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Efectos de fondo */}
      <motion.div
        className="absolute inset-0 bg-blue-500 rounded-full filter blur-[100px]"
        variants={blurVariants}
        initial="initial"
        animate="animate"
        style={{ left: "30%", top: "40%", width: "40%", height: "40%" }}
      />

      <motion.div
        className="absolute inset-0 bg-purple-500 rounded-full filter blur-[100px]"
        variants={blurVariants}
        initial="initial"
        animate="animate"
        style={{ left: "60%", top: "30%", width: "30%", height: "30%" }}
      />

      {/* Efecto láser horizontal */}
      <motion.div
        className="absolute h-1 bg-cyan-400 left-0 top-1/2"
        variants={laserVariants}
        initial="initial"
        animate="animate"
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto p-8 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center">
          {/* Logo con animación */}
          <motion.div
            className="w-32 h-32 mb-6 rounded-full bg-white p-4 flex items-center justify-center overflow-hidden"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            style={{ position: "relative" }}
          >
            {/* Destello radial alrededor del logo */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 15px 5px rgba(59,130,246,0.3)",
                  "0 0 25px 10px rgba(59,130,246,0.7)",
                  "0 0 15px 5px rgba(59,130,246,0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <img src="/src/assets/images/logo.webp" alt="OpenLab Logo" className="w-full h-full object-contain" />
          </motion.div>

          <motion.h1 className="text-4xl font-bold text-white mb-4 text-center tracking-wider" variants={itemVariants}>
            <span className="text-primary uppercase">{title}</span>
          </motion.h1>

          <motion.div
            className="h-1 w-40 bg-gradient-to-r from-blue-500 to-cyan-400 mb-6 rounded-full"
            variants={itemVariants}
          />

          <motion.div
            className="flex items-center gap-2 text-cyan-100 mb-8 text-center text-xl"
            variants={itemVariants}
          >
            <ErrorOutlineIcon className="text-red-400" sx={{ fontSize: 28 }} />
            <p className="text-rose-400">¡Vaya! Parece que hubo un problema al acceder a la aplicación.</p>
          </motion.div>

          <motion.div
            className="mb-6 p-4 bg-black/30 border border-red-500/30 rounded-lg text-red-300 text-sm w-full"
            variants={itemVariants}
          >
            <code className="font-mono break-words whitespace-pre-wrap">{message}</code>
          </motion.div>

          <motion.div className="flex gap-4" variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30"
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-full"
              onClick={() => navigate("/login")}
            >
              Volver a inicio
            </motion.button>
          </motion.div>
        </div>

        {/* Partículas flotantes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400/50"
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
