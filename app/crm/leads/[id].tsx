"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomField } from "@/components/ui/custom-layout-builder"

const mockLead = {
  id: 1,
  name: "John Doe",
  company: "Acme Corp",
  status: "New",
  stage: "Lead",
  owner: "Alice",
  email: "john@acme.com",
  phone: "9876543210",
  notes: [
    { id: 1, type: "note", text: "Initial call made.", date: "2024-06-01" },
    { id: 2, type: "note", text: "Sent product brochure.", date: "2024-06-03" },
  ],
  attachments: [
    { id: 1, type: "attachment", filename: "brochure.pdf", date: "2024-06-03" },
  ],
  custom: {} as Record<string, any>,
}

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("leads_custom_fields")
      setCustomFields(saved ? JSON.parse(saved) : [])
    }
  }, [])
  const [lead, setLead] = useState({ ...mockLead, custom: mockLead.custom || ({} as Record<string, any>) })
  const [editing, setEditing] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [note, setNote] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setLead({
      ...lead,
      notes: [
        ...lead.notes,
        { id: Date.now(), type: "note", text: note, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    setNote("")
  }

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLead({
      ...lead,
      attachments: [
        ...lead.attachments,
        { id: Date.now(), type: "attachment", filename: file.name, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLead({ ...lead, custom: { ...lead.custom, [e.target.name]: e.target.value } })
  }

  // Merge notes and attachments for timeline
  const timeline = [...lead.notes, ...lead.attachments].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (deleted) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead Deleted</h1>
        <Button onClick={() => router.push('/crm/leads')}>Back to Leads</Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Lead Details
            <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleted(true)}>Delete</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="input input-bordered w-full" value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input className="input input-bordered w-full" value={lead.company} onChange={e => setLead({ ...lead, company: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input className="input input-bordered w-full" value={lead.status} onChange={e => setLead({ ...lead, status: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stage</label>
                <input className="input input-bordered w-full" value={lead.stage} onChange={e => setLead({ ...lead, stage: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input className="input input-bordered w-full" value={lead.owner} onChange={e => setLead({ ...lead, owner: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="input input-bordered w-full" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="input input-bordered w-full" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} />
              </div>
              {/* Render custom fields */}
              {customFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {field.type === "text" && (
                    <input
                      name={field.id}
                      value={(lead.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      name={field.id}
                      value={(lead.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "date" && (
                    <input
                      type="date"
                      name={field.id}
                      value={(lead.custom as Record<string, any>)[field.id] || ""}
                      onChange={handleCustomChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      name={field.id}
                      value={(lead.custom as Record<string, any>)[field.id] || ""}
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
              <div><span className="font-medium">Name:</span> {lead.name}</div>
              <div><span className="font-medium">Company:</span> {lead.company}</div>
              <div><span className="font-medium">Status:</span> {lead.status}</div>
              <div><span className="font-medium">Stage:</span> {lead.stage}</div>
              <div><span className="font-medium">Owner:</span> {lead.owner}</div>
              <div><span className="font-medium">Email:</span> {lead.email}</div>
              <div><span className="font-medium">Phone:</span> {lead.phone}</div>
              {/* Show custom fields */}
              {customFields.map(field => (
                <div key={field.id}><span className="font-medium">{field.label}:</span> {(lead.custom as Record<string, any>)[field.id] || ""}</div>
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