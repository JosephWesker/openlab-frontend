import { useNavigate } from "react-router"
import ProtocolExplanation from "@/components/onBoarding/ProtocolExplanation"

export default function PageProtocol() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate("/")
  }

  return <ProtocolExplanation showBothButtons={true} onContinue={handleContinue} />
}
