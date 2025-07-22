"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { CustomLayoutBuilder, CustomField } from "@/components/ui/custom-layout-builder"

const mockLeads = [
  { id: 1, name: "John Doe", company: "Acme Corp", status: "New", stage: "Lead", owner: "Alice", custom: {} as Record<string, any> },
  { id: 2, name: "Jane Smith", company: "Beta Ltd", status: "Contacted", stage: "Qualified", owner: "Bob", custom: {} as Record<string, any> },
  { id: 3, name: "Sam Patel", company: "Gamma Inc", status: "Lost", stage: "Lost", owner: "Alice", custom: {} as Record<string, any> },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ name: "", company: "", status: "New", stage: "Lead", owner: "", custom: {} as Record<string, any> })
  const [editForm, setEditForm] = useState({ id: 0, name: "", company: "", status: "", stage: "", owner: "", custom: {} as Record<string, any> })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("leads_custom_fields")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (customFields.some(f => f.id === e.target.name)) {
      setForm({ ...form, custom: { ...form.custom, [e.target.name]: e.target.value } })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (customFields.some(f => f.id === e.target.name)) {
      setEditForm({ ...editForm, custom: { ...editForm.custom, [e.target.name]: e.target.value } })
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLeads([
      ...leads,
      { id: leads.length ? Math.max(...leads.map(l => l.id)) + 1 : 1, ...form },
    ])
    setForm({ name: "", company: "", status: "New", stage: "Lead", owner: "", custom: {} })
    setOpen(false)
  }

  const handleEdit = (lead: typeof editForm) => {
    setEditForm({ ...lead, custom: lead.custom || {} })
    setEditOpen(true)
  }
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLeads(leads.map(l => l.id === editForm.id ? { ...editForm } : l))
    setEditOpen(false)
  }
  const handleDelete = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }
  const confirmDelete = () => {
    setLeads(leads.filter(l => l.id !== deleteId))
    setDeleteOpen(false)
    setDeleteId(null)
  }

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields)
    localStorage.setItem("leads_custom_fields", JSON.stringify(fields))
  }

  // Compute filtered leads
  const filteredLeads = leads.filter((l) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(searchLower) ||
      l.company.toLowerCase().includes(searchLower) ||
      l.status.toLowerCase().includes(searchLower) ||
      l.stage.toLowerCase().includes(searchLower) ||
      l.owner.toLowerCase().includes(searchLower) ||
      Object.values(l.custom || {}).some((v) => String(v).toLowerCase().includes(searchLower));
    const matchesOwner = ownerFilter ? l.owner === ownerFilter : true;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <select
            value={ownerFilter}
            onChange={e => setOwnerFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All Owners</option>
            {[...new Set(leads.map(l => l.owner))].map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
          <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCustomizeOpen(true)}>Customize Fields</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Customize Lead Fields</DialogTitle>
              </DialogHeader>
              <CustomLayoutBuilder fields={customFields} onChange={handleCustomFieldsChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <Input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
                <Input name="status" placeholder="Status" value={form.status} onChange={handleChange} required />
                <Input name="stage" placeholder="Stage" value={form.stage} onChange={handleChange} required />
                <Input name="owner" placeholder="Owner" value={form.owner} onChange={handleChange} required />
                {/* Render custom fields */}
                {customFields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === "text" && (
                      <input
                        name={field.id}
                        value={form.custom[field.id] || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    )}
                    {field.type === "number" && (
                      <input
                        type="number"
                        name={field.id}
                        value={form.custom[field.id] || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    )}
                    {field.type === "date" && (
                      <input
                        type="date"
                        name={field.id}
                        value={form.custom[field.id] || ""}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    )}
                    {field.type === "select" && (
                      <select
                        name={field.id}
                        value={form.custom[field.id] || ""}
                        onChange={handleChange}
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
                <DialogFooter>
                  <Button type="submit">Add Lead</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} required />
              <Input name="company" placeholder="Company" value={editForm.company} onChange={handleEditChange} required />
              <Input name="status" placeholder="Status" value={editForm.status} onChange={handleEditChange} required />
              <Input name="stage" placeholder="Stage" value={editForm.stage} onChange={handleEditChange} required />
              <Input name="owner" placeholder="Owner" value={editForm.owner} onChange={handleEditChange} required />
              {/* Render custom fields for edit */}
              {customFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "text" && (
                    <input
                      name={field.id}
                      value={editForm.custom[field.id] || ""}
                      onChange={handleEditChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      name={field.id}
                      value={editForm.custom[field.id] || ""}
                      onChange={handleEditChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "date" && (
                    <input
                      type="date"
                      name={field.id}
                      value={editForm.custom[field.id] || ""}
                      onChange={handleEditChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      name={field.id}
                      value={editForm.custom[field.id] || ""}
                      onChange={handleEditChange}
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
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Lead</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this lead?</div>
            <DialogFooter>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  {/* Custom fields headers */}
                  {customFields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{field.label}</th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.company}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.stage}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.owner}</td>
                    {/* Custom fields values */}
                    {customFields.map(field => (
                      <td key={field.id} className="px-4 py-2 whitespace-nowrap">{(lead.custom && lead.custom[field.id]) || ""}</td>
                    ))}
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit({ ...lead, custom: lead.custom || {} })}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(lead.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 