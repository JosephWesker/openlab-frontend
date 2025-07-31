import { useParams, useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Typography, Container, Button } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useApi } from "@/hooks/useApi"
import { API_PATH } from "@/lib/constants"
import InitiativePreviewCard, { type InitiativeCardData } from "@/components/shared/InitiativePreviewCard"
import { LoadingScreen } from "@/components/ui/LoadingTransition"

// La respuesta completa de la API puede ser más compleja,
// pero definimos lo que necesitamos para la tarjeta.
interface InitiativeDetailResponse {
  id: number
  title: string
  description: string
  img: string
  state: string
  motto: string
  user: {
    name: string
    image?: string
  }
  // Añadir otros campos si son necesarios para la tarjeta
}

export default function PageDashboardListInitiativeById() {
  const { initiativeId } = useParams<{ initiativeId: string }>()
  const fetchApi = useApi()
  const navigate = useNavigate()

  console.log(initiativeId)

  const {
    data: initiative,
    isLoading,
    error,
  } = useQuery<InitiativeDetailResponse>({
    queryKey: ["initiative", initiativeId],
    queryFn: () => fetchApi({ path: `${API_PATH.INITIATIVE}/${initiativeId}` }),
    enabled: !!initiativeId,
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error || !initiative) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="error.main" gutterBottom>
          Error al cargar la iniciativa
        </Typography>
        <Typography color="text.secondary">
          No pudimos encontrar los detalles de esta iniciativa. Por favor, intenta de nuevo.
        </Typography>
        <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/list")} sx={{ mt: 4 }}>
          Volver a la lista
        </Button>
      </Container>
    )
  }

  // Mapeamos los datos de la API a lo que espera nuestra tarjeta reutilizable.
  const cardData: InitiativeCardData = {
    title: initiative.title,
    mainImage: initiative.img,
    state: initiative.state,
    leaderName: initiative.user.name,
    leaderAvatar: initiative.user.image,
    motto: initiative.motto,
    description: initiative.description,
    // Estos son valores de ejemplo, ya que no vienen en la API de detalle.
    teamMemberCount: 5,
    participantsCount: 5,
    votesCount: 0,
  }

  return (
    <Container sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/admin")} sx={{ alignSelf: "flex-start" }}>
        Volver a la lista
      </Button>

      <InitiativePreviewCard initiative={cardData} buttonText="Ver Iniciativa" onButtonClick={() => {}} />
    </Container>
  )
}
