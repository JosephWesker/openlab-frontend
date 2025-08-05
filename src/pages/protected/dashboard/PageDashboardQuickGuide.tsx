import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { motion } from "motion/react"
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"
import LoginIcon from "@mui/icons-material/Login"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import EditIcon from "@mui/icons-material/Edit"
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects"
import SearchIcon from "@mui/icons-material/Search"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import BuildCircleIcon from "@mui/icons-material/BuildCircle"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ErrorSimulator from "@/components/debug/ErrorSimulator"
import ProtocolExplanation from "@/components/onBoarding/ProtocolExplanation"

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const faqs = [
  {
    q: "¿OpenLab es una plataforma Web3?",
    a: "Sí, OpenLab está basada en tecnologías Web3 para fomentar la colaboración y la innovación abierta.",
  },
  {
    q: "¿Cómo se validan las propuestas?",
    a: "Las propuestas se validan mediante votación de la comunidad y revisión por parte de los administradores.",
  },
  {
    q: "¿Puedo proponer un proyecto que no sea Web3?",
    a: "Sí, puedes proponer cualquier tipo de iniciativa que aporte valor a la comunidad.",
  },
  {
    q: "¿Cómo gano tokens por mi colaboración?",
    a: "Puedes ganar tokens completando tareas (bounties) y participando activamente en iniciativas.",
  },
  {
    q: "¿Mis datos personales están seguros?",
    a: "Tus datos están protegidos y solo se usan para fines de la plataforma.",
  },
  {
    q: "¿Hay alguna tarifa por usar OpenLab?",
    a: "No, OpenLab es gratuito para los usuarios.",
  },
]

