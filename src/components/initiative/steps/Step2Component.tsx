import React, { useState, useCallback, useMemo, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Add, Delete, ExpandMore, Edit } from "@mui/icons-material"
import { motion } from "motion/react"
import { useFormContext, useFieldArray } from "react-hook-form"
import type { InitiativeFormData } from "@/schemas/initiativeSchema"
// import { useAuthContext } from "@/hooks/useAuthContext"
import { useInitiativeForm } from "@/context/InitiativeFormContext"

import { FormTextField } from "./shared/FormTextField"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

const predefinedTags = [
  "Tecnología",
  "Sostenibilidad",
  "Educación",
  "Salud",
  "Fintech",
  "E-commerce",
  "IA",
  "Blockchain",
  "IoT",
  "Realidad Virtual",
  "Medio Ambiente",
  "Social",
  "Innovación",
  "Startups",
  "Emprendimiento",
]

const Step2Component: React.FC = React.memo(() => {
  const theme = useTheme()
  const {
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<InitiativeFormData>()

  // const { userFromApi } = useAuthContext()
  const { isEditMode, initiativeData } = useInitiativeForm()

  // const isUserAdmin = useMemo(() => userFromApi?.roles?.includes("ADMIN"), [userFromApi?.roles])

  const isDisabled = useMemo(() => {
    if (!isEditMode || !initiativeData?.state) return false
    // if (isUserAdmin) return false

    const lockedStatus = ["approved"]
    return lockedStatus.includes(initiativeData.state)
  }, [isEditMode, initiativeData?.state])

  const [customTag, setCustomTag] = useState("")
  const [newObjective, setNewObjective] = useState("")
  const [editingObjective, setEditingObjective] = useState<{ index: number; description: string } | null>(null)
  const [objectivesExpanded, setObjectivesExpanded] = useState(true)
  const [tagsExpanded, setTagsExpanded] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [objectiveToDelete, setObjectiveToDelete] = useState<{ index: number; description: string } | null>(null)

  const {
    fields: objectives,
    append: addObjective,
    remove: removeObjective,
    update: updateObjective,
  } = useFieldArray({
    control,
    name: "objectives",
  })

  // OPTIMIZACIÓN: Estados locales con debounce para campos grandes
  const tags = watch("tags")

  // Estados locales para campos grandes (evitar re-renders por cada carácter)
  const [localDetailedDescription, setLocalDetailedDescription] = useState("")
  const [localProblemSolved, setLocalProblemSolved] = useState("")
  const [localMarketInfo, setLocalMarketInfo] = useState("")
  const [localProductCharacteristics, setLocalProductCharacteristics] = useState("")

  // Referencias para debounce
  const debounceRefs = useRef({
    detailedDescription: null as NodeJS.Timeout | null,
    problemSolved: null as NodeJS.Timeout | null,
    marketInfo: null as NodeJS.Timeout | null,
    productCharacteristics: null as NodeJS.Timeout | null,
  })

  // Inicializar estados locales con valores del form
  const formDetailedDescription = watch("detailedDescription")
  const formProblemSolved = watch("problemSolved")
  const formMarketInfo = watch("marketInfo")
  const formProductCharacteristics = watch("productCharacteristics")

  useEffect(() => {
    if (formDetailedDescription !== undefined && localDetailedDescription === "") {
      setLocalDetailedDescription(formDetailedDescription || "")
    }
  }, [formDetailedDescription, localDetailedDescription])

  useEffect(() => {
    if (formProblemSolved !== undefined && localProblemSolved === "") {
      setLocalProblemSolved(formProblemSolved || "")
    }
  }, [formProblemSolved, localProblemSolved])

  useEffect(() => {
    if (formMarketInfo !== undefined && localMarketInfo === "") {
      setLocalMarketInfo(formMarketInfo || "")
    }
  }, [formMarketInfo, localMarketInfo])

  useEffect(() => {
    if (formProductCharacteristics !== undefined && localProductCharacteristics === "") {
      setLocalProductCharacteristics(formProductCharacteristics || "")
    }
  }, [formProductCharacteristics, localProductCharacteristics])

  // Función de debounce mejorada para sincronizar con el form
  const debouncedSync = useCallback(
    (fieldName: string, value: string, isDeleting = false) => {
      const timeoutId = debounceRefs.current[fieldName as keyof typeof debounceRefs.current]
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      if (isDeleting) {
        // Borrado: sincronización inmediata sin debounce
        setValue(fieldName as keyof InitiativeFormData, value)
      } else {
        // Escribiendo: usar debounce normal
        debounceRefs.current[fieldName as keyof typeof debounceRefs.current] = setTimeout(() => {
          setValue(fieldName as keyof InitiativeFormData, value)
        }, 200)
      }
    },
    [setValue],
  )

  // Memoizar las funciones para evitar re-renders
  const handleTagClick = useCallback(
    (tag: string) => {
      if (isDisabled) return
      const currentTags = (tags as string[]) || []
      if (currentTags.includes(tag)) {
        setValue(
          "tags",
          currentTags.filter((t) => t !== tag),
        )
      } else if (currentTags.length < 9) {
        setValue("tags", [...currentTags, tag])
      }
    },
    [tags, setValue, isDisabled],
  )

  // Función para añadir etiqueta personalizada
  const addCustomTag = useCallback(() => {
    if (isDisabled) return
    const trimmedTag = customTag.trim().charAt(0).toUpperCase() + customTag.trim().slice(1).toLowerCase()
    const currentTags = (tags as string[]) || []

    if (
      trimmedTag &&
      !currentTags.includes(trimmedTag) &&
      !predefinedTags.some((tag) => tag.toLowerCase() === trimmedTag.toLowerCase()) &&
      currentTags.length < 9
    ) {
      setValue("tags", [...currentTags, trimmedTag])
      setCustomTag("") // Limpiar input inmediatamente después de agregar
    }
  }, [customTag, tags, setValue, isDisabled])

  // Manejar Enter en el input de etiqueta personalizada
  const handleCustomTagKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addCustomTag()
      }
    },
    [addCustomTag],
  )

  // Función para añadir objetivo
  const addNewObjective = useCallback(() => {
    if (isDisabled) return
    const trimmedObjective = newObjective.trim()

    if (trimmedObjective) {
      addObjective({
        id: `obj_${Date.now()}`,
        description: trimmedObjective,
      })
      setNewObjective("") // Limpiar input inmediatamente después de agregar
    }
  }, [newObjective, addObjective, isDisabled])

  // Manejar Enter en el input de objetivo
  const handleObjectiveKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addNewObjective()
      }
    },
    [addNewObjective],
  )

  // Función para editar objetivo
  const handleEditObjective = useCallback(
    (index: number, description: string) => {
      if (isDisabled) return
      setEditingObjective({ index, description })
    },
    [isDisabled],
  )

  // Función para guardar objetivo editado
  const handleSaveEditedObjective = useCallback(() => {
    if (editingObjective && editingObjective.description.trim()) {
      // Conservar el ID original para evitar reordenamiento
      const currentObjective = objectives[editingObjective.index]
      updateObjective(editingObjective.index, {
        id: currentObjective.id, // Mantener el mismo ID
        description: editingObjective.description.trim(),
      })
      setEditingObjective(null)
    }
  }, [editingObjective, updateObjective, objectives])

  // Función para cancelar edición
  const handleCancelEdit = useCallback(() => {
    setEditingObjective(null)
  }, [])

  // Función para abrir modal de confirmación de eliminación
  const handleDeleteObjective = useCallback(
    (index: number, description: string) => {
      if (isDisabled) return
      setObjectiveToDelete({ index, description })
      setDeleteModalOpen(true)
    },
    [isDisabled],
  )

  // Función para confirmar eliminación de objetivo
  const handleConfirmDeleteObjective = useCallback(() => {
    if (objectiveToDelete) {
      removeObjective(objectiveToDelete.index)
      setObjectiveToDelete(null)
      setDeleteModalOpen(false)
    }
  }, [objectiveToDelete, removeObjective])

  // Función para cerrar modal de eliminación
  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false)
    setObjectiveToDelete(null)
  }, [])

  // Función para manejar accordion de objetivos
  const handleObjectivesAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setObjectivesExpanded(isExpanded)
  }, [])

  // Función para manejar accordion de etiquetas
  const handleTagsAccordion = useCallback((_: React.SyntheticEvent, isExpanded: boolean) => {
    setTagsExpanded(isExpanded)
  }, [])

  // Funciones de limpieza memoizadas
  const clearCustomTag = useCallback(() => setCustomTag(""), [])
  const clearNewObjective = useCallback(() => setNewObjective(""), [])

  const tagValues = useMemo(
    () => ({
      tags: (tags as string[]) || [],
    }),
    [tags],
  )

  // Lista combinada de etiquetas para mostrar
  const allTags = useMemo(() => {
    const currentTags = tagValues.tags
    const combinedTags = [...predefinedTags]

    // Agregar etiquetas personalizadas que no están en predefinidas
    currentTags.forEach((tag) => {
      if (!predefinedTags.some((predefined) => predefined.toLowerCase() === tag.toLowerCase())) {
        combinedTags.push(tag)
      }
    })

    return combinedTags
  }, [tagValues.tags])

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            Profundizando en tu Visión
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Describe el problema que resuelves, tu solución y los objetivos iniciales de tu iniciativa
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        {/* Etiquetas */}
        <Accordion
          expanded={tagsExpanded}
          onChange={handleTagsAccordion}
          sx={{ borderRadius: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Selecciona etiquetas que tengan relación con tu iniciativa ({tagValues.tags.length}/9)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {allTags.map((tag) => (
                <motion.div key={tag} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Chip
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    onDelete={tagValues.tags.includes(tag) ? () => handleTagClick(tag) : undefined}
                    color={tagValues.tags.includes(tag) ? "primary" : "default"}
                    variant={tagValues.tags.includes(tag) ? "filled" : "outlined"}
                    disabled={isDisabled}
                    sx={{
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": isDisabled
                        ? {}
                        : {
                            transform: "translateY(-1px)",
                            boxShadow: theme.shadows[2],
                          },
                      "& .MuiChip-deleteIcon": {
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      },
                      "&:hover .MuiChip-deleteIcon": {
                        opacity: 1,
                      },
                      ...(isDisabled && {
                        pointerEvents: "none",
                        opacity: 0.5,
                      }),
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {/* Input para etiquetas personalizadas */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2, color: "text.primary" }}>
                ¿No encuentras la etiqueta que buscas?
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <FormTextField
                    register={{
                      name: "customTag",
                      onChange: async (e) => {
                        setCustomTag(e.target.value)
                        return true
                      },
                      onBlur: async () => {
                        return true
                      },
                      ref: () => {},
                    }}
                    label="Etiqueta personalizada"
                    placeholder="Ej: Machine Learning, DevOps, etc."
                    value={customTag}
                    maxLength={50}
                    onClear={clearCustomTag}
                    onKeyPress={handleCustomTagKeyPress}
                    legendFontSize="0.875rem"
                    labelFontSize="1.15rem"
                    disabled={isDisabled || tagValues.tags.length >= 9}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={addCustomTag}
                  disabled={isDisabled || !customTag.trim() || tagValues.tags.length >= 9}
                  sx={{
                    minWidth: "120px",
                    height: "56px",
                    backgroundColor: theme.palette.success.main,
                    "&:hover": {
                      backgroundColor: theme.palette.success.dark,
                    },
                    "&:disabled": {
                      backgroundColor: theme.palette.grey[300],
                    },
                  }}
                  startIcon={<Add />}
                >
                  Agregar
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Mensaje de error para tags */}
        {errors.tags && (
          <Typography variant="caption" color="error" sx={{ mt: -4, mb: 2, display: "block", pl: 2 }}>
            {errors.tags.message}
          </Typography>
        )}

        {/* Descripción Detallada - Con Debounce */}
        <FormTextField
          register={{
            name: "detailedDescription",
            onChange: async (e) => {
              const value = e.target.value
              const isDeleting = value.length < localDetailedDescription.length
              setLocalDetailedDescription(value)
              debouncedSync("detailedDescription", value, isDeleting)
              return true
            },
            onBlur: async () => true,
            ref: () => {},
          }}
          label="Descripción Detallada de la Iniciativa"
          placeholder="Explica la visión completa de tu iniciativa."
          value={localDetailedDescription}
          error={errors.detailedDescription}
          multiline={true}
          minRows={6}
          maxRows={12}
          labelFontSize="1.45rem"
          legendFontSize="1.1rem"
          disabled={isDisabled}
        />

        {/* Problema que se resuelve - Con Debounce */}
        <FormTextField
          register={{
            name: "problemSolved",
            onChange: async (e) => {
              const value = e.target.value
              const isDeleting = value.length < localProblemSolved.length
              setLocalProblemSolved(value)
              debouncedSync("problemSolved", value, isDeleting)
              return true
            },
            onBlur: async () => true,
            ref: () => {},
          }}
          label="Problema que se resuelve"
          placeholder="Describe el problema y por qué es importante solucionarlo."
          value={localProblemSolved}
          error={errors.problemSolved}
          multiline={true}
          minRows={4}
          maxRows={10}
          labelFontSize="1.45rem"
          legendFontSize="1.1rem"
          disabled={isDisabled}
        />

        {/* Información del Mercado - Con Debounce */}
        <FormTextField
          register={{
            name: "marketInfo",
            onChange: async (e) => {
              const value = e.target.value
              const isDeleting = value.length < localMarketInfo.length
              setLocalMarketInfo(value)
              debouncedSync("marketInfo", value, isDeleting)
              return true
            },
            onBlur: async () => true,
            ref: () => {},
          }}
          label="Información del mercado"
          placeholder="¿Cual es la oportunidad en el mercado de tu iniciativa?"
          value={localMarketInfo}
          error={errors.marketInfo}
          multiline={true}
          minRows={4}
          maxRows={10}
          labelFontSize="1.45rem"
          legendFontSize="1.1rem"
          disabled={isDisabled}
        />

        {/* Características del Producto/Servicio - Con Debounce */}
        <FormTextField
          register={{
            name: "productCharacteristics",
            onChange: async (e) => {
              const value = e.target.value
              const isDeleting = value.length < localProductCharacteristics.length
              setLocalProductCharacteristics(value)
              debouncedSync("productCharacteristics", value, isDeleting)
              return true
            },
            onBlur: async () => true,
            ref: () => {},
          }}
          label="Características del producto/servicio"
          placeholder="¿Cual es la oportunidad en el mercado de tu iniciativa?"
          value={localProductCharacteristics}
          error={errors.productCharacteristics}
          multiline={true}
          minRows={4}
          maxRows={10}
          labelFontSize="1.45rem"
          legendFontSize="1.1rem"
          disabled={isDisabled}
        />

        {/* Objetivos Iniciales */}
        <Accordion
          expanded={objectivesExpanded}
          onChange={handleObjectivesAccordion}
          sx={{ borderRadius: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography fontWeight="600" fontSize="1.1rem" color="text.primary">
                Objetivos iniciales
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Escribe tus objetivos, recuerda que sean claros, medibles y alcanzables
            </Typography>

            {/* Input para agregar objetivo */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  register={{
                    name: "newObjective",
                    onChange: async (e) => {
                      setNewObjective(e.target.value)
                      return true
                    },
                    onBlur: async () => {
                      return true
                    },
                    ref: () => {},
                  }}
                  label="Escribir Objetivo"
                  placeholder="Ej: Incrementar el tráfico web en un 20% a través de SEO y canales pagados"
                  value={newObjective}
                  maxLength={200}
                  onClear={clearNewObjective}
                  onKeyPress={handleObjectiveKeyPress}
                  labelFontSize="1.15rem"
                  legendFontSize="0.875rem"
                  disabled={isDisabled}
                />
              </Box>
              <Button
                variant="contained"
                onClick={addNewObjective}
                disabled={isDisabled || !newObjective.trim()}
                sx={{
                  minWidth: "120px",
                  height: "56px",
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  "&:disabled": {
                    backgroundColor: theme.palette.grey[300],
                  },
                }}
                startIcon={<Add />}
              >
                Añadir
              </Button>
            </Box>

            {/* Lista de objetivos */}
            {objectives.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Objetivos agregados ({objectives.length}):
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {objectives.map((objective, index) => (
                    <Card
                      key={objective.id}
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {/* Número del objetivo - Mejorado */}
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              flexShrink: 0,
                              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                            }}
                          >
                            {index + 1}
                          </Box>

                          {/* Contenido del objetivo */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                fontSize: "1rem",
                                lineHeight: 1.5,
                                color: "text.primary",
                                mb: 1,
                              }}
                            >
                              {objective.description}
                            </Typography>
                          </Box>

                          {/* Botones de acción - Mejorados */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexShrink: 0,
                              ml: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => handleEditObjective(index, objective.description)}
                              color="primary"
                              size="small"
                              disabled={isDisabled}
                              sx={{
                                backgroundColor: "rgba(25, 118, 210, 0.1)",
                                "&:hover": {
                                  backgroundColor: "rgba(25, 118, 210, 0.2)",
                                },
                                "&:disabled": {
                                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteObjective(index, objective.description)}
                              color="error"
                              size="small"
                              disabled={isDisabled}
                              sx={{
                                backgroundColor: "rgba(211, 47, 47, 0.1)",
                                "&:hover": {
                                  backgroundColor: "rgba(211, 47, 47, 0.2)",
                                },
                                "&:disabled": {
                                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      </motion.div>
      {/* Mensaje de error para objectives */}
      {errors.objectives && (
        <Typography variant="caption" color="error" sx={{ mb: 2, display: "block", pl: 2 }}>
          {errors.objectives.message}
        </Typography>
      )}

      {/* Modal para editar objetivo */}
      <Dialog
        open={!!editingObjective}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Editar Objetivo</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Modifica la descripción de tu objetivo. Asegúrate de que sea claro, medible y alcanzable.
          </Typography>
          {editingObjective && (
            <FormTextField
              register={{
                name: "editObjective",
                onChange: async (e) => {
                  setEditingObjective({ ...editingObjective, description: e.target.value })
                  return true
                },
                onBlur: async () => {
                  return true
                },
                ref: () => {},
              }}
              label="Descripción del objetivo"
              placeholder="Ej: Incrementar las ventas en un 25% durante los próximos 6 meses"
              value={editingObjective.description}
              maxLength={200}
              onClear={() => setEditingObjective({ ...editingObjective, description: "" })}
              // multiline={true}
              // rows={3}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 2 }}>
          <Button onClick={handleCancelEdit} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEditedObjective}
            variant="contained"
            color={!editingObjective?.description.trim() ? "inherit" : "primary"}
            disabled={!editingObjective?.description.trim()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para eliminar objetivo */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteObjective}
        variant="delete"
        context="objective"
        details={{ name: objectiveToDelete?.description }}
      />
    </Box>
  )
})

Step2Component.displayName = "Step2Component"

export default Step2Component
