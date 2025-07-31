import { useState, useMemo } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TablePagination from "@mui/material/TablePagination"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Popover from "@mui/material/Popover"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Avatar from "@mui/material/Avatar"
import Search from "@mui/icons-material/Search"
import MoreVert from "@mui/icons-material/MoreVert"
import Visibility from "@mui/icons-material/Visibility"
import ViewColumn from "@mui/icons-material/ViewColumn"
import VideoLibrary from "@mui/icons-material/VideoLibrary"
import Image from "@mui/icons-material/Image"
import LightbulbRounded from "@mui/icons-material/LightbulbRounded"
import UnfoldMore from "@mui/icons-material/UnfoldMore"
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded"
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded"
import Block from "@mui/icons-material/Block"
import FormatListBulleted from "@mui/icons-material/FormatListBulleted"
import Edit from "@mui/icons-material/Edit"
import { motion } from "motion/react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type Column,
  type HeaderGroup,
  type Row,
  type Cell,
  type SortingState,
} from "@tanstack/react-table"
import type { Initiative } from "@/interfaces/initiative"
import { LoadingScreen } from "@/components/ui/LoadingTransition"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { useSlugNavigation } from "@/hooks/useSlugNav"
import { useNavigate } from "react-router"

const columnHelper = createColumnHelper<Initiative>()

