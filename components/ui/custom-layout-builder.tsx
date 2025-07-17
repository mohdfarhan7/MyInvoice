import React, { useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "./button"
import { Card } from "./card"
import { Input } from "./input"
import { Select } from "./select"
import { Trash2, GripVertical, Edit } from "lucide-react"

// Supported field types
const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Select", value: "select" },
]

export type CustomField = {
  id: string
  label: string
  type: string
  options?: string[] // for select fields
}

interface CustomLayoutBuilderProps {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
}

function SortableField({ field, index, onEdit, onRemove, listeners, attributes }: any) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f3f4f6" : undefined,
  }
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 border rounded mb-2 bg-white">
      <span {...listeners} {...attributes} className="cursor-grab text-gray-400"><GripVertical /></span>
      <span className="flex-1 font-medium">{field.label} <span className="text-xs text-gray-500">({field.type})</span></span>
      <Button size="icon" variant="ghost" onClick={() => onEdit(field)}><Edit className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => onRemove(field.id)}><Trash2 className="w-4 h-4" /></Button>
    </div>
  )
}

export function CustomLayoutBuilder({ fields, onChange }: CustomLayoutBuilderProps) {
  const [editing, setEditing] = useState<CustomField | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newField, setNewField] = useState<CustomField>({ id: "", label: "", type: "text" })
  const [optionInput, setOptionInput] = useState("")

  // Drag and drop handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id)
      const newIndex = fields.findIndex(f => f.id === over.id)
      onChange(arrayMove(fields, oldIndex, newIndex))
    }
  }

  // Add/edit field logic
  const handleSaveField = () => {
    if (!newField.label.trim()) return
    if (editing) {
      onChange(fields.map(f => (f.id === editing.id ? { ...newField, id: editing.id } : f)))
    } else {
      onChange([
        ...fields,
        { ...newField, id: Date.now().toString() },
      ])
    }
    setShowAdd(false)
    setEditing(null)
    setNewField({ id: "", label: "", type: "text" })
    setOptionInput("")
  }

  const handleEdit = (field: CustomField) => {
    setEditing(field)
    setShowAdd(true)
    setNewField(field)
    setOptionInput("")
  }

  const handleRemove = (id: string) => {
    onChange(fields.filter(f => f.id !== id))
  }

  // Add option for select field
  const addOption = () => {
    if (!optionInput.trim()) return
    setNewField({
      ...newField,
      options: [...(newField.options || []), optionInput.trim()],
    })
    setOptionInput("")
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Custom Fields</h2>
        <Button onClick={() => { setShowAdd(true); setEditing(null); setNewField({ id: "", label: "", type: "text" }) }}>Add Field</Button>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, idx) => (
            <SortableField
              key={field.id}
              field={field}
              index={idx}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      {showAdd && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Label</label>
            <Input value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} required />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={newField.type}
              onChange={e => setNewField({ ...newField, type: e.target.value, options: e.target.value === "select" ? [] : undefined })}
            >
              {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
            </select>
          </div>
          {newField.type === "select" && (
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Options</label>
              <div className="flex gap-2 mb-1">
                <Input value={optionInput} onChange={e => setOptionInput(e.target.value)} placeholder="Add option" />
                <Button type="button" onClick={addOption}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(newField.options || []).map((opt, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 rounded text-xs">{opt}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveField}>{editing ? "Save" : "Add"}</Button>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditing(null); }}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  )
} 