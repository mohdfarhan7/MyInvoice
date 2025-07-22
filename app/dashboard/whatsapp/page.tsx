"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock, Send } from "lucide-react";

const initialMessages = [
  {
    id: 1,
    customer: "Ravi Kumar",
    phone: "+91 9876543210",
    invoice: "INV-001",
    template: "Invoice Notification",
    status: "Delivered",
    date: "2024-06-01 10:30",
  },
  {
    id: 2,
    customer: "Priya Singh",
    phone: "+91 9123456780",
    invoice: "INV-002",
    template: "Payment Reminder",
    status: "Pending",
    date: "2024-06-02 14:15",
  },
];

const templates = [
  "Invoice Notification",
  "Payment Reminder",
  "Promotional Offer",
];

export default function WhatsAppPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    invoice: "",
    template: templates[0],
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper to open WhatsApp Web with pre-filled message
  const openWhatsApp = (phone: string, message: string) => {
    // Remove non-digit characters for WhatsApp link
    const phoneDigits = phone.replace(/\D/g, "");
    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Helper to open WhatsApp Web with pre-filled message and update status
  const openWhatsAppAndMarkSent = (msgId: number, phone: string, message: string) => {
    const phoneDigits = phone.replace(/\D/g, "");
    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, status: "Sent", date: new Date().toLocaleString("en-IN", { hour12: false }) } : m
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      const newId = messages.length + 1;
      setMessages([
        {
          id: newId,
          customer: form.customer,
          phone: form.phone,
          invoice: form.invoice,
          template: form.template,
          status: "Pending",
          date: new Date().toLocaleString("en-IN", { hour12: false }),
        },
        ...messages,
      ]);
      setForm({ customer: "", phone: "", invoice: "", template: templates[0] });
      setIsSending(false);
      setOpen(false);
      // Open WhatsApp Web and mark as sent
      setTimeout(() => {
        openWhatsAppAndMarkSent(newId, form.phone, `${form.template} for invoice ${form.invoice}`);
      }, 100); // slight delay to ensure state update
    }, 1200);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">WhatsApp</h1>
          <p className="text-gray-600 mt-1">Send invoices and notifications via WhatsApp.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Send WhatsApp Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send WhatsApp Message</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                  <input
                    name="invoice"
                    value={form.invoice}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                  <select
                    name="template"
                    value={form.template}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {templates.map((tpl) => (
                      <option key={tpl} value={tpl}>{tpl}</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* WhatsApp Messages Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{msg.customer}</td>
                <td className="px-4 py-2 text-sm">{msg.phone}</td>
                <td className="px-4 py-2 text-sm">{msg.invoice}</td>
                <td className="px-4 py-2 text-sm">{msg.template}</td>
                <td className="px-4 py-2">
                  {msg.status === "Delivered" ? (
                    <span className="flex items-center gap-1 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" /> Delivered
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-700 text-xs font-medium">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm">{msg.date}</td>
                <td className="px-4 py-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Send WhatsApp"
                    onClick={() => openWhatsAppAndMarkSent(msg.id, msg.phone, `${msg.template} for invoice ${msg.invoice}`)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-8">No WhatsApp messages sent yet.</div>
        )}
      </div>
    </div>
  );
} 