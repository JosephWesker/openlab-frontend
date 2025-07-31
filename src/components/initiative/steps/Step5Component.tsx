import React, { useState, useCallback } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  type Theme,
} from "@mui/material"
import { Add, Delete, Update, Timeline, ExpandMore, Edit, DragIndicator } from "@mui/icons-material"
import { motion } from "motion/react"
import { useFormContext, useFieldArray } from "react-hook-form"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
import { FormTextField } from "./shared/FormTextField"
import { RoadmapStatus } from "@/interfaces/general-enum"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

// Componente sorteable para elementos del roadmap
interface SortableRoadmapItemProps {
  id: string
  index: number
  phase: {
    id: string
    phase: string
    title: string
    description: string
    status: RoadmapStatus
  }
  statusOptions: Array<{ value: RoadmapStatus; color: string }>
  onEdit: (index: number, title: string, description: string, status: RoadmapStatus) => void
  onDelete: (index: number, title: string) => void
  theme: Theme
}

const SortableRoadmapItem: React.FC<SortableRoadmapItemProps> = ({
  id,
  index,
  phase,
  statusOptions,
  onEdit,
  onDelete,
  theme,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
  }

  const statusOption = statusOptions.find((opt) => opt.value === phase.status)

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 12 : 1}
      sx={{
        mb: 2,
        borderRadius: 2,
        cursor: isDragging ? "grabbing" : "default",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        transition: isDragging ? "none" : "all 0.2s ease-in-out",
        "&:hover": {
          elevation: isDragging ? 12 : 4,
          transform: isDragging ? "scale(1.02)" : "scale(1.01)",
        },
      }}
    >
      <ListItem sx={{ py: 2 }}>
        {/* Drag handle */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 1,
            cursor: "grab",
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <DragIndicator />
        </Box>

        <Box
          sx={{
            width: 60,
            height: 40,
            borderRadius: "8px",
            background: theme.palette.secondary.main,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            mr: 2,
            fontSize: "0.75rem",
          }}
        >
          Fase {index + 1}
        </Box>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography variant="h6" fontWeight="500">
                {phase.title}
              </Typography>
              <Chip
                label={statusOption?.value || RoadmapStatus.PENDING}
                size="small"
                sx={{
                  backgroundColor: statusOption?.color,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
          }
          secondary={phase.description}
          sx={{
            "& .MuiListItemText-secondary": {
              mt: 0.5,
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => onEdit(index, phase.title, phase.description, phase.status)}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete(index, phase.title)} color="error" size="small">
            <Delete />
          </IconButton>
        </Box>
      </ListItem>
    </Card>
  )
}

const Step5Component: React.FC = () => {
  const theme = useTheme()
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<InitiativeFormData>()

  // Watch para obtener los valores actuales
  const watchedRoadmapPhases = watch("roadmapPhases") || []

  // Función auxiliar para obtener errores de manera type-safe
  const getFieldError = (section: "updates" | "roadmapPhases", index?: number, fieldName?: string) => {
    if (index !== undefined && fieldName) {
      // Error en campo específico de un elemento del array
      const arrayErrors = errors[section] as Array<Record<string, { message: string }>> | undefined
      if (arrayErrors && arrayErrors[index] && arrayErrors[index][fieldName]) {
        return {
          message: arrayErrors[index][fieldName].message,
          type: "validation" as const,
        }
      }
    } else {
      // Error general del array
      const sectionError = errors[section] as { message: string } | undefined
      if (sectionError) {
        return {
          message: sectionError.message,
          type: "validation" as const,
        }
      }
    }
    return undefined
  }

  // Configuración de sensores para drag and drop (más responsivos)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Evita activación accidental
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Estados para accordions
  const [updatesExpanded, setUpdatesExpanded] = useState(true)
  const [roadmapExpanded, setRoadmapExpanded] = useState(true)

  // Estados para inputs
  const [newUpdateTitle, setNewUpdateTitle] = useState("")
  const [newUpdateDescription, setNewUpdateDescription] = useState("")
  const [newRoadmapTitle, setNewRoadmapTitle] = useState("")
  const [newRoadmapDescription, setNewRoadmapDescription] = useState("")
  const [newRoadmapStatus, setNewRoadmapStatus] = useState<RoadmapStatus>(RoadmapStatus.PENDING)

  // Estados para edición
  const [editingUpdate, setEditingUpdate] = useState<{ index: number; title: string; description: string } | null>(null)
  const [editingRoadmap, setEditingRoadmap] = useState<{
    index: number
    title: string
    description: string
    status: RoadmapStatus
  } | null>(null)

  // Estados para modales de confirmación
  const [deleteUpdateModalOpen, setDeleteUpdateModalOpen] = useState(false)
  const [deleteRoadmapModalOpen, setDeleteRoadmapModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ index: number; title: string; type: "update" | "roadmap" } | null>(
    null,
  )

  const {
    fields: updates,
    append: addUpdate,
    remove: removeUpdate,
    update: updateUpdateItem,
  } = useFieldArray({
    control,
    name: "updates",
  })

  const {
    fields: roadmapPhases,
    append: addRoadmapPhase,
    remove: removeRoadmapPhase,
    update: updateRoadmapItem,
  } = useFieldArray({
    control,
    name: "roadmapPhases",
  })

  const statusOptions = [
    { value: RoadmapStatus.PENDING, color: "#FFA726" },
    { value: RoadmapStatus.IN_REVIEW, color: "#FF6B6B" },
    { value: RoadmapStatus.IN_PROGRESS, color: "#45B7D1" },
    { value: RoadmapStatus.COMPLETED, color: "#4CAF50" },
    { value: RoadmapStatus.CANCELLED, color: "#EF5350" },
  ]

  // Funciones para manejar accordions
  const handleUpdatesAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setUpdatesExpanded(isExpanded)
  }, [])

  const handleRoadmapAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setRoadmapExpanded(isExpanded)
  }, [])

  // Funciones para actualizaciones
  const addNewUpdate = useCallback(() => {
    const trimmedTitle = newUpdateTitle.trim()
    const trimmedDescription = newUpdateDescription.trim()

    if (trimmedTitle && trimmedDescription) {
      addUpdate({
        id: `update_${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        createdAt: new Date(),
      })
      setNewUpdateTitle("")
      setNewUpdateDescription("")
    }
  }, [newUpdateTitle, newUpdateDescription, addUpdate])

  const handleEditUpdate = useCallback((index: number, title: string, description: string) => {
    setEditingUpdate({ index, title, description })
  }, [])

  const handleSaveEditedUpdate = useCallback(() => {
    if (editingUpdate && editingUpdate.title && editingUpdate.description) {
      const currentUpdate = updates[editingUpdate.index]
      updateUpdateItem(editingUpdate.index, {
        id: currentUpdate.id,
        title: editingUpdate.title,
        description: editingUpdate.description,
        createdAt: currentUpdate.createdAt,
      })
      setEditingUpdate(null)
    }
  }, [editingUpdate, updateUpdateItem, updates])

  // Funciones para roadmap
  const addNewRoadmapPhase = useCallback(() => {
    const trimmedTitle = newRoadmapTitle.trim()
    const trimmedDescription = newRoadmapDescription.trim()

    if (trimmedTitle && trimmedDescription) {
      const phaseNumber = roadmapPhases.length + 1
      addRoadmapPhase({
        id: `phase_${Date.now()}`,
        phase: `Fase ${phaseNumber}`,
        title: trimmedTitle,
        description: trimmedDescription,
        status: newRoadmapStatus,
      })
      setNewRoadmapTitle("")
      setNewRoadmapDescription("")
      setNewRoadmapStatus(RoadmapStatus.PENDING)
    }
  }, [newRoadmapTitle, newRoadmapDescription, newRoadmapStatus, roadmapPhases.length, addRoadmapPhase])

  const handleEditRoadmap = useCallback((index: number, title: string, description: string, status: RoadmapStatus) => {
    setEditingRoadmap({ index, title, description, status })
  }, [])

  const handleSaveEditedRoadmap = useCallback(() => {
    if (editingRoadmap && editingRoadmap.title && editingRoadmap.description) {
      const currentRoadmap = roadmapPhases[editingRoadmap.index]
      updateRoadmapItem(editingRoadmap.index, {
        id: currentRoadmap.id,
        phase: currentRoadmap.phase,
        title: editingRoadmap.title,
        description: editingRoadmap.description,
        status: editingRoadmap.status,
      })
      setEditingRoadmap(null)
    }
  }, [editingRoadmap, updateRoadmapItem, roadmapPhases])

  // Funciones para manejar eliminación con confirmación
  const handleDeleteUpdate = useCallback((index: number, title: string) => {
    setItemToDelete({ index, title, type: "update" })
    setDeleteUpdateModalOpen(true)
  }, [])

  const handleDeleteRoadmap = useCallback((index: number, title: string) => {
    setItemToDelete({ index, title, type: "roadmap" })
    setDeleteRoadmapModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (itemToDelete) {
      if (itemToDelete.type === "update") {
        removeUpdate(itemToDelete.index)
      } else {
        removeRoadmapPhase(itemToDelete.index)
      }
      setItemToDelete(null)
      setDeleteUpdateModalOpen(false)
      setDeleteRoadmapModalOpen(false)
    }
  }, [itemToDelete, removeUpdate, removeRoadmapPhase])

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteUpdateModalOpen(false)
    setDeleteRoadmapModalOpen(false)
    setItemToDelete(null)
  }, [])

  // Funciones de limpieza
  const clearNewUpdateTitle = useCallback(() => setNewUpdateTitle(""), [])
  const clearNewUpdateDescription = useCallback(() => setNewUpdateDescription(""), [])
  const clearNewRoadmapTitle = useCallback(() => setNewRoadmapTitle(""), [])
  const clearNewRoadmapDescription = useCallback(() => setNewRoadmapDescription(""), [])

  // Función para manejar el drag and drop de roadmap (optimizada)
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const currentPhases = watchedRoadmapPhases
        const oldIndex = currentPhases.findIndex((phase) => phase.id === active.id)
        const newIndex = currentPhases.findIndex((phase) => phase.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          // Reordenar el array directamente
          const reorderedPhases = arrayMove(currentPhases, oldIndex, newIndex)

          // Actualizar los números de fase
          const updatedPhases = reorderedPhases.map((phase, index) => ({
            ...phase,
            phase: `Fase ${index + 1}`,
          }))

          // Actualizar directamente en el formulario (más fluido)
          setValue("roadmapPhases", updatedPhases, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      }
    },
    [watchedRoadmapPhases, setValue],
  )

  // Manejo de Enter en inputs
  const handleUpdateKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault()
        addNewUpdate()
      }
    },
    [addNewUpdate],
  )

  const handleRoadmapKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault()
        addNewRoadmapPhase()
      }
    },
    [addNewRoadmapPhase],
  )

  // Estilos consistentes para accordions
  const accordionSx = {
    borderRadius: 2,
    "&:before": { display: "none" },
    border: "1px solid",
    borderColor: "divider",
    "&:not(:last-child)": {
      borderBottom: "1px solid",
      borderBottomColor: "divider",
    },
    "&.Mui-expanded": {
      margin: 0,
    },
  }

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Tu Roadmap y Actualizaciones
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Mantén a tu comunidad informada sobre el progreso y comparte tus planes a futuro
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        {/* Actualizaciones Accordion */}
        <Accordion expanded={updatesExpanded} onChange={handleUpdatesAccordion} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Update color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Actualizaciones ({updates.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Mantén informada a tu comunidad sobre los últimos avances de tu iniciativa
            </Typography>

            {/* Inputs para nueva actualización */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              <FormTextField
                register={{
                  name: "newUpdateTitle",
                  onChange: async (e) => {
                    setNewUpdateTitle(e.target.value)
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Título de la actualización"
                placeholder="Ej: Nueva funcionalidad implementada"
                value={newUpdateTitle}
                maxLength={100}
                onClear={clearNewUpdateTitle}
                onKeyPress={handleUpdateKeyPress}
                labelFontSize="1.15rem"
                legendFontSize="0.875rem"
                error={getFieldError("updates")}
              />
              <FormTextField
                register={{
                  name: "newUpdateDescription",
                  onChange: async (e) => {
                    setNewUpdateDescription(e.target.value)
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Descripción de la actualización"
                placeholder="Describe los detalles de esta actualización..."
                value={newUpdateDescription}
                maxLength={500}
                onClear={clearNewUpdateDescription}
                onKeyPress={handleUpdateKeyPress}
                labelFontSize="1.15rem"
                legendFontSize="0.875rem"
                error={getFieldError("updates")}
              />
              <Button
                variant="contained"
                onClick={addNewUpdate}
                disabled={!newUpdateTitle.trim() || !newUpdateDescription.trim()}
                sx={{
                  alignSelf: "flex-start",
                  minWidth: "150px",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.500",
                  },
                }}
                startIcon={<Add />}
              >
                Agregar actualización
              </Button>
            </Box>

            {/* Lista de actualizaciones */}
            {updates.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Actualizaciones agregadas:
                </Typography>
                <List>
                  {updates.map((update, index) => (
                    <Card key={update.id} elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
                      <ListItem sx={{ py: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: theme.palette.primary.main,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            mr: 2,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <ListItemText
                          primary={update.title}
                          secondary={update.description}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontWeight: 500,
                              fontSize: "1rem",
                            },
                          }}
                        />
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => handleEditUpdate(index, update.title, update.description)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteUpdate(index, update.title)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                    </Card>
                  ))}
                </List>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Roadmap Accordion */}
        <Accordion expanded={roadmapExpanded} onChange={handleRoadmapAccordion} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Timeline color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Roadmap ({roadmapPhases.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Define las fases de desarrollo de tu iniciativa. Las fases se numeran automáticamente.
            </Typography>

            {/* Inputs para nueva fase */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              <FormTextField
                register={{
                  name: "newRoadmapTitle",
                  onChange: async (e) => {
                    setNewRoadmapTitle(e.target.value)
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Nombre de la fase"
                placeholder="Ej: Desarrollo del MVP"
                value={newRoadmapTitle}
                maxLength={100}
                onClear={clearNewRoadmapTitle}
                onKeyPress={handleRoadmapKeyPress}
                labelFontSize="1.15rem"
                legendFontSize="0.875rem"
                error={getFieldError("roadmapPhases")}
              />
              <FormTextField
                register={{
                  name: "newRoadmapDescription",
                  onChange: async (e) => {
                    setNewRoadmapDescription(e.target.value)
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Descripción de la fase"
                placeholder="Describe qué se logrará en esta fase..."
                value={newRoadmapDescription}
                maxLength={500}
                onClear={clearNewRoadmapDescription}
                onKeyPress={handleRoadmapKeyPress}
                labelFontSize="1.15rem"
                legendFontSize="0.875rem"
                error={getFieldError("roadmapPhases")}
              />

              {/* Selector de estado */}
              <FormControl fullWidth>
                <InputLabel>Estado de la fase</InputLabel>
                <Select
                  value={newRoadmapStatus}
                  onChange={(e) => setNewRoadmapStatus(e.target.value as RoadmapStatus)}
                  label="Estado de la fase"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: option.color,
                          }}
                        />
                        {option.value}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={addNewRoadmapPhase}
                disabled={!newRoadmapTitle.trim() || !newRoadmapDescription.trim()}
                sx={{
                  alignSelf: "flex-start",
                  minWidth: "150px",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&:disabled": {
                    backgroundColor: "grey.500",
                  },
                }}
                startIcon={<Add />}
              >
                Agregar fase
              </Button>
            </Box>

            {/* Lista de fases del roadmap con drag and drop */}
            {watchedRoadmapPhases.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Fases del roadmap:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  📌 Arrastra las fases para reordenarlas
                </Typography>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={watchedRoadmapPhases.map((phase) => phase.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <List>
                      {watchedRoadmapPhases.map((phase, index) => (
                        <SortableRoadmapItem
                          key={phase.id}
                          id={phase.id}
                          index={index}
                          phase={phase}
                          statusOptions={statusOptions}
                          onEdit={handleEditRoadmap}
                          onDelete={handleDeleteRoadmap}
                          theme={theme}
                        />
                      ))}
                    </List>
                  </SortableContext>
                </DndContext>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </motion.div>

      {/* Modal para editar actualización */}
      <Dialog
        open={!!editingUpdate}
        onClose={() => setEditingUpdate(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Editar Actualización</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 0 }}>
          {editingUpdate && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormTextField
                register={{
                  name: "editUpdateTitle",
                  onChange: async (e) => {
                    setEditingUpdate({ ...editingUpdate, title: e.target.value })
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Título de la actualización"
                placeholder="Ej: Nueva funcionalidad implementada"
                value={editingUpdate.title}
                maxLength={100}
                onClear={() => setEditingUpdate({ ...editingUpdate, title: "" })}
                error={editingUpdate ? getFieldError("updates", editingUpdate.index, "title") : undefined}
              />
              <FormTextField
                register={{
                  name: "editUpdateDescription",
                  onChange: async (e) => {
                    setEditingUpdate({ ...editingUpdate, description: e.target.value })
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Descripción"
                placeholder="Describe los detalles..."
                value={editingUpdate.description}
                maxLength={500}
                onClear={() => setEditingUpdate({ ...editingUpdate, description: "" })}
                error={editingUpdate ? getFieldError("updates", editingUpdate.index, "description") : undefined}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button onClick={() => setEditingUpdate(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEditedUpdate}
            variant="contained"
            color="primary"
            disabled={!editingUpdate?.title || !editingUpdate?.description}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              "&:disabled": {
                backgroundColor: "grey.500",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar roadmap */}
      <Dialog
        open={!!editingRoadmap}
        onClose={() => setEditingRoadmap(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Editar Fase del Roadmap</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 0 }}>
          {editingRoadmap && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <FormTextField
                register={{
                  name: "editRoadmapTitle",
                  onChange: async (e) => {
                    setEditingRoadmap({ ...editingRoadmap, title: e.target.value })
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Nombre de la fase"
                placeholder="Ej: Desarrollo del MVP"
                value={editingRoadmap.title}
                maxLength={100}
                onClear={() => setEditingRoadmap({ ...editingRoadmap, title: "" })}
                error={editingRoadmap ? getFieldError("roadmapPhases", editingRoadmap.index, "title") : undefined}
              />
              <FormTextField
                register={{
                  name: "editRoadmapDescription",
                  onChange: async (e) => {
                    setEditingRoadmap({ ...editingRoadmap, description: e.target.value })
                    return true
                  },
                  onBlur: async () => {
                    return true
                  },
                  ref: () => {},
                }}
                label="Descripción"
                placeholder="Describe qué se logrará..."
                value={editingRoadmap.description}
                maxLength={500}
                onClear={() => setEditingRoadmap({ ...editingRoadmap, description: "" })}
                error={editingRoadmap ? getFieldError("roadmapPhases", editingRoadmap.index, "description") : undefined}
              />

              <FormControl fullWidth>
                <InputLabel>Estado de la fase</InputLabel>
                <Select
                  value={editingRoadmap.status}
                  onChange={(e) =>
                    setEditingRoadmap({
                      ...editingRoadmap,
                      status: e.target.value as RoadmapStatus,
                    })
                  }
                  label="Estado de la fase"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: option.color,
                          }}
                        />
                        {option.value}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button onClick={() => setEditingRoadmap(null)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEditedRoadmap}
            variant="contained"
            color="primary"
            disabled={!editingRoadmap?.title || !editingRoadmap?.description}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              "&:disabled": {
                backgroundColor: "grey.500",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para eliminar actualización */}
      <ConfirmationModal
        open={deleteUpdateModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        variant="delete"
        context="update"
        details={{ name: itemToDelete?.title }}
      />

      {/* Modal de confirmación para eliminar fase del roadmap */}
      <ConfirmationModal
        open={deleteRoadmapModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        variant="delete"
        context="roadmap"
        details={{ name: itemToDelete?.title }}
      />
    </Box>
  )
}

export default Step5Component
