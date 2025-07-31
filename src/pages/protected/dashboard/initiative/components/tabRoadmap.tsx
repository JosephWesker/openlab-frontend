import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Typography from "@mui/material/Typography"
import type { Initiative, Roadmap } from "../schemas/initiativeSchema"
import Card from "@mui/material/Card"
import roadmapImg from '@/assets/images/initiative-detail/roadmap.svg'
import { ElevatedOnEnter } from "@/components/ui/ElevateOnEnter"

export default function TabRoadmap({ initiative }: { initiative: Initiative }) {

  return (
    <ElevatedOnEnter>
      <section className="flex flex-col gap-4">
        <Typography className="font-semibold text-2xl text-[#304578]">Roadmap</Typography>
        <List className="flex flex-col items-center gap-8">
          {initiative.roadmap.length === 0 ?
            <Card className="flex flex-col items-center rounded-2xl max-w-xs p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
              <Box component="img" src={roadmapImg}></Box>
              <Typography className="text-(--color-primary) font-medium text-sm">Trazando el Futuro</Typography>
              <Typography className="text-xs text-[#304578] text-center">
                El camino de esta iniciativa está por definirse. El líder pronto trazará los hitos y las fases que guiarán este viaje.
              </Typography>
            </Card>
          :
            initiative.roadmap.map((step: Roadmap, index: number) => (
              <ListItem key={index} className="p-0 grid grid-cols-[auto_auto] gap-4">
                <Box>
                  <Typography className="w-[3rem] h-[3rem] flex items-center justify-center bg-gray-200 rounded-full">{step.phaseNumber ? step.phaseNumber : index + 1}</Typography>
                </Box>
                <div className="flex flex-direction-column flex-wrap gap-2">
                  <div className="w-full text-sm font-semibold">Fase {step.phaseNumber ? step.phaseNumber : index + 1}</div>
                  <div className="w-full font-semibold">{step.phaseName}</div>
                  <div className="w-full">{step.description}</div>
                  <Chip label={step.status} variant="outlined" className="rounded-md"/>
                </div>
                {/* {index !== initiative.roadmap.length - 1 ? <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-200"></hr> : <></>} */}
              </ListItem>
            ))
          }

        </List>
      </section>
    </ElevatedOnEnter>
  )
}