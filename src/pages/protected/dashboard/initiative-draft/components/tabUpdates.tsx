import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
// import type { Initiative, Update } from "../schemas/initiativeSchema"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import updatesImg from '@/assets/images/initiative-detail/updates.svg'
import { ElevatedOnEnter } from "@/components/ui/ElevateOnEnter"
import type { Initiative, Update } from "../../initiative/schemas/initiativeSchema"

export default function TabUpdates({ initiative }: { initiative: Initiative }) {

  return (
    <ElevatedOnEnter>
      <section className="flex flex-col gap-4">
        <Typography className="font-semibold text-2xl text-[#304578]">Actualizaciones</Typography>
        <List className="flex flex-col items-center gap-4">
          {initiative.update.length === 0 ?
            <Card className="flex flex-col items-center rounded-2xl max-w-xs p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
              <Box component="img" src={updatesImg}></Box>
              <Typography className="text-(--color-primary) font-medium text-sm">Diario de la Iniciativa</Typography>
              <Typography className="text-xs text-[#304578] text-center">
                El viaje de esta iniciativa está por comenzar. El líder publicará aquí los avances y descubrimientos.
              </Typography>
            </Card>
          :
            initiative.update.map((updateSingle: Update, index: number) => (
              <ListItem key={index} className="p-0 items-baseline">
                <div className="flex flex-col flex-wrap">
                  <ListItemText primary={updateSingle.name} slotProps={{primary: { className: "font-semibold"}}}/>
                  <ListItemText primary={updateSingle.description} />
                </div>
                {/* { index !== initiative.update.length - 1 && <hr className="w-full h-px my-3 bg-gray-200 border-0 dark:bg-gray-200"></hr> } */}
              </ListItem>
            ))
          }
        </List>
      </section>
    </ElevatedOnEnter>
  )
}