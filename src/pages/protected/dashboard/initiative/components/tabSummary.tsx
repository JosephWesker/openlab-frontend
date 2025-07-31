import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ModeStandbyIcon from '@mui/icons-material/ModeStandby'
import ListItemIcon from "@mui/material/ListItemIcon"
import List from "@mui/material/List"
import type { Initiative } from "../schemas/initiativeSchema"
import Typography from "@mui/material/Typography"
import { ElevatedOnEnter } from "@/components/ui/ElevateOnEnter"

export default function TabSummary({ initiative }: { initiative: Initiative }) {

  return (
    <ElevatedOnEnter>
      <div className="flex flex-col gap-4">
        <section>
          <Typography className="font-semibold text-2xl text-[#304578]">Resumen</Typography>
        </section>

        <section>
          <Typography className="font-semibold text-xl mb-2">Descripción</Typography>
          <p className="text-sm text-gray-700">
            {initiative.description}
          </p>
        </section>

        <section>
          <Typography className="font-semibold text-xl mb-2">Problema que resuelve</Typography>
          <p className="text-sm text-gray-700">
            {initiative.problemToBeSolved}
          </p>
        </section>

        <section>
          <Typography className="font-semibold text-xl mb-2">Información de mercado (Oportunidad)</Typography>
          <p className="text-sm text-gray-700">
            {initiative.marketInformation}
          </p>
        </section>

        <section>
          <Typography className="font-semibold text-xl mb-2">Características del producto o servicio</Typography>
          <p className="text-sm text-gray-700">
            {initiative.productFeatures}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Objetivos</h2>
          <List>
            {initiative.objectives.map((objective: string, index: number) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ModeStandbyIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={objective} />
              </ListItem>
            ))}
          </List>
        </section>

      </div>
    </ElevatedOnEnter>
  )
}