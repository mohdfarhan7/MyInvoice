"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CustomLayoutBuilder, CustomField } from "@/components/ui/custom-layout-builder"

const mockAccounts = [
  { id: 1, name: "Acme Corp", industry: "Manufacturing", owner: "Alice", custom: {} as Record<string, any> },
  { id: 2, name: "Beta Ltd", industry: "IT Services", owner: "Bob", custom: {} as Record<string, any> },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", industry: "", owner: "", custom: {} as Record<string, any> })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accounts_custom_fields")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setAccounts([
        {
          id: accounts.length + 1,
          name: form.name,
          industry: form.industry,
          owner: form.owner,
          custom: form.custom,
        },
        ...accounts,
      ])
      setForm({ name: "", industry: "", owner: "", custom: {} })
      setIsSubmitting(false)
      setOpen(false)
    }, 800)
  }

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields)
    localStorage.setItem("accounts_custom_fields", JSON.stringify(fields))
  }

  // Compute filtered accounts
  const filteredAccounts = accounts.filter((a) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(searchLower) ||
      a.industry.toLowerCase().includes(searchLower) ||
      a.owner.toLowerCase().includes(searchLower) ||
      Object.values(a.custom || {}).some((v) => String(v).toLowerCase().includes(searchLower));
    const matchesOwner = ownerFilter ? a.owner === ownerFilter : true;
    return matchesSearch && matchesOwner;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search accounts..."
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
            {[...new Set(accounts.map(a => a.owner))].map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
          <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setCustomizeOpen(true)}>Customize Fields</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>Customize Account Fields</DialogTitle>
              </DialogHeader>
              <CustomLayoutBuilder fields={customFields} onChange={handleCustomFieldsChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>Add Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <input
                    name="owner"
                    value={form.owner}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
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
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  {/* Custom fields headers */}
                  {customFields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{field.label}</th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{account.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{account.industry}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{account.owner}</td>
                    {/* Custom fields values */}
                    {customFields.map(field => (
                      <td key={field.id} className="px-4 py-2 whitespace-nowrap">{(account.custom as Record<string, any>)[field.id] || ""}</td>
                    ))}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Button size="sm" variant="outline">View</Button>
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