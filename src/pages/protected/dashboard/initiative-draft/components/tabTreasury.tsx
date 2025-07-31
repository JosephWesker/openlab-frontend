import Typography from "@mui/material/Typography"
// import type { Initiative } from "../schemas/initiativeSchema"
import CardContent from "@mui/material/CardContent"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import treasuryImg from '@/assets/images/initiative-detail/treasury.svg'
import { ElevatedOnEnter } from "@/components/ui/ElevateOnEnter"
import type { Initiative } from "../../initiative/schemas/initiativeSchema"

export default function TabTreasury({ initiative }: { initiative: Initiative }) {

  return (
    <ElevatedOnEnter>
      <section className="flex flex-col gap-4">
        <div className='hidden'>{initiative.id}</div>

        <Typography className="font-semibold text-2xl text-[#304578]">Tesorería</Typography>

        <Container className="flex flex-col gap-16">
          <section className="flex flex-col gap-4">
            <Typography className="font-bold text-3xl text-center">Tesorería de la Iniciativa:<br></br>
              <span className="text-(--color-primary)">Blockchain para la Transparencia</span></Typography>
            <Typography className="text-[#304578] text-center">
              Descubre cómo los fondos de tu iniciativa activa son gestionados con total transparencia a
              través de su Organización Autónoma Descentralizada (DAO) en la blockchain.
            </Typography>
          </section>

          <section className="flex flex-col gap-4">
            <Typography className="font-bold text-3xl text-center text-(--color-primary)">
              Visión General de la Tesorería DAO
            </Typography>
            <Card className="rounded-2xl bg-[#FAF8FF]">
              <CardContent className="p-4">
                {/* <Box className="font-semibold text-xl text-center flex justify-center gap-2">
                  Estado Actual de Fondos y Tokens (Conceptual)
                </Box> */}
                <CardContent className="flex flex-col items-center p-4 gap-4">
                  <Card className="flex flex-col items-center rounded-2x max-w-xs p-10 gap-4 bg-linear-to-t from-[#DEE8FF] to-[#FFFFFF]">
                    <Box component="img" src={treasuryImg}></Box>
                    <Typography className="text-(--color-primary) font-medium text-sm">Gobernanza y Tesorería Futura</Typography>
                    <Typography className="text-xs text-[#304578] text-center">
                      Una vez que esta iniciativa sea aprobada por la comunidad, aquí podrás ver la información transparente de su DAO,
                      sus fondos y su gobernanza. ¡Tu voto es el primer paso para construir su futuro!
                    </Typography>
                  </Card>
                </CardContent>
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <Typography className="font-bold text-3xl text-center text-(--color-primary)">
              Cómo Invertir y Apoyar esta Iniciativa
            </Typography>
            <Card className="rounded-2xl bg-[#FAF8FF]">
              <CardContent className="p-4 text-[#304578]">
                <Typography className="text-center">
                  La inversión en esta iniciativa se gestiona con total transparencia a través de su
                  Organización Autónoma Descentralizada (DAO) en la blockchain. OpenLab te guía
                  hacia esta plataforma externa donde podrás realizar tu aporte de forma segura.
                </Typography>
                <List className="flex flex-col gap-4">
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Todos los <span className="font-semibold">fondos y transacciones</span> de la DAO son
                      públicamente <span className="font-semibold">verificables</span> en la blockchain.
                    </>}></ListItemText>
                  </ListItem>
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Control de Fondos: Tus fondos no se bloquean. Podrás <span className="font-semibold">retirar o incrementar</span> tu
                      inversión en cualquier momento.
                    </>}></ListItemText>
                  </ListItem>
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Moneda Preferida: Para tu comodidad y facilidad, se recomienda
                      utilizar <span className="font-semibold">USDC (USD Coin)</span> o
                      stablecoins similares para tu aporte.
                    </>}></ListItemText>
                  </ListItem>
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Privacidad: OpenLab no almacena tus claves privadas ni gestiona tus fondos directamente.
                    </>}></ListItemText>
                  </ListItem>
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Los fondos insertados se pueden retirar en cualquier momento. Se van reduciendo conforme se van aprobando/ejecutando compras de tokens.
                    </>}></ListItemText>
                  </ListItem>
                  <ListItem className="p-0 items-baseline">
                    <ListItemIcon className="min-w-[1rem] mt-1">
                      <FiberManualRecordRoundedIcon fontSize="small" className="text-[#304578] text-xs" />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      Los fondos insertados se pueden retirar en cualquier momento. Se van reduciendo conforme se van aprobando/ejecutando compras de tokens.
                    </>}></ListItemText>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </section>
        </Container>
      </section>
    </ElevatedOnEnter>

  )
}