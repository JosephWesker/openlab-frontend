import { useEffect, useState } from "react"

type Props = {
  threshold: number
}

export const ProgressBar = ({ threshold }: Props) => {
  const [progress, setProgress] = useState(0)

  // Calcular porcentaje
  // const percentage = Math.min((votes / totalVotes) * 100, 100)

  useEffect(() => {
    // Pequeña animación con retraso
    const timeout = setTimeout(() => {
      setProgress(threshold)
    }, 100)
    return () => clearTimeout(timeout)
  }, [threshold])

  // Determinar color según progreso
  const getColor = () => {
    if (progress >= 75) return "bg-[#19c221]"
    if (progress >= 50) return "bg-[#3ead43]"
    return "bg-[#87c98a]"
  }

  return (
    <div className="w-full">
      {/* <div className="mb-1 text-sm font-medium text-gray-700"> */}
      {/* Votos: {votes} / {totalVotes} ({Math.round(progress)}%) */}
      {/* ({Math.round(progress)}%) */}
      {/* </div> */}
      <div className="w-full bg-gray-200 rounded-2xl relative h-10 overflow-hidden">
        {threshold <= 10 && (
          <div className="flex items-center justify-center absolute left-0 right-0 top-0 bottom-0">
            {Math.round(progress)}%
          </div>
        )}

        <div
          className={`${getColor()} flex flex-col items-center justify-center h-full rounded-2xl text-white font-semibold transition-all duration-700 ease-out`}
          style={{ width: `${progress}%` }}
        >
          {threshold > 10 && `${Math.round(progress)}%`}
        </div>
      </div>
    </div>
  )
}
