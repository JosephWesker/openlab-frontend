import { useState } from 'react'
import { useInitiatives } from "./hooks/useInitiatives"
import InitiativeCard from "../../../../components/shared/initiativeCard"
import SearchIcon from '@mui/icons-material/Search'
import Skeleton from "@mui/material/Skeleton"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { InitiativeMin } from "../initiative/schemas/initiativeSchema"
import { useSearchInitiatives } from './hooks/useInitiativesSearch'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import { CircularProgress, Paper } from '@mui/material'
import { InitiativeState } from '@/interfaces/general-enum'
import teamImg from '@/assets/images/initiative-list/equipo-openlab.jpg'
import { useNavigate } from 'react-router'

export default function PageInitiatives() {
  const [stateFilter, setStateFilter] = useState("proposal")
  const [search, setSearch] = useState("")

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInitiatives(stateFilter)

  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isSearching,
    isError: searchError,
  } = useSearchInitiatives(search)

  // navigate to add initiative
  const navigate = useNavigate()
  const handleNavigation = () => {
    navigate(`/add`)
  }

  function InitiativesSkeleton() {
    return (
      <Box className="p-6 gap-6">
        <Box className="grid gap-4 pb-1">
          <Box className="grid grid-cols-2 gap-6 grid-cols-[30%_calc(70%-1.5rem)]">
            <Skeleton variant="text" />
            <Box className="flex">
              <Skeleton variant="text" className="w-[calc(100%-3rem)]"/>
              <Skeleton variant="circular" className="h-8 w-8 ml-auto" />
            </Box>
          </Box>
          <Box className="flex ml-auto">
            <Skeleton variant="circular" className="h-8 w-8"/>
            <Skeleton variant="circular" className="h-8 w-8"/>
            <Skeleton variant="circular" className="h-8 w-8"/>
          </Box>
          <Skeleton variant="rounded" className="h-6 w-50 mr-auto"/>
          <Skeleton variant="rounded" className="h-40"/>
        </Box>
        <Box className="grid gap-2">
          <Skeleton variant="rounded" className="h-4"/>
          <Skeleton variant="rounded" className="h-4"/>
          <Skeleton variant="rounded" className="h-4"/>
          <Box className="flex items-center justify-center">
            <Skeleton variant="circular" className="h-8 w-8"/>
            <Skeleton variant="circular" className="h-8 w-8"/>
            <Skeleton variant="circular" className="h-8 w-8"/>
          </Box>
          <Skeleton variant="rounded" className="h-8 w-[50%] justify-center align-center flex m-auto"/>
          <Skeleton variant="rounded" className="h-8"/>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="flex h-full justify-center">
      <Box className="flex flex-col flex-1 p-6 gap-6 max-w-7xl">
        <Box className="flex gap-6 items-center justify-center">
          <Paper elevation={2} className='grid grid-cols-3 bg-white rounded-full'>
            <IconButton
              aria-label={InitiativeState.PROPOSAL} onClick={() => stateFilter !== InitiativeState.PROPOSAL && setStateFilter(InitiativeState.PROPOSAL)}
              className={`group flex flex-col rounded-2xl px-6 py-2 bg-[transparent] ${stateFilter === InitiativeState.PROPOSAL && "pointer-events-none"}`}>
              <StarBorderRoundedIcon className={`transition-colors duration-500 ease-in-out text-[#FF7875] group-hover:bg-[#DCE2F9] px-3 py-1 rounded-2xl w-16 h-8 ${stateFilter === InitiativeState.PROPOSAL && "bg-[#DCE2F9]"}`}/>
              <Typography className={`text-xs text-gray-500 group-hover:font-medium ${stateFilter === InitiativeState.PROPOSAL && "font-medium text-[#000!important]"}`}>Propuestas</Typography>
            </IconButton>
            <IconButton
              aria-label={InitiativeState.INPROCESS} onClick={() => stateFilter !== InitiativeState.INPROCESS && setStateFilter(InitiativeState.INPROCESS )}
              className={`group flex flex-col rounded-2xl px-6 py-2 bg-[transparent] ${stateFilter === InitiativeState.INPROCESS  && "pointer-events-none"}`}>
              <StarHalfRoundedIcon className={`transition-colors duration-500 ease-in-out text-[#FA8C16] group-hover:bg-[#DCE2F9] px-3 py-1 rounded-2xl w-16 h-8 ${stateFilter === InitiativeState.INPROCESS  && "bg-[#DCE2F9]"}`}/>
              <Typography className={`text-xs text-gray-500 group-hover:font-medium ${stateFilter === InitiativeState.INPROCESS  && "font-medium text-[#000!important]"}`}>En proceso</Typography>
            </IconButton>
            <IconButton
              aria-label={InitiativeState.APPROVED} onClick={() => stateFilter !== InitiativeState.APPROVED && setStateFilter(InitiativeState.APPROVED)}
              className={`group flex flex-col rounded-2xl px-6 py-2 bg-[transparent] ${stateFilter === InitiativeState.APPROVED && "pointer-events-none"}`}>
              <StarRateRoundedIcon className={`transition-colors duration-500 ease-in-out text-[#46A616] group-hover:bg-[#DCE2F9] px-3 py-1 rounded-2xl w-16 h-8 ${stateFilter === InitiativeState.APPROVED && "bg-[#DCE2F9]"}`}/>
              <Typography className={`text-xs text-gray-500 group-hover:font-medium ${stateFilter === InitiativeState.APPROVED && "font-medium text-[#000!important]"}`}>Activas</Typography>
            </IconButton>
          </Paper>

          <FormControl className="w-100" variant="outlined" size="medium">
            <InputLabel className="" htmlFor="search-initiative">
              Buscar iniciativa
            </InputLabel>
            <OutlinedInput
              id="search-initiative"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='rounded-4xl'
              size='medium'
              sx={{
                borderRadius: '2rem',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                  transition: 'border-color 0.3s ease'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3d7bff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3d7bff',
                }
              }}
              endAdornment={
                <InputAdornment className="" position="end">
                  <IconButton className='' size="medium">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Buscar iniciativa"
            />
          </FormControl>
        </Box>

        {(isError || searchError) && <Box>Sin respuesta</Box>}

        {(isLoading || isSearching) &&
          <Box className="flex flex-wrap gap-6 justify-center">
            {[...Array(6)].map((_, index) => (
              <Box key={index} className="w-xs">
                <InitiativesSkeleton/>
              </Box>
            ))}
          </Box>
        }

        <Box className="flex flex-wrap gap-6 justify-center">
          {(searchData
            ? searchData.pages.flatMap(page => page.content)
            : data?.pages.flatMap(page => page.content)
          )?.map((initiative: InitiativeMin) => (
            <InitiativeCard initiative={initiative} key={initiative.id}/>
          ))}
        </Box>

        <Box className="flex justify-center mt-6">
          {search
            ? (hasNextSearchPage && (
              <Button
                variant="contained"
                className="mt-2 bg-[#3d7bff]"
                onClick={() => fetchNextSearchPage()}
                disabled={isFetchingNextSearchPage}>
                {isFetchingNextSearchPage ? "Cargando..." : "Cargar más resultados"}
              </Button>
            ))
            : (hasNextPage && (
            <Button
              className="flex items-center justify-center gap-4 bg-[var(--color-primary)] hover:bg-[var(--color-secondary-2)] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Cargando..." : "Cargar más"}
              {isFetchingNextPage && (
                <CircularProgress size={16} color="inherit" />
              )}
              </Button>
            ))
          }
        </Box>

        <Box className="mt-12 rounded-2xl overflow-hidden bg-blue-500 text-white flex flex-col md:flex-row">
          <Box className="p-8 w-full md:w-[20rem] flex-shrink-0">
            <Typography variant="h2" component="div" className="text-2xl font-bold mb-2">
              Propón una nueva iniciativa
            </Typography>
            <Typography className="mb-4">
              ¿Tienes una idea brillante? ¡Comparte tu iniciativa con la comunidad y genera un impacto hoy!
            </Typography>
            <Button
              className="bg-white hover:bg-[var(--color-secondary-2)] text-gray-500 hover:text-white font-normal py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => {
                handleNavigation()
              }}
            >
              Únete gratis
            </Button>
          </Box>
          <Box
            component="img"
            src={teamImg}
            alt=""
            className="w-full md:flex-1 min-w-0 object-cover"
          />
        </Box>

      </Box>
    </Box>
  )
}
