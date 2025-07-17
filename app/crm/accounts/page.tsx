"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const mockAccounts = [
  { id: 1, name: "Acme Corp", industry: "Manufacturing", owner: "Alice" },
  { id: 2, name: "Beta Ltd", industry: "IT Services", owner: "Bob" },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", industry: "", owner: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
        },
        ...accounts,
      ])
      setForm({ name: "", industry: "", owner: "" })
      setIsSubmitting(false)
      setOpen(false)
    }, 800)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
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
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{account.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{account.industry}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{account.owner}</td>
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