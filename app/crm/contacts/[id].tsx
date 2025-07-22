"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"
import { CustomField } from "@/components/ui/custom-layout-builder"

const mockContact = {
  id: 1,
  name: "John Doe",
  email: "john@acme.com",
  phone: "9876543210",
  company: "Acme Corp",
  owner: "Alice",
  notes: [
    { id: 1, type: "note", text: "Intro email sent.", date: "2024-06-01" },
    { id: 2, type: "note", text: "Scheduled meeting.", date: "2024-06-03" },
  ],
  attachments: [
    { id: 1, type: "attachment", filename: "contract.pdf", date: "2024-06-04" },
  ],
  custom: {} as Record<string, any>,
}

export default function ContactDetailPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("contacts_custom_fields")
      setCustomFields(saved ? JSON.parse(saved) : [])
    }
  }, [])
  const [contact, setContact] = useState({ ...mockContact, custom: mockContact.custom || ({} as Record<string, any>) })
  const [editing, setEditing] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [note, setNote] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setContact({
      ...contact,
      notes: [
        ...contact.notes,
        { id: Date.now(), type: "note", text: note, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    setNote("")
  }

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setContact({
      ...contact,
      attachments: [
        ...contact.attachments,
        { id: Date.now(), type: "attachment", filename: file.name, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setContact({ ...contact, custom: { ...contact.custom, [e.target.name]: e.target.value } })
  }

  // Merge notes and attachments for timeline
  const timeline = [...contact.notes, ...contact.attachments].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (deleted) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Deleted</h1>
        <Button onClick={() => router.push('/crm/contacts')}>Back to Contacts</Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Contact Details
            <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleted(true)}>Delete</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="input input-bordered w-full" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="input input-bordered w-full" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="input input-bordered w-full" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input className="input input-bordered w-full" value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input className="input input-bordered w-full" value={contact.owner} onChange={e => setContact({ ...contact, owner: e.target.value })} />
              </div>
              {/* Render custom fields */}
              {customFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {field.type === "text" && (
                    <input
                      name={field.id}
                      value={(contact.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      name={field.id}
                      value={(contact.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "date" && (
                    <input
                      type="date"
                      name={field.id}
                      value={(contact.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      name={field.id}
                      value={(contact.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="">Select...</option>
                      {(field.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => setEditing(false)}>Save</Button>
            </form>
          ) : (
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {contact.name}</div>
              <div><span className="font-medium">Email:</span> {contact.email}</div>
              <div><span className="font-medium">Phone:</span> {contact.phone}</div>
              <div><span className="font-medium">Company:</span> {contact.company}</div>
              <div><span className="font-medium">Owner:</span> {contact.owner}</div>
              {/* Show custom fields */}
              {customFields.map(field => (
                <div key={field.id}><span className="font-medium">{field.label}:</span> {(contact.custom as Record<string, any>)[field.id] || ""}</div>
              ))}
            </div>
          )}

          {/* Notes Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Add Note</h2>
            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
              <input
                className="input input-bordered flex-1"
                placeholder="Type a note..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <Button type="submit">Add</Button>
            </form>
          </div>

          {/* Attachments Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Add Attachment</h2>
            <input ref={fileInputRef} type="file" onChange={handleAddAttachment} />
          </div>

          {/* Timeline Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Timeline</h2>
            <ul className="space-y-2">
              {timeline.map((item: any) => (
                <li key={item.id} className="bg-gray-50 rounded p-3 text-sm flex justify-between items-center">
                  {item.type === "note" ? (
                    <span>📝 {item.text}</span>
                  ) : (
                    <span>📎 {item.filename}</span>
                  )}
                  <span className="text-gray-400 text-xs">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 