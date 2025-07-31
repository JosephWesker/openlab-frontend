import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import TurnSlightRightOutlinedIcon from '@mui/icons-material/TurnSlightRightOutlined'
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSearchParams } from 'react-router'
import TabSummary from './tabSummary'
import TabUpdates from './tabUpdates'
import TabComments from './tabComments'
import TabRoadmap from './tabRoadmap'
import TabTreasury from './tabTreasury'
import type { Initiative } from '../schemas/initiativeSchema'
import { InitiativeTabs } from '@/interfaces/general-enum'

export default function TabsNav({ initiative }: { initiative: Initiative }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = (searchParams.get('tab')?.toLowerCase() as InitiativeTabs) || InitiativeTabs.SUMMARY
  const tabsRef = useRef<HTMLDivElement>(null)

  // Calcular proporción mínima visible según ancho de pantalla
  const getMinVisibleRatio = () => {
    const width = window.innerWidth
    if (width < 640) return 0.1 // móviles
    if (width < 1024) return 0.2 // tablets
    return 0.3 // escritorio
  }

  // Verifica si al menos un porcentaje del elemento es visible
  const isElementPartiallyVisible = (el: HTMLElement, visibleRatio: number) => {
    const rect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight

    const elementHeight = rect.height
    const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0))

    const visiblePercentage = visibleTop / elementHeight
    return visiblePercentage >= visibleRatio
  }

  // Validar tab activa
  useEffect(() => {
    if (!Object.values(InitiativeTabs).includes(currentTab as InitiativeTabs)) {
      setSearchParams({ tab: InitiativeTabs.SUMMARY })
    }
  }, [currentTab, setSearchParams])

  // Cambiar título del documento
  useEffect(() => {
    document.title = `${initiative.title} - ${currentTab}`
  }, [currentTab])

  // Scroll si las tabs no están suficientemente visibles
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    const minRatio = getMinVisibleRatio()

    if (tabsRef.current && tabParam && !isElementPartiallyVisible(tabsRef.current, minRatio)) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searchParams])

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue })
  }

  return (
    <Box ref={tabsRef}>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        role="navigation"
        className='bg-[#FAF8FF]'
      >
        <Tab label="Resumen" value={InitiativeTabs.SUMMARY} icon={<RemoveRedEyeOutlinedIcon />} iconPosition="start"/>
        <Tab label="Roadmap" value={InitiativeTabs.ROADMAP} icon={<TurnSlightRightOutlinedIcon />} iconPosition="start" />
        <Tab label="Actualizaciones" value={InitiativeTabs.UPDATES} icon={<UpdateOutlinedIcon />} iconPosition="start" />
        <Tab label="Tesorería" value={InitiativeTabs.TREASURY} icon={<AccountBalanceOutlinedIcon />} iconPosition="start" />
        <Tab label="Comentarios" value={InitiativeTabs.COMMENTS} icon={<CommentOutlinedIcon />} iconPosition="start" />
      </Tabs>

      <Box className="p-4">
        {currentTab === InitiativeTabs.SUMMARY && <TabSummary initiative={ initiative }/>}
        {currentTab === InitiativeTabs.ROADMAP && <TabRoadmap initiative={ initiative }/>}
        {currentTab === InitiativeTabs.UPDATES && <TabUpdates initiative={ initiative }/>}
        {currentTab === InitiativeTabs.TREASURY && <TabTreasury initiative={ initiative }/>}
        {currentTab === InitiativeTabs.COMMENTS && <TabComments initiative={ initiative }/>}
      </Box>
    </Box>
  )
}