interface MyParticipationsProps {
  subTab: number
  onSubTabChange: (newValue: number) => void
  globalFilter: string
  setGlobalFilter: (value: string) => void
  data: Initiative[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const MyParticipations = ({
  subTab,
  onSubTabChange,
  globalFilter,
  setGlobalFilter,
  data,
  isLoading,
  error,
  refetch,
}: MyParticipationsProps) => {
  const { goToInitiative } = useSlugNavigation()
  const navigate = useNavigate()

  // States
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<Initiative | null>(null)
  const [columnVisibility, setColumnVisibility] = useState({})
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null)

  // El reseteo de paginación y filtros se maneja en el componente padre

  // Usar los datos recibidos como props
  const participations = data

  // Filter data based on subtab
  const filteredData = useMemo(() => {
    let filtered: Initiative[] = participations

    switch (subTab) {
      case 0: // Todas
        filtered = participations
        break
      case 1: // Propuestas
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "proposal")
        break
      case 2: // En proceso
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "inprocess")
        break
      case 3: // Activas (aprobadas)
        filtered = participations.filter((item: Initiative) => item.state?.toLowerCase() === "approved")
        break
      default:
        filtered = participations
    }

    return filtered
  }, [participations, subTab])

  // Table columns - igual que "Mis Iniciativas" pero con columna adicional "Líder"
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "visual_number",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>N°</Box>,
        size: 45,
        minSize: 45,
        maxSize: 50,
        enableSorting: false,
        cell: (props) => {
          const { pageIndex, pageSize } = props.table.getState().pagination
          const pageRows = props.table.getRowModel().rows
          const rowIndexOnPage = pageRows.findIndex((pagedRow) => pagedRow.id === props.row.id)
          return pageIndex * pageSize + rowIndexOnPage + 1
        },
      }),
      columnHelper.accessor("title", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Título</Box>,
        size: 300,
        minSize: 250,
        maxSize: 350,
        cell: ({ row, getValue }: { row: { original: Initiative }; getValue: () => string }) => {
          const imageUrl = row.original.img

          const isVideo = (url: string): boolean => {
            if (!url) return false
            const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv", "video"]
            const urlLower = url.toLowerCase()
            return videoExtensions.some((ext) => urlLower.includes(ext))
          }

          const getVideoThumbnail = (url: string): string => {
            if (!url || !url.includes("cloudinary.com") || !isVideo(url)) {
              return url
            }

            try {
              const transformations = "so_2.0,w_80,h_80,c_fill,q_auto,f_auto"
              let thumbnailUrl = url.replace(/\.\w+$/, ".jpg")
              thumbnailUrl = thumbnailUrl.replace("/upload/", `/upload/${transformations}/`)
              return thumbnailUrl
            } catch (error) {
              console.warn("Error generating video thumbnail:", error)
              return url
            }
          }

          const mediaUrl = imageUrl
          const isVideoFile = isVideo(mediaUrl)
          const previewUrl = isVideoFile ? getVideoThumbnail(mediaUrl) : mediaUrl

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, maxWidth: 350 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    "& img": {
                      objectFit: "cover",
                    },
                  }}
                >
                  {getValue().charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: isVideoFile ? "#e74c3c" : "#3498db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    zIndex: 1,
                  }}
                >
                  {isVideoFile ? (
                    <VideoLibrary sx={{ fontSize: "10px", color: "white" }} />
                  ) : (
                    <Image sx={{ fontSize: "10px", color: "white" }} />
                  )}
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight="600" noWrap title={getValue()}>
                  {getValue()}
                </Typography>
                {row.original.motto && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem", fontWeight: 400 }}
                    noWrap
                    title={row.original.motto}
                  >
                    {row.original.motto}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        },
      }),
      // Nueva columna "Líder"
      columnHelper.accessor("user.name", {
        id: "leader",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Líder</Box>,
        size: 150,
        minSize: 120,
        maxSize: 180,
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
                {/* <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  title={user.email}
                  sx={{ fontSize: "0.7rem" }}
                >
                  {user.email}
                </Typography> */}
              </Box>
            </Box>
          )
        },
      }),
      // Resto de columnas igual que "Mis Iniciativas"
      columnHelper.accessor("description", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Descripción</Box>,
        size: 250,
        minSize: 200,
        maxSize: 300,
        cell: ({ getValue }: { getValue: () => string }) => {
          const description = getValue() || "Sin descripción"
          return (
            <Box sx={{ maxWidth: 300 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                  fontSize: "0.875rem",
                }}
                title={description}
              >
                {description}
              </Typography>
            </Box>
          )
        },
      }),
      columnHelper.accessor("state", {
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Estado</Box>,
        size: 130,
        minSize: 120,
        maxSize: 150,
        cell: ({ getValue }: { getValue: () => string }) => {
          const state = getValue()

          const getStateConfig = (state: string) => {
            switch (state?.toLowerCase()) {
              case "proposal":
                return {
                  label: "Propuesta",
                  bg: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                  color: "white",
                  icon: <LightbulbRounded fontSize="small" />,
                }
              case "inprocess":
                return {
                  label: "En Proceso",
                  bg: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
                  color: "white",
                  icon: <TrendingUpRounded fontSize="small" />,
                }
              case "approved":
                return {
                  label: "Aprobada",
                  bg: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
                  color: "white",
                  icon: <CheckCircleRounded fontSize="small" />,
                }
              // case "draft":
              //   return {
              //     label: "Borrador",
              //     bg: "linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%)",
              //     color: "#e17055",
              //     icon: <EditNote fontSize="small" />,
              //   }
              default:
                return {
                  label: "Sin estado",
                  bg: "#f8f9fa",
                  color: "#6c757d",
                  icon: <Block fontSize="small" />,
                }
            }
          }

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
                background: config.bg,
                color: config.color,
                fontWeight: 600,
                fontSize: "0.75rem",
                border: "none",
                "& .MuiChip-label": {
                  px: 1.5,
                  py: 0.5,
                },
              }}
            />
          )
        },
      }),
      // Columna de votaciones (igual que en "Mis Iniciativas")
      columnHelper.accessor((row) => (row.votesInFavor ?? 0) + (row.votesAgainst ?? 0), {
        id: "votes",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}>Votos</Box>,
        size: 110,
        minSize: 110,
        maxSize: 120,
        cell: ({ row, getValue }) => {
          const total = getValue() as number
          const inFavor = (row.original as Initiative).votesInFavor ?? 0
          const against = (row.original as Initiative).votesAgainst ?? 0
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
      columnHelper.display({
        id: "actions",
        header: () => <Box sx={{ textAlign: "center", width: "100%" }}></Box>,
        size: 40,
        minSize: 40,
        maxSize: 40,
        enableSorting: false,
        cell: ({ row }) => (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedRow(row.original)
              setAnchorEl(e.currentTarget)
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        ),
      }),
    ],
    [],
  )

  // React Table setup
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  })

  const visibleColumns = table.getAllColumns().filter((column) => column.getCanHide())

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleAction = (action: string) => {
    if (!selectedRow) return

    switch (action) {
      case "view":
        if (selectedRow.state !== "draft") {
          goToInitiative(selectedRow)
        }
        break
      case "edit":
        if (selectedRow.state !== "draft") {
          navigate("/update", { state: { initiative: selectedRow } })
        }
        break
      default:
        break
    }
    handleMenuClose()
  }

  // Error state (solo si hay error sin datos)
  if (error && !data) {
    return (
      <ErrorState
        context="loading"
        actionButton={refetch}
        customMessage="No se pudieron cargar tus participaciones como cofundador. Por favor, intenta de nuevo."
      />
    )
  }

  return (
    <Box>
      {/* Subtabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f8f9fa",
            borderRadius: 2,
            p: 0.5,
            display: "inline-flex",
            gap: 0.5,
            flexWrap: "wrap",
            order: { xs: 2, md: 1 },
          }}
        >
          {[
            { label: "Todas", icon: <FormatListBulleted /> },
            { label: "Propuestas", icon: <LightbulbRounded /> },
            { label: "En Proceso", icon: <TrendingUpRounded /> },
            { label: "Aprobadas", icon: <CheckCircleRounded /> },
          ].map((tab, index) => (
            <Button
              key={index}
              variant="text"
              onClick={() => onSubTabChange(index)}
              disabled={isLoading && subTab !== index}
              sx={{
                textTransform: "none",
                borderRadius: 99,
                px: 2.5,
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 600,
                minWidth: "auto",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease-in-out",
                color: subTab === index ? "white" : "text.primary",
                backgroundColor: subTab === index ? "primary.main" : "#f0f2f5",
                "&:hover": {
                  backgroundColor: subTab === index ? "primary.main" : "#e0e0e0",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                {tab.icon}
              </Box>
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Controles de tabla */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            order: { xs: 1, md: 2 },
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-start" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ViewColumn />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            size="small"
            sx={{ height: "40px" }}
          >
            Columnas
          </Button>

          <TextField
            placeholder="Buscar iniciativas..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            size="small"
            sx={{
              flexGrow: 1,
              minWidth: { sm: 250 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Column visibility popover */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List sx={{ minWidth: 200 }}>
          {visibleColumns.map((column: Column<Initiative, unknown>) => (
            <ListItem key={column.id} dense>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id === "visual_number"
                        ? "N°"
                        : column.id === "leader"
                          ? "Líder"
                          : column.id === "votes"
                            ? "Votos"
                            : column.id}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* Área de contenido */}
      <Box sx={{ position: "relative", minHeight: "400px" }}>
        {/* Loader sutil que no oculta los filtros */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 10,
              borderRadius: 3,
            }}
          >
            <LoadingScreen noFixed />
          </Box>
        )}

        {/* EmptyState cuando no hay datos */}
        {isLoading ? null : filteredData.length === 0 ? (
          <Box sx={{ py: 8 }}>
            <EmptyState
              context={(() => {
                switch (subTab) {
                  case 1:
                    return "participations-proposals"
                  case 2:
                    return "participations-in-process"
                  case 3:
                    return "participations-active"
                  default:
                    return "participations"
                }
              })()}
              actionButton={
                subTab === 0 ? (
                  <Button onClick={() => navigate("/")} variant="contained" size="large">
                    Explorar iniciativas
                  </Button>
                ) : undefined
              }
            />
          </Box>
        ) : (
          /* Tabla cuando hay datos */
          <Paper elevation={1} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <TableContainer
                sx={{
                  maxHeight: { xs: "70vh", md: "60vh" },
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#a8a8a8",
                    },
                  },
                }}
              >
                <Table
                  stickyHeader
                  sx={{
                    minWidth: { xs: 900, sm: 1100 },
                    tableLayout: "fixed",
                    width: "100%",
                  }}
                >
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<Initiative>) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "grey.50",
                              cursor: header.column.getCanSort() ? "pointer" : "default",
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              width: header.getSize(),
                              maxWidth: header.getSize(),
                              minWidth: header.getSize(),
                              "&:hover": header.column.getCanSort()
                                ? {
                                    backgroundColor: "grey.100",
                                  }
                                : {},
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", ml: 0.5 }}>
                                  {header.column.getIsSorted() === "asc" ? (
                                    <KeyboardArrowUp sx={{ fontSize: "16px", color: "primary.main" }} />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <KeyboardArrowDown sx={{ fontSize: "16px", color: "primary.main" }} />
                                  ) : (
                                    <UnfoldMore sx={{ fontSize: "14px", color: "text.secondary", opacity: 0.6 }} />
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
                    {table.getRowModel().rows.map((row: Row<Initiative>, index: number) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            duration: 0.2,
                            delay: index * 0.03,
                            ease: [0.4, 0, 0.2, 1],
                          },
                        }}
                        style={{
                          display: "table-row",
                        }}
                      >
                        {row.getVisibleCells().map((cell: Cell<Initiative, unknown>) => (
                          <TableCell
                            key={cell.id}
                            sx={{
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              width: cell.column.getSize(),
                              maxWidth: cell.column.getSize(),
                              minWidth: cell.column.getSize(),
                              ...(cell.column.id !== "actions" && {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }),
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.04)",
                              },
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={table.getFilteredRowModel().rows.length}
              page={pagination.pageIndex}
              onPageChange={(_, page) => setPagination((prev) => ({ ...prev, pageIndex: page }))}
              rowsPerPage={pagination.pageSize}
              onRowsPerPageChange={(e) =>
                setPagination((prev) => ({ ...prev, pageSize: parseInt(e.target.value, 10) }))
              }
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Paper>
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleAction("view")} disabled={selectedRow?.state === "draft"}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Ver Iniciativa
        </MenuItem>
        <MenuItem onClick={() => handleAction("edit")} disabled={selectedRow?.state === "draft"}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
      </Menu>
    </Box>
  )
}
