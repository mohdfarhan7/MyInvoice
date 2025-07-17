"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRef } from "react"

const mockActivity = {
  id: 1,
  type: "Call",
  subject: "Follow up with John",
  due: "2024-06-10",
  owner: "Alice",
  notes: [
    { id: 1, type: "note", text: "Call scheduled.", date: "2024-06-01" },
    { id: 2, type: "note", text: "Left voicemail.", date: "2024-06-03" },
  ],
  attachments: [
    { id: 1, type: "attachment", filename: "call-recording.mp3", date: "2024-06-04" },
  ],
}

export default function ActivityDetailPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [activity, setActivity] = useState(mockActivity)
  const [editing, setEditing] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [note, setNote] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setActivity({
      ...activity,
      notes: [
        ...activity.notes,
        { id: Date.now(), type: "note", text: note, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    setNote("")
  }

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setActivity({
      ...activity,
      attachments: [
        ...activity.attachments,
        { id: Date.now(), type: "attachment", filename: file.name, date: new Date().toISOString().slice(0, 10) },
      ],
    })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Merge notes and attachments for timeline
  const timeline = [...activity.notes, ...activity.attachments].sort((a, b) => (a.date < b.date ? 1 : -1))

  if (deleted) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity Deleted</h1>
        <Button onClick={() => router.push('/crm/activities')}>Back to Activities</Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Activity Details
            <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleted(true)}>Delete</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input className="input input-bordered w-full" defaultValue={activity.type} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input className="input input-bordered w-full" defaultValue={activity.subject} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input className="input input-bordered w-full" defaultValue={activity.due} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input className="input input-bordered w-full" defaultValue={activity.owner} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          ) : (
            <div className="space-y-2">
              <div><span className="font-medium">Type:</span> {activity.type}</div>
              <div><span className="font-medium">Subject:</span> {activity.subject}</div>
              <div><span className="font-medium">Due Date:</span> {activity.due}</div>
              <div><span className="font-medium">Owner:</span> {activity.owner}</div>
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