"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CustomLayoutBuilder, CustomField } from "@/components/ui/custom-layout-builder"

const mockContacts = [
  { id: 1, name: "John Doe", email: "john@acme.com", phone: "9876543210", company: "Acme Corp", owner: "Alice", custom: {} as Record<string, any> },
  { id: 2, name: "Jane Smith", email: "jane@beta.com", phone: "9123456780", company: "Beta Ltd", owner: "Bob", custom: {} as Record<string, any> },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", owner: "", custom: {} as Record<string, any> })
  const [editForm, setEditForm] = useState({ id: 0, name: "", email: "", phone: "", company: "", owner: "", custom: {} as Record<string, any> })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("contacts_custom_fields")
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
    setContacts([
      ...contacts,
      { id: contacts.length ? Math.max(...contacts.map(c => c.id)) + 1 : 1, ...form },
    ])
    setForm({ name: "", email: "", phone: "", company: "", owner: "", custom: {} })
    setOpen(false)
  }

  const handleEdit = (contact: typeof editForm) => {
    setEditForm({ ...contact, custom: contact.custom || {} })
    setEditOpen(true)
  }
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContacts(contacts.map(c => c.id === editForm.id ? { ...editForm } : c))
    setEditOpen(false)
  }
  const handleDelete = (id: number) => {
    setDeleteId(id)
    setDeleteOpen(true)
  }
  const confirmDelete = () => {
    setContacts(contacts.filter(c => c.id !== deleteId))
    setDeleteOpen(false)
    setDeleteId(null)
  }

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields)
    localStorage.setItem("contacts_custom_fields", JSON.stringify(fields))
  }

  // Compute filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone.toLowerCase().includes(searchLower) ||
      c.company.toLowerCase().includes(searchLower) ||
      c.owner.toLowerCase().includes(searchLower) ||
      Object.values(c.custom || {}).some((v) => String(v).toLowerCase().includes(searchLower));
    const matchesOwner = ownerFilter ? c.owner === ownerFilter : true;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search contacts..."
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
            {[...new Set(contacts.map(c => c.owner))].map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
          <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCustomizeOpen(true)}>Customize Fields</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Customize Contact Fields</DialogTitle>
              </DialogHeader>
              <CustomLayoutBuilder fields={customFields} onChange={handleCustomFieldsChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <Input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
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
                  <Button type="submit">Add Contact</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} required />
              <Input name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} required />
              <Input name="phone" placeholder="Phone" value={editForm.phone} onChange={handleEditChange} required />
              <Input name="company" placeholder="Company" value={editForm.company} onChange={handleEditChange} required />
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
              <DialogTitle>Delete Contact</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this contact?</div>
            <DialogFooter>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  {/* Custom fields headers */}
                  {customFields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{field.label}</th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{contact.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contact.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contact.phone}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contact.company}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{contact.owner}</td>
                    {/* Custom fields values */}
                    {customFields.map(field => (
                      <td key={field.id} className="px-4 py-2 whitespace-nowrap">{(contact.custom && contact.custom[field.id]) || ""}</td>
                    ))}
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit({ ...contact, custom: contact.custom || {} })}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(contact.id)}>Delete</Button>
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