const sectionTitle = (text: string) => (
  <Typography
    variant="h4"
    fontWeight={800}
    color="#2970f1"
    align="center"
    sx={{ mb: 1, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}
  >
    {text}
  </Typography>
)

const sectionSubtitle = (text: string) => (
  <Typography
    variant="body1"
    color="#6b7280"
    align="center"
    sx={{ mb: 3, maxWidth: 700, mx: "auto", fontSize: { xs: "0.9rem", sm: "1rem" } }}
  >
    {text}
  </Typography>
)

const cardStyle = {
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
  borderLeft: "5px solid #2970f1",
  mb: 2,
  px: 3,
  py: 2.5,
  minHeight: 0,
}

const subtitleStyle = { color: "#2970f1", fontWeight: 700, mb: 0.5, fontSize: { xs: "1rem", sm: "1.125rem" } }

export default function PageDashboardQuickGuide() {
  return (
    <Box minHeight="100dvh" py={6}>
      <Box maxWidth={900} mx="auto" px={2}>
        {/* titulo principal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            color="#2970f1"
            align="center"
            sx={{
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
              mx: "auto",
            }}
          >
            Guía Rápida para Usuarios <br />
            Explora OpenLab
          </Typography>
          <Box mb={2} />
          <Typography variant="body1" color="#444" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            ¡Bienvenido/a a OpenLab! Esta guía te ayudará a empezar y aprovechar al máximo nuestra plataforma. Descubre
            cómo proponer ideas, colaborar en proyectos y ser parte de nuestra comunidad de innovación.
          </Typography>
          <Box mb={4} />
        </motion.div>

        {/* Protocolo de OpenLab - Solo botón de más información */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <ProtocolExplanation showBothButtons={false} />
        </motion.div>

        {/* 1. Tu Viaje en OpenLab */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>{sectionTitle("1. Tu Viaje en OpenLab: Primeros Pasos")}</motion.div>
          <Box mb={4} />

          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <PersonAddAltIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>1.1. Regístrate y Únete a la Comunidad</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Para explorar y participar en OpenLab, necesitarás crear una cuenta. Es rápido y sencillo.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Haz clic en "Registrarse" en la cabecera.</li>
                  <li>Completa tu Nombre, Correo Electrónico y Contraseña segura.</li>
                  <li>Acepta nuestros términos y condiciones.</li>
                </Box>
                <Typography fontWeight={600} color="#2970f1" mt={1}>
                  ¡Luego, el Onboarding te guiará para configurar tu perfil inicial!
                </Typography>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <LoginIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>1.2. Inicia Sesión</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Si ya tienes una cuenta, podrás acceder a todas las funcionalidades de OpenLab.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Haz clic en "Iniciar Sesión" en la cabecera.</li>
                  <li>Introduce tu Correo Electrónico y Contraseña.</li>
                  <li>Haz clic en "Iniciar Sesión" para acceder a tu panel.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        {/* 2. Tu Perfil en OpenLab */}
        <Box mt={8} />
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>
            {sectionTitle("2. Tu Perfil en OpenLab")}
            {sectionSubtitle(
              "Tu perfil es tu carta de presentación digital en la comunidad. Aquí podrás mostrar tus habilidades, intereses y actividad.",
            )}
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <AccountCircleIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>2.1. Ver Tu Perfil</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Accede a tu perfil para ver tu información básica, biografía, habilidades listadas, enlaces externos y
                  los roles que has seleccionado. También encontrarás un resumen de tu actividad en la plataforma.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Haz clic en tu avatar o nombre de usuario en la cabecera/sidebar.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <EditIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>2.2. Editar Tu Perfil</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Mantén tu información actualizada para que otros colaboradores y líderes de iniciativa puedan
                  conocerte mejor.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Desde tu propia página de perfil, busca y haz clic en "Editar Perfil".</li>
                  <li>Modifica los campos deseados (biografía, habilidades, enlaces).</li>
                  <li>Haz clic en "Guardar Cambios" para actualizar tu información.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        {/* 3. Explorar y Descubrir Iniciativas */}
        <Box mt={8} />
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>
            {sectionTitle("3. Explorar y Descubrir Iniciativas")}
            {sectionSubtitle("El corazón de OpenLab es la sección donde las ideas toman forma y buscan colaboración.")}
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <EmojiObjectsIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>3.1. Ver la Lista de Iniciativas</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Explora una galería de tarjetas, cada una representando una iniciativa. Podrás ver su título, una
                  breve descripción, su imagen y su estado (Propuesta o Activa).
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Haz clic en "Explorar Iniciativas" en el menú principal.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <SearchIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>3.2. Filtrar y Buscar Iniciativas</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Encuentra rápidamente los proyectos que más te interesan utilizando nuestras herramientas de búsqueda.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Usa los filtros de estado (ej. "Propuestas", "Activas") para refinar la lista.</li>
                  <li>
                    Utiliza la barra de búsqueda para encontrar iniciativas por palabras clave en su título o
                    descripción.
                  </li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <MenuBookIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>3.3. Ver el Detalle de una Iniciativa</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Haz clic en cualquier tarjeta para acceder a la página completa de la iniciativa, con descripciones
                  detalladas, objetivos y secciones interactivas.
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        {/* 4. Proponer y Validar tu Idea */}
        <Box mt={8} />
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>
            {sectionTitle("4. Proponer y Validar tu Idea")}
            {sectionSubtitle(
              "Si tienes una visión innovadora, OpenLab te ofrece el camino para lanzarla y obtener el apoyo de la comunidad.",
            )}
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <AutoAwesomeIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>4.1. Enviar una Nueva Propuesta de Iniciativa</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Serás guiado por un formulario multi-paso para detallar tu idea.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>
                    <b>Paso 1: ¡Tu Gran Idea!</b> (Título, Lema, Imagen/Video).
                  </li>
                  <li>
                    <b>Paso 2: Profundizando en la Visión</b> (Descripción detallada, Objetivos).
                  </li>
                  <li>
                    <b>Paso 3: Tu Equipo Clave y Necesidades</b> (Puedes listar co-fundadores/inversores si ya los
                    tienes, añadir enlaces externos y describir necesidades de colaboradores).
                  </li>
                  <li>
                    <b>Paso 4: ¡Lista para la Comunidad!</b> (Revisa y envía).
                  </li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <HowToVoteIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>4.2. Votar en una Propuesta de Iniciativa</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Tu voto cuenta. Expresa tu apoyo o desacuerdo en las ideas propuestas por la comunidad.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>Navega al detalle de una iniciativa en estado "Propuesta".</li>
                  <li>Verás el apoyo actual y las opciones para "Apoyar" o "No Apoyar".</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        {/* 5. Participar y Colaborar */}
        <Box mt={8} />
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>
            {sectionTitle("5. Participar y Colaborar")}
            {sectionSubtitle("Descubre cómo puedes aportar tu talento e incluso invertir en proyectos con potencial.")}
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <VolunteerActivismIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>5.1. Postularte para una Iniciativa Activa</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Ofrece tu talento directamente a una iniciativa que te interese, incluso si no hay una "vacante"
                  específica publicada.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>
                    En la página de detalle de una iniciativa "Activa", haz clic en "Postularme para esta Iniciativa".
                  </li>
                  <li>Escribe un mensaje personalizado explicando tu interés y cómo puedes contribuir.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <MonetizationOnIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>5.2. Cómo Invertir en una Iniciativa</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  OpenLab te guiará al proceso de inversión en la DAO de la iniciativa, gestionado de forma transparente
                  en la blockchain.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>En la página de detalle de una iniciativa "Activa", busca la sección "Cómo Invertir".</li>
                  <li>Serás redirigido/a al explorador de la DAO (ej. Aragon Explorer) para realizar tu aporte.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
          <motion.div variants={itemVariant}>
            <Box sx={cardStyle}>
              <BuildCircleIcon sx={{ color: "#2970f1", fontSize: { xs: 30, sm: 36 }, mb: 1.5 }} />
              <Box>
                <Typography sx={subtitleStyle}>5.3. Colaborar en el Día a Día (Herramientas Externas)</Typography>
                <Typography color="#222" fontWeight={500} mb={1}>
                  Una vez aceptado en un proyecto, la colaboración diaria se gestiona en herramientas especializadas.
                </Typography>
                <Box
                  component="ul"
                  sx={{ m: 0, pl: 2.5, color: "#444", fontSize: { xs: "0.9rem", sm: "1rem" }, "& li": { mb: 0.5 } }}
                >
                  <li>
                    <b>Dwork:</b> Para ver y completar tareas (bounties) y recibir tokens como recompensa.
                  </li>
                  <li>
                    <b>Discord:</b> Para la comunicación en tiempo real con el equipo.
                  </li>
                  <li>
                    <b>GitHub:</b> Para la gestión del código y desarrollo colaborativo (si aplica).
                  </li>
                  <li>Encontrarás enlaces directos a estas herramientas en la página de la iniciativa activa.</li>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>

        {/* 6. Preguntas Frecuentes (FAQs) */}
        <Box mt={8} />
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariant}>{sectionTitle("6. Preguntas Frecuentes (FAQs)")}</motion.div>
          <Box
            sx={{ bgcolor: "#fff", borderRadius: 3, boxShadow: "0 2px 8px rgba(44,62,80,0.04)", px: 2, py: 1, mb: 6 }}
          >
            {faqs.map((faq, idx) => (
              <motion.div variants={itemVariant} key={idx}>
                <Accordion
                  sx={{
                    bgcolor: "transparent",
                    boxShadow: "none",
                    // borderBottom: idx < faqs.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronRightIcon sx={{ color: "#2970f1", fontSize: 28 }} />}
                    sx={{ minHeight: 56 }}
                  >
                    <Typography fontWeight={700} color="#2970f1" sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}>
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="#444" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Simulador de errores - Solo en desarrollo */}
        {process.env.NODE_ENV === "development" && (
          <motion.div variants={itemVariant}>
            <Box sx={{ mt: 4 }}>
              {sectionTitle("🐛 Herramientas de Desarrollo")}
              <ErrorSimulator />
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  )
}
