import { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material"
import {
  Search,
  MoreVert,
  Edit,
  Visibility,
  UnfoldMore,
  KeyboardArrowUp,
  KeyboardArrowDown,
  FormatListBulleted,
  LightbulbRounded,
  TrendingUpRounded,
  CheckCircleRounded,
  Block,
  EditNote,
} from "@mui/icons-material"
import { motion } from "motion/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type Row,
  type Cell,
  type HeaderGroup,
  type SortingState,
} from "@tanstack/react-table"
import { useApi } from "@/hooks/useApi"
import { API_PATH } from "@/lib/constants"
import { LoadingScreen } from "@/components/ui/LoadingTransition"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { useSnackbar } from "@/context/SnackbarContext"
import type { Initiative, InitiativeAdminView } from "@/interfaces/initiative"
import { ApproveInitiativeModal } from "@/components/admin/ApproveInitiativeModal"
import { useSlugNavigation } from "@/hooks/useSlugNav"
import { useDebounce } from "./initiatives/hooks/useDebounce"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

const columnHelper = createColumnHelper<InitiativeAdminView>()

interface PaginatedInitiativesResponse {
  content: InitiativeAdminView[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// Helper para obtener la configuración de los estados
const configMap: Record<
  InitiativeAdminView["state"],
  { label: string; color: string; bgcolor: string; borderColor: string; icon: React.ReactElement }
> = {
  draft: {
    label: "Borrador",
    color: "#e17055",
    bgcolor: "linear-gradient(135deg, rgb(255, 234, 167) 0%, rgb(253, 203, 110) 100%);",
    borderColor: "#fdd835",
    icon: <EditNote fontSize="small" />,
  },
  proposal: {
    label: "Propuesta",
    color: "white",
    bgcolor: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    borderColor: "#0984e3",
    icon: <LightbulbRounded fontSize="small" />,
  },
  inprocess: {
    label: "En Proceso",
    color: "white",
    bgcolor: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
    borderColor: "#e17055",
    icon: <TrendingUpRounded fontSize="small" />,
  },
  approved: {
    label: "Aprobada",
    color: "white",
    bgcolor: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
    borderColor: "#00a085",
    icon: <CheckCircleRounded fontSize="small" />,
  },
  disable: {
    label: "Desactivada",
    color: "white",
    bgcolor: "linear-gradient(135deg, #636e72 0%, #2d3436 100%)",
    borderColor: "#2d3436",
    icon: <Block fontSize="small" />,
  },
}
const getStateConfig = (state: InitiativeAdminView["state"] | undefined) => {
  const lowerCaseState = state?.toLowerCase()

  if (lowerCaseState && lowerCaseState in configMap) {
    return configMap[lowerCaseState as InitiativeAdminView["state"]]
  }

  return {
    label: state ?? "N/A",
    color: "text.secondary",
    bgcolor: "grey.200",
    borderColor: "grey.400",
    icon: <Block fontSize="small" />,
  }
}

const filterOptions = [
  { value: "All", label: "Todas", icon: <FormatListBulleted fontSize="small" /> },
  { value: "proposal", label: "Propuestas", icon: <LightbulbRounded fontSize="small" /> },
  { value: "inprocess", label: "En Proceso", icon: <TrendingUpRounded fontSize="small" /> },
  { value: "approved", label: "Aprobadas", icon: <CheckCircleRounded fontSize="small" /> },
  { value: "disable", label: "Desactivadas", icon: <Block fontSize="small" /> },
] as const

export default function PageDashboardAdmin() {
  const fetchApi = useApi()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()

  // --- States ---
  const [activeTab, setActiveTab] = useState(0)
  const [globalFilter, setGlobalFilter] = useState("")
  const debouncedGlobalFilter = useDebounce(globalFilter, 500)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 })
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: true }]) // Ordenar por votos por defecto
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<InitiativeAdminView | null>(null)
  const [statusFilter, setStatusFilter] = useState<(typeof filterOptions)[number]["value"]>("All")
  const [isApproveModalOpen, setApproveModalOpen] = useState(false)
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false)
  const { goToInitiative } = useSlugNavigation()

  // --- Handlers ---
  const handleFilterChange = (newStatus: (typeof filterOptions)[number]["value"]) => {
    setStatusFilter(newStatus)
    const newTabIndex = filterOptions.findIndex((opt) => opt.value === newStatus)
    setActiveTab(newTabIndex)
    setPagination((p) => ({ ...p, pageIndex: 0 })) // Reset page on filter change
  }

  // --- Query ---
  // Query para paginación del servidor (vista "Todas")
  const {
    data: paginatedData,
    isLoading: isLoadingServer,
    isError: isErrorServer,
  } = useQuery<PaginatedInitiativesResponse>({
    // Eliminamos `sorting` para que los cambios de ordenación no disparen nuevas peticiones
    queryKey: ["initiatives", "admin", "paginated", pagination],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams()
      params.append("page", pagination.pageIndex.toString())
      params.append("size", pagination.pageSize.toString())

      // Se omite el parámetro `sort` para que la API no reordene y mantengamos la ordenación en el cliente
      return await fetchApi({
        path: `${API_PATH.INITIATIVE_ADMIN}?${params.toString()}`,
        init: { signal },
      })
    },
    enabled: statusFilter === "All",
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Query para cargar todos los datos de un estado específico
  const {
    data: localData,
    isLoading: isLoadingLocal,
    isError: isErrorLocal,
  } = useQuery<InitiativeAdminView[]>({
    queryKey: ["initiatives", "admin", "local", statusFilter],
    queryFn: async () => {
      // 1. Fetch primera página para saber el total
      const firstPage = (await fetchApi({
        path: `${API_PATH.INITIATIVE_ADMIN}?page=0&size=12`,
      })) as PaginatedInitiativesResponse
      const { totalPages, content } = firstPage
      const allInitiatives = [...content]

      // 2. Si hay más páginas, traerlas todas en paralelo
      if (totalPages > 1) {
        const promises = []
        for (let page = 1; page < totalPages; page++) {
          promises.push(
            fetchApi({
              path: `${API_PATH.INITIATIVE_ADMIN}?page=${page}&size=12`,
            }),
          )
        }
        const results = await Promise.all(promises)
        results.forEach((pageResult) => allInitiatives.push(...(pageResult as PaginatedInitiativesResponse).content))
      }

      return allInitiatives
    },
    enabled: statusFilter !== "All",
    staleTime: 5 * 60 * 1000, // Cachear por 5 minutos
  })

  const isLoading = isLoadingServer || isLoadingLocal
  const isError = isErrorServer || isErrorLocal

  // --- Lógica de borrado ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetchApi({ path: `${API_PATH.INITIATIVE}/${id}`, init: { method: "DELETE" } }),
    onSuccess: () => {
      showSnackbar({ message: "Iniciativa desactivada correctamente.", severity: "success", title: "Éxito" })
      // Invalidar ambas queries para estar seguros
      queryClient.invalidateQueries({ queryKey: ["initiatives", "admin", "paginated"] })
      queryClient.invalidateQueries({ queryKey: ["initiatives", "admin", "local"] })
    },
    onError: () => {
      showSnackbar({ message: "Error al desactivar", severity: "error", title: "Error" })
    },
  })

  // --- Configuración de la tabla ---
  const isManualMode = statusFilter === "All"
  const baseData = isManualMode ? (paginatedData?.content ?? []) : (localData ?? [])
  const tableData = statusFilter === "All" ? baseData : baseData.filter((i) => i.state.toLowerCase() === statusFilter)
  const totalRows = isManualMode ? (paginatedData?.totalElements ?? 0) : tableData.length

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "visual_number", // Cambiado para reflejar que es el número visual
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>N°</Box>,
        size: 45,
        minSize: 40,
        maxSize: 50,
        cell: (props) => {
          // props.row es la fila actual
          // props.table.getRowModel().rows son las filas de la página actual
          // Índice global basado en paginación
          const { pageIndex, pageSize } = props.table.getState().pagination
          return pageIndex * pageSize + props.row.index + 1
        },
      }),
      columnHelper.accessor("title", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Título</Box>,
        size: 400,
        minSize: 350,
        maxSize: 450,
        cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, maxWidth: 450 }}>
            <Avatar src={row.original.img} sx={{ bgcolor: "primary.light" }}>
              {row.original.title.charAt(0)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight="600" noWrap>
                {row.original.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {row.original.motto}
              </Typography>
            </Box>
          </Box>
        ),
      }),
      columnHelper.accessor("state", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Estado</Box>,
        size: 140,
        minSize: 140,
        maxSize: 160,
        cell: ({ getValue }) => {
          const state = getValue()
          const config = getStateConfig(state)

          return (
            <Chip
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {config.icon}
                  <span>{config.label}</span>
                </Box>
              }
              size="small"
              sx={{
                fontWeight: 600,
                background: config.bgcolor,
                color: config.color,
                fontSize: "0.75rem",
                border: "none",
                "& .MuiChip-label": { px: 1.5, py: 0.5 },
              }}
            />
          )
        },
      }),
      columnHelper.accessor("user.name", {
        id: "leader",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Líder</Box>,
        size: 180,
        minSize: 150,
        maxSize: 200,
        cell: ({ row }) => {
          const user = row.original.user
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={user.profilePic}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "secondary.light",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight="500" noWrap title={user.name}>
                  {user.name}
                </Typography>
              </Box>
            </Box>
          )
        },
      }),
      columnHelper.accessor((row) => (row.votesInFavor ?? 0) + (row.votesAgainst ?? 0), {
        id: "votes",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Votos</Box>,
        size: 110,
        minSize: 110,
        maxSize: 120,
        cell: ({ row, getValue }) => {
          const total = getValue() as number
          const inFavor = (row.original as InitiativeAdminView).votesInFavor ?? 0
          const against = (row.original as InitiativeAdminView).votesAgainst ?? 0
          return (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" fontWeight={700}>
                {total}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                <Typography variant="caption" color="success.main">
                  👍 {inFavor}
                </Typography>
                <Typography variant="caption" color="error.main">
                  👎 {against}
                </Typography>
              </Box>
            </Box>
          )
        },
        sortingFn: (rowA, rowB) => {
          const totalA = (rowA.original.votesInFavor ?? 0) + (rowA.original.votesAgainst ?? 0)
          const totalB = (rowB.original.votesInFavor ?? 0) + (rowB.original.votesAgainst ?? 0)
          return totalA - totalB
        },
      }),
      columnHelper.accessor("date", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Fecha</Box>,
        size: 120,
        cell: ({ getValue }) => (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            {new Date(getValue()).toLocaleDateString(undefined, { timeZone: "UTC" })}
          </Typography>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Acciones</Box>,
        size: 300,
        minSize: 300,
        maxSize: 350,
        cell: ({ row }) => {
          const initiative = row.original
          const state = initiative.state?.toLowerCase()
          const isDisable = state === "disable"

          return (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", gap: 0.75 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => (setSelectedRow(initiative), setApproveModalOpen(true))}
                  disabled={isDisable || state === "approved"}
                >
                  Aprobar
                </Button>
                {/* <Button variant="contained" size="small" color="tertiary" disabled={isDisable}>
                  Rechazar
                </Button> */}
                <Button
                  variant="contained"
                  size="small"
                  color="secondaryLight"
                  disabled={isDisable}
                  onClick={() => (setSelectedRow(initiative), setDeactivateModalOpen(true))}
                >
                  Desactivar
                </Button>
              </Box>
              <IconButton size="small" onClick={(e) => (setAnchorEl(e.currentTarget), setSelectedRow(row.original))}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          )
        },
      }),
    ],
    [theme],
  )

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: isManualMode ? (paginatedData?.totalPages ?? -1) : undefined,
    state: { pagination, sorting, globalFilter: debouncedGlobalFilter },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: isManualMode,
    manualFiltering: false,
    // La ordenación será siempre en el cliente, por lo que desactivamos manualSorting
    manualSorting: false,
  })

  const handleMenuClose = () => {
    setAnchorEl(null)
    setTimeout(() => setSelectedRow(null), 200)
  }

  const handleAction = (action: string) => {
    if (!selectedRow) return
    // const { id } = selectedRow
    if (action === "view") goToInitiative(selectedRow)
    if (action === "edit") {
      // Reutilizamos el modal de aprobación para editar la iniciativa
      setApproveModalOpen(true)
    }
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, mx: "auto", py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Gestionar propuestas
        </Typography>

        {/* Barra de Sub-Tabs y Filtros */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap", // Permite que los elementos se envuelvan en pantallas pequeñas
            gap: 2, // Espacio entre los sub-tabs y el grupo de filtros si se envuelven
            mb: 3,
          }}
        >
          {/* Sub-Tabs a la izquierda */}
          <Box
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              p: 0.5,
              display: "inline-flex",
              gap: 0.5,
              flexWrap: "wrap", // Permite que los botones de sub-tab se envuelvan
            }}
          >
            {filterOptions.map((tab, index) => (
              <Button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                sx={{
                  textTransform: "none",
                  borderRadius: 99,
                  px: 2.5,
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease-in-out",
                  color: activeTab === index ? "white" : "text.primary",
                  backgroundColor: activeTab === index ? "primary.main" : "#f0f2f5",
                  "&:hover": { backgroundColor: activeTab === index ? "primary.main" : "#e0e0e0" },
                }}
              >
                <Box component="span" sx={{ mr: 1 }}>
                  {tab.icon}
                </Box>
                {tab.label}
              </Button>
            ))}
          </Box>

          {/* Controles de Búsqueda y Filtro a la derecha */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              placeholder="Buscar por título o lider..."
              value={globalFilter}
              onChange={(e) => {
                const newSearchTerm = e.target.value
                setGlobalFilter(newSearchTerm)

                // Si el usuario busca y no está en "Todas", lo cambiamos
                if (newSearchTerm && statusFilter !== "All") {
                  handleFilterChange("All")
                } else {
                  // Si ya está en "Todas" o borra la búsqueda, solo resetea la página
                  setPagination((p) => ({ ...p, pageIndex: 0 }))
                }
              }}
              size="small"
              sx={{ minWidth: { xs: "calc(100% - 170px)", sm: 250, md: 300 } }} // Ajustar ancho para que quepa con el select
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value as (typeof filterOptions)[number]["value"])}
                label="Estado"
                renderValue={(selectedValue) => {
                  const selectedOption = filterOptions.find((opt) => opt.value === selectedValue)
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                        {selectedOption?.icon}
                      </Box>
                      {selectedOption?.label}
                    </Box>
                  )
                }}
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box component="span" sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
                      {option.icon}
                    </Box>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table / Loading / Error / Empty */}
        {isLoading ? (
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", width: "100%" }}
          >
            <LoadingScreen noFixed />
          </Box>
        ) : isError ? (
          <ErrorState context="loading" />
        ) : tableData.length === 0 ? (
          <EmptyState context={debouncedGlobalFilter ? "search" : "general"} />
        ) : (
          <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
            <motion.div
              key={activeTab + pagination.pageIndex + statusFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TableContainer
                sx={{
                  "&::-webkit-scrollbar": { height: 8 },
                  "&::-webkit-scrollbar-track": { bgcolor: "grey.100" },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 1 },
                }}
              >
                <Table stickyHeader sx={{ tableLayout: "fixed" }}>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<InitiativeAdminView>) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            sx={{
                              fontWeight: 600,
                              bgcolor: "grey.50",
                              width: header.getSize(),
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <Box>
                                  {header.column.getIsSorted() === "asc" ? (
                                    <KeyboardArrowUp sx={{ fontSize: "16px" }} />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <KeyboardArrowDown sx={{ fontSize: "16px" }} />
                                  ) : (
                                    <UnfoldMore sx={{ fontSize: "14px", opacity: 0.6 }} />
                                  )}
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {table.getRowModel().rows.map((row: Row<InitiativeAdminView>, index: number) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0, transition: { duration: 0.2, delay: index * 0.03 } }}
                        style={{ display: "table-row" }}
                      >
                        {row.getVisibleCells().map((cell: Cell<InitiativeAdminView, unknown>) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                count={totalRows}
                page={pagination.pageIndex}
                onPageChange={(_, page) => setPagination((p) => ({ ...p, pageIndex: page }))}
                rowsPerPage={pagination.pageSize}
                onRowsPerPageChange={(e) => setPagination({ pageIndex: 0, pageSize: parseInt(e.target.value, 10) })}
                rowsPerPageOptions={[12, 24, 48, 96]}
              />
            </motion.div>
          </Paper>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionProps={{
            onExited: () => setSelectedRow(null),
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.closest(".Mui-disabled") || target.closest("li[disabled]")) {
              e.stopPropagation()
            }
          }}
        >
          <MenuItem disabled={!selectedRow || selectedRow.state === "disable"} onClick={() => handleAction("view")}>
            <Visibility fontSize="small" sx={{ mr: 1 }} /> Ver Iniciativa
          </MenuItem>
          <MenuItem onClick={() => handleAction("edit")} disabled={!selectedRow || selectedRow.state !== "approved"}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Ver Enlaces
          </MenuItem>
        </Menu>

        {selectedRow && (
          <ApproveInitiativeModal
            open={isApproveModalOpen}
            onClose={() => setApproveModalOpen(false)}
            initiative={selectedRow as unknown as Initiative}
          />
        )}

        {selectedRow && (
          <ConfirmationModal
            open={isDeactivateModalOpen}
            onClose={() => setDeactivateModalOpen(false)}
            onConfirm={() => {
              deleteMutation.mutate(selectedRow.id)
              setDeactivateModalOpen(false)
            }}
            variant="delete"
            context="deactivate"
            details={{ name: selectedRow.title }}
          />
        )}
      </motion.div>
    </Container>
  )
}
