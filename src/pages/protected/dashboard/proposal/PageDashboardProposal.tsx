import React, { useState, useEffect } from "react"
import { Box, Typography, Container, Avatar, Button, LinearProgress, Chip, Card } from "@mui/material"
import { Person, Group, TrendingUp, AssignmentIndRounded, Diversity2Rounded } from "@mui/icons-material"
import { motion } from "motion/react"
import { ProfferModal } from "@/components/proffer/ProfferModal"

// Types
interface Person {
  name: string
  role: string
  avatar: string
  generalSkill: string
  technicalSkills: string[]
  description: string
  status?: "searching" | "joined"
  isSearching?: boolean
}

// Generate random person
const generateRandomPerson = (_id: number, isSearching?: boolean): Person => {
  const names = [
    "Jane Doe",
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah White",
    "David Wilson",
    "Lisa Garcia",
    "Robert Davis",
    "Maria Rodriguez",
    "James Miller",
    "Jennifer Taylor",
    "William Anderson",
    "Jessica Thomas",
    "Christopher Jackson",
    "Amanda Martinez",
  ]

  return {
    name: isSearching ? "Buscando Cofundador" : names[Math.floor(Math.random() * names.length)],
    role: RANDOM_ROLES[Math.floor(Math.random() * RANDOM_ROLES.length)],
    avatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`, // Pravatar - reliable avatar service
    generalSkill: RANDOM_GENERAL_SKILLS[Math.floor(Math.random() * RANDOM_GENERAL_SKILLS.length)],
    technicalSkills: Array.from(
      { length: 3 },
      () => RANDOM_TECHNICAL_SKILLS[Math.floor(Math.random() * RANDOM_TECHNICAL_SKILLS.length)],
    ),
    description: "Buscamos un perfil proactivo y con ganas de crecer dentro del proyecto.",
    status: isSearching ? "searching" : "joined",
    isSearching: isSearching || false,
  }
}

const PersonItem: React.FC<{
  person: Person
  showButtons?: boolean
  isCoFounder?: boolean
  onApply?: (p: Person) => void
}> = ({ person, showButtons = false, isCoFounder = false, onApply }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
    <Avatar
      src={person.avatar}
      sx={{
        width: 40,
        height: 40,
        bgcolor: "primary.light",
      }}
    >
      {person.name.charAt(0)}
    </Avatar>

    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
        {person.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
        {person.role}
      </Typography>
    </Box>

    {showButtons && isCoFounder && (
      <Box sx={{ display: "flex", gap: 1 }}>
        {person.isSearching && (
          <>
            <Chip
              label="Buscando"
              size="small"
              sx={{
                backgroundColor: "#e8f5e8",
                color: "#2e7d32",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
                minWidth: 60,
                height: 24,
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                },
              }}
              onClick={() => onApply?.(person)}
            >
              Aplicar
            </Button>
          </>
        )}
      </Box>
    )}
  </Box>
)

// TODO: QUITAR TODO LOS RANDOM
// ----- Constantes globales para generación de datos aleatorios -----
// Random roles for variety (solo para ejemplos)
const RANDOM_ROLES = [
  "Head of Marketing",
  "Content Strategist",
  "Digital Advertising Specialist",
  "SEO Manager",
  "Social Media Coordinator",
  "Product Manager",
  "UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Growth Hacker",
  "Brand Manager",
  "Community Manager",
  "Sales Director",
  "Business Analyst",
]

// Habilidad general de ejemplo
const RANDOM_GENERAL_SKILLS = [
  "Comunicación",
  "Liderazgo",
  "Creatividad",
  "Resolución de Problemas",
  "Gestión de Proyectos",
]

// Pool de habilidades técnicas ejemplo
const RANDOM_TECHNICAL_SKILLS = [
  "React",
  "Node.js",
  "Python",
  "SQL",
  "AWS",
  // "Figma",
  "SEO",
  "Analytics",
  "Docker",
  "Kubernetes",
]

// Valores por defecto para los cofres "Buscando Cofundador"
const DEFAULT_ROLE = "COFOUNDER"
const DEFAULT_GENERAL_SKILL = "Comunicación"
const DEFAULT_TECHNICAL_SKILLS = ["React", "Node.js", "SQL"]
const DEFAULT_DESCRIPTION = "Buscamos un perfil proactivo para unirse como cofundador."

export default function PageDashboardProposal() {
  // State for random data
  const [leaderData, setLeaderData] = useState<Person | null>(null)
  const [coFoundersData, setCoFoundersData] = useState<Person[]>([])
  const [collaboratorsData, setCollaboratorsData] = useState<Person[]>([])
  const [investorsData, setInvestorsData] = useState<Person[]>([])

  // Estado para modal de postulación
  const [profferOpen, setProfferOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const handleOpenProffer = (person: Person) => {
    setSelectedPerson(person)
    setProfferOpen(true)
  }

  const handleCloseProffer = () => {
    setProfferOpen(false)
    setSelectedPerson(null)
  }

  // Helper para "buscando" cofundador según props
  const generateSearchingPerson = (): Person => ({
    name: "Buscando Cofundador",
    role: DEFAULT_ROLE,
    avatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
    generalSkill: DEFAULT_GENERAL_SKILL,
    technicalSkills: DEFAULT_TECHNICAL_SKILLS,
    description: DEFAULT_DESCRIPTION,
    status: "searching",
    isSearching: true,
  })

  // Generate random data on component mount
  useEffect(() => {
    // Generate leader
    setLeaderData({
      name: "Jane Doe",
      role: "Head of Marketing",
      avatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 70) + 1}`,
      generalSkill: "Liderazgo",
      technicalSkills: ["Gestión de Proyectos", "Comunicación"],
      description: "Líder responsable de coordinar todas las áreas del proyecto.",
    })

    // Generate co_founders (2 searching con props, 2 joined aleatorios)
    setCoFoundersData([
      generateSearchingPerson(),
      generateSearchingPerson(),
      generateRandomPerson(3, false),
      generateRandomPerson(4, false),
    ])

    // Generate collaborators
    setCollaboratorsData([
      generateRandomPerson(5),
      generateRandomPerson(6),
      generateRandomPerson(7),
      generateRandomPerson(8),
    ])

    // Generate investors
    setInvestorsData([
      generateRandomPerson(9),
      generateRandomPerson(10),
      generateRandomPerson(11),
      generateRandomPerson(12),
    ])
  }, [])

  const investmentData = {
    current: 525.7,
    target: 550,
    percentage: 51.4,
    daysLeft: 12,
    round: "Seed",
  }

  if (!leaderData) {
    return <div>Cargando...</div>
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: 460, py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <Card
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "transparent",
          }}
        >
          {/* Leader Section */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
              <Typography variant="h6" color="primary" fontWeight="600">
                Leader
              </Typography>
              <AssignmentIndRounded sx={{ color: "primary.main", fontSize: 20 }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "left" }}>
              <Avatar
                src={leaderData.avatar}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "primary.light",
                }}
              >
                {leaderData.name.charAt(0)}
              </Avatar>

              <Box sx={{ textAlign: "left" }}>
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {leaderData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leaderData.role}
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Co_founders Section */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, justifyContent: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="600">
                Co fundadores
              </Typography>
              <Diversity2Rounded sx={{ color: "primary.main", fontSize: 20 }} />
            </Box>

            {coFoundersData.map((person, index) => (
              <PersonItem
                key={index}
                person={person}
                showButtons={true}
                isCoFounder={true}
                onApply={handleOpenProffer}
              />
            ))}

            {/* Progress Circle */}
            <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `conic-gradient(#4fc3f7 0deg ${(75 * 360) / 100}deg, #e3f2fd ${(75 * 360) / 100}deg 360deg)`,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight="600" color="primary">
                    50%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
                className="bg-secondary/40 hover:bg-secondary hover:text-white"
              >
                Participar
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Collaborators Section */}
        <Card
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "transparent",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="600">
              Colaboradores
            </Typography>
            <Group sx={{ color: "primary.main", fontSize: 20 }} />
          </Box>

          {collaboratorsData.map((person, index) => (
            <PersonItem key={index} person={person} />
          ))}

          {/* Progress Circle */}
          <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `conic-gradient(#4fc3f7 0deg ${(50 * 360) / 100}deg, #e3f2fd ${(50 * 360) / 100}deg 360deg)`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" fontWeight="600" color="primary">
                  50%
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 1,
                px: 3,
                py: 1,
                color: "text.primary",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
              className="bg-secondary/40 hover:bg-secondary hover:text-white"
            >
              Participar
            </Button>
          </Box>
        </Card>

        {/* Investors Section */}
        <Card
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "transparent",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="600">
              Inversionistas
            </Typography>
            <Group sx={{ color: "primary.main", fontSize: 20 }} />
          </Box>

          {investorsData.map((person, index) => (
            <PersonItem key={index} person={person} />
          ))}

          {/* Investment Section */}
          <Card elevation={1} sx={{ mt: 4, p: 2, backgroundColor: "transparent", borderRadius: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: "text.primary", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Inversión
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Meta de Financiación (Seed):
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 1 }}>
              <Typography component="span" color="#06D6A0" variant="body1" fontWeight="600">
                {investmentData.current} ETH{" "}
              </Typography>
              <Typography component="span" color="text.secondary" variant="body1" fontWeight="600">
                de {investmentData.target} ETH
              </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={(investmentData.current / investmentData.target) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#06D6A0",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
              {investmentData.percentage}% Alcanzado | Ronda cierra en {investmentData.daysLeft} días
            </Typography>

            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
                className="bg-secondary/40 hover:bg-secondary hover:text-white"
              >
                Invertir en la iniciativa
              </Button>
            </Box>
          </Card>
        </Card>
      </motion.div>

      {/* Modal de postulación */}
      <ProfferModal open={profferOpen} onClose={handleCloseProffer} person={selectedPerson} />
    </Container>
  )
}
