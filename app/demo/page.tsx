"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

export default function BookDemoPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    business: "",
    datetime: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Valid email is required"
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile)) return "Valid 10-digit mobile is required"
    if (!form.business.trim()) return "Business name is required"
    if (!form.datetime.trim()) return "Preferred date/time is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-2xl w-full mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-8">
            <CardTitle className="text-3xl lg:text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Calendar className="w-8 h-8 text-white" /> Book a Free Demo
            </CardTitle>
            <p className="mt-2 text-blue-100 text-lg font-medium">See MyInvoiceBook in action. Get all your questions answered live!</p>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-xl">
            {success ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Thank you for booking a demo!</h2>
                <p className="text-gray-600 mb-4">Our team will contact you soon to confirm your slot.</p>
                <Button onClick={() => setSuccess(false)} className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600">Book Another Demo</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} required />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Name</Label>
                    <Input id="business" name="business" value={form.business} onChange={handleChange} placeholder="Your Business" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="datetime">Preferred Date & Time</Label>
                    <Input id="datetime" name="datetime" type="datetime-local" value={form.datetime} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Any specific questions or requirements?" rows={3} />
                </div>
                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4 mt-2"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Demo"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 