"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomLayoutBuilder, CustomField } from "@/components/ui/custom-layout-builder"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const mockOpportunities = [
  { id: 1, name: "Acme Deal", stage: "New", value: 50000, owner: "Alice", custom: {} as Record<string, any> },
  { id: 2, name: "Beta Project", stage: "Qualified", value: 20000, owner: "Bob", custom: {} as Record<string, any> },
  { id: 3, name: "Gamma Contract", stage: "Proposal", value: 35000, owner: "Alice", custom: {} as Record<string, any> },
  { id: 4, name: "Delta Sale", stage: "Won", value: 100000, owner: "Bob", custom: {} as Record<string, any> },
  { id: 5, name: "Epsilon Pitch", stage: "Lost", value: 0, owner: "Alice", custom: {} as Record<string, any> },
]

const stages = ["New", "Qualified", "Proposal", "Won", "Lost"]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState(mockOpportunities)
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("opportunities_custom_fields")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [form, setForm] = useState({ name: "", stage: stages[0], value: "", owner: "", custom: {} as Record<string, any> })
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ id: 0, name: "", stage: stages[0], value: "", owner: "", custom: {} as Record<string, any> })
  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields)
    localStorage.setItem("opportunities_custom_fields", JSON.stringify(fields))
  }

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
    setOpportunities([
      ...opportunities,
      { id: opportunities.length ? Math.max(...opportunities.map(o => o.id)) + 1 : 1, ...form, value: Number(form.value) },
    ])
    setForm({ name: "", stage: stages[0], value: "", owner: "", custom: {} })
    setAddOpen(false)
  }
  const handleEdit = (opp: typeof editForm) => {
    setEditForm({ ...opp, custom: opp.custom || {} })
    setEditOpen(true)
  }
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpportunities(opportunities.map(o => o.id === editForm.id ? { ...editForm, value: Number(editForm.value) } : o))
    setEditOpen(false)
  }

  // Compute filtered and sorted opportunities
  const filteredOpportunities = opportunities.filter((o) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      o.name.toLowerCase().includes(searchLower) ||
      o.stage.toLowerCase().includes(searchLower) ||
      o.owner.toLowerCase().includes(searchLower) ||
      String(o.value).toLowerCase().includes(searchLower) ||
      Object.values(o.custom || {}).some((v) => String(v).toLowerCase().includes(searchLower));
    const matchesOwner = ownerFilter ? o.owner === ownerFilter : true;
    return matchesSearch && matchesOwner;
  });
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    let aVal: any, bVal: any;
    switch (sortBy) {
      case "name":
        aVal = a.name; bVal = b.name; break;
      case "stage":
        aVal = a.stage; bVal = b.stage; break;
      case "owner":
        aVal = a.owner; bVal = b.owner; break;
      case "value":
        aVal = a.value; bVal = b.value; break;
      default:
        aVal = a.name; bVal = b.name;
    }
    if (sortDir === "asc") return String(aVal).localeCompare(String(bVal));
    else return String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search opportunities..."
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
            {[...new Set(opportunities.map(o => o.owner))].map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="stage">Sort by Stage</option>
            <option value="owner">Sort by Owner</option>
            <option value="value">Sort by Value</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="border rounded px-2 py-1 text-sm"
            title="Toggle sort direction"
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
          <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCustomizeOpen(true)}>Customize Fields</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Customize Opportunity Fields</DialogTitle>
              </DialogHeader>
              <CustomLayoutBuilder fields={customFields} onChange={handleCustomFieldsChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setAddOpen(true)}>Add Opportunity</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Opportunity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <select name="stage" value={form.stage} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Input name="value" type="number" placeholder="Value" value={form.value} onChange={handleChange} required />
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
                  <Button type="submit">Add Opportunity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Opportunity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <Input name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} required />
                <select name="stage" value={editForm.stage} onChange={handleEditChange} className="w-full border rounded-md px-3 py-2">
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Input name="value" type="number" placeholder="Value" value={editForm.value} onChange={handleEditChange} required />
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
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {stages.map((stage) => (
          <div key={stage} className="min-w-[250px] bg-gray-50 rounded-xl p-4 flex-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{stage}</h2>
            <div className="space-y-4">
              {sortedOpportunities.filter((o) => o.stage === stage).map((opp) => (
                <Card key={opp.id} className="shadow-sm">
                  <CardContent className="py-4">
                    <div className="font-medium text-gray-900">{opp.name}</div>
                    <div className="text-gray-500 text-sm">Owner: {opp.owner}</div>
                    <div className="text-indigo-700 font-bold mt-2">₹{opp.value.toLocaleString()}</div>
                    {/* Show custom fields */}
                    {customFields.map(field => (
                      <div key={field.id} className="text-xs text-gray-600">
                        <span className="font-medium">{field.label}:</span> {(opp.custom && opp.custom[field.id]) || ""}
                      </div>
                    ))}
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit({ ...opp, value: String(opp.value), custom: opp.custom || {} })}>Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 