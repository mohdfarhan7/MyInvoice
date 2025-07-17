"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

const mockLeads = [
  { id: 1, name: "John Doe", company: "Acme Corp", status: "New", stage: "Lead", owner: "Alice" },
  { id: 2, name: "Jane Smith", company: "Beta Ltd", status: "Contacted", stage: "Qualified", owner: "Bob" },
  { id: 3, name: "Sam Patel", company: "Gamma Inc", status: "Lost", stage: "Lost", owner: "Alice" },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ name: "", company: "", status: "New", stage: "Lead", owner: "" })
  const [editForm, setEditForm] = useState({ id: 0, name: "", company: "", status: "", stage: "", owner: "" })
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLeads([
      ...leads,
      { id: leads.length ? Math.max(...leads.map(l => l.id)) + 1 : 1, ...form },
    ])
    setForm({ name: "", company: "", status: "New", stage: "Lead", owner: "" })
    setOpen(false)
  }

  const handleEdit = (lead: typeof editForm) => {
    setEditForm(lead)
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

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
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
              <DialogFooter>
                <Button type="submit">Add Lead</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.company}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.stage}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lead.owner}</td>
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(lead)}>Edit</Button>
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