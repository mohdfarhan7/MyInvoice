"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CustomLayoutBuilder, CustomField } from "@/components/ui/custom-layout-builder"
import { useToast } from "@/hooks/use-toast"

const mockActivities = [
  { id: 1, type: "Call", subject: "Follow up with John", due: "2024-06-10", owner: "Alice", reminder: "", custom: {} as Record<string, any> },
  { id: 2, type: "Meeting", subject: "Demo for Beta Ltd", due: "2024-06-12", owner: "Bob", reminder: "", custom: {} as Record<string, any> },
]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(mockActivities)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: "", subject: "", due: "", owner: "", reminder: "", custom: {} as Record<string, any> })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activities_custom_fields")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const { toast } = useToast();
  const [notifiedReminders, setNotifiedReminders] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [sortBy, setSortBy] = useState("due");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activities");
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activities", JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const interval = setInterval(() => {
      const now = new Date();
      activities.forEach((a) => {
        if (a.reminder) {
          const key = `${a.id}-${a.reminder}`;
          const reminderTime = new Date(a.reminder);
          if (
            reminderTime <= now &&
            now.getTime() - reminderTime.getTime() < 60000 &&
            !notifiedReminders.has(key)
          ) {
            toast({
              title: `Reminder: ${a.type}`,
              description: `${a.subject} (Owner: ${a.owner}) is due now!`,
            });
            setNotifiedReminders((prev) => new Set(prev).add(key));
          }
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [activities, toast, notifiedReminders]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "reminder") {
      setForm({ ...form, reminder: e.target.value })
    } else if (customFields.some(f => f.id === e.target.name)) {
      setForm({ ...form, custom: { ...form.custom, [e.target.name]: e.target.value } })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setActivities([
        {
          id: activities.length + 1,
          type: form.type,
          subject: form.subject,
          due: form.due,
          owner: form.owner,
          reminder: form.reminder,
          custom: form.custom,
        },
        ...activities,
      ])
      setForm({ type: "", subject: "", due: "", owner: "", reminder: "", custom: {} })
      setIsSubmitting(false)
      setOpen(false)
    }, 800)
  }

  const handleCustomFieldsChange = (fields: CustomField[]) => {
    setCustomFields(fields)
    localStorage.setItem("activities_custom_fields", JSON.stringify(fields))
  }

  // Compute filtered and sorted activities
  const filteredActivities = activities.filter((a) => {
    // Search in type, subject, owner, and all custom field values
    const searchLower = search.toLowerCase();
    const matchesSearch =
      a.type.toLowerCase().includes(searchLower) ||
      a.subject.toLowerCase().includes(searchLower) ||
      a.owner.toLowerCase().includes(searchLower) ||
      Object.values(a.custom || {}).some((v) => String(v).toLowerCase().includes(searchLower));
    const matchesOwner = ownerFilter ? a.owner === ownerFilter : true;
    return matchesSearch && matchesOwner;
  });
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let aVal: any, bVal: any;
    switch (sortBy) {
      case "type":
        aVal = a.type; bVal = b.type; break;
      case "due":
        aVal = a.due; bVal = b.due; break;
      case "owner":
        aVal = a.owner; bVal = b.owner; break;
      case "reminder":
        aVal = a.reminder || ""; bVal = b.reminder || ""; break;
      default:
        aVal = a.due; bVal = b.due;
    }
    if (sortDir === "asc") return String(aVal).localeCompare(String(bVal));
    else return String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search activities..."
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
            {[...new Set(activities.map(a => a.owner))].map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="due">Sort by Due Date</option>
            <option value="type">Sort by Type</option>
            <option value="owner">Sort by Owner</option>
            <option value="reminder">Sort by Reminder</option>
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
                <DialogTitle>Customize Activity Fields</DialogTitle>
              </DialogHeader>
              <CustomLayoutBuilder fields={customFields} onChange={handleCustomFieldsChange} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>Add Activity</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    name="due"
                    type="date"
                    value={form.due}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder</label>
                  <input
                    name="reminder"
                    type="datetime-local"
                    value={form.reminder}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
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
                    {isSubmitting ? "Adding..." : "Add Activity"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reminder</th>
                  {/* Custom fields headers */}
                  {customFields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{field.label}</th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">{activity.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{activity.subject}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{activity.due}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{activity.owner}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{activity.reminder ? new Date(activity.reminder).toLocaleString() : ""}</td>
                    {/* Custom fields values */}
                    {customFields.map(field => (
                      <td key={field.id} className="px-4 py-2 whitespace-nowrap">{(activity.custom && activity.custom[field.id]) || ""}</td>
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