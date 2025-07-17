"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock, Link2, CreditCard, Banknote, Wallet, XCircle } from "lucide-react";

const initialPayments = [
  {
    id: 1,
    customer: "Ravi Kumar",
    invoice: "INV-001",
    date: "2024-06-01",
    amount: 5000,
    method: "UPI",
    status: "Paid",
    reference: "TXN123456",
  },
  {
    id: 2,
    customer: "Priya Singh",
    invoice: "INV-002",
    date: "2024-06-02",
    amount: 3000,
    method: "Bank Transfer",
    status: "Pending",
    reference: "",
  },
];

const paymentMethods = [
  { label: "UPI", icon: <Wallet className="w-4 h-4 inline mr-1" /> },
  { label: "Bank Transfer", icon: <Banknote className="w-4 h-4 inline mr-1" /> },
  { label: "Credit Card", icon: <CreditCard className="w-4 h-4 inline mr-1" /> },
  { label: "Cash", icon: <Wallet className="w-4 h-4 inline mr-1" /> },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    invoice: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    method: paymentMethods[0].label,
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setPayments([
        {
          id: payments.length + 1,
          customer: form.customer,
          invoice: form.invoice,
          date: form.date,
          amount: Number(form.amount),
          method: form.method,
          status: form.method === "Cash" ? "Paid" : "Pending",
          reference: form.reference,
        },
        ...payments,
      ]);
      setForm({ customer: "", invoice: "", date: new Date().toISOString().slice(0, 10), amount: "", method: paymentMethods[0].label, reference: "" });
      setIsSubmitting(false);
      setOpen(false);
    }, 1200);
  };

  const filteredPayments = filter === "All" ? payments : payments.filter(p => p.status === filter);

  // Payment summary
  const totalReceived = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="text-gray-600 mt-1">Manage and track your payments here.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    name="amount"
                    type="number"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {paymentMethods.map((m) => (
                      <option key={m.label} value={m.label}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Txn ID</label>
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Recording..." : "Record Payment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center">
          <div className="text-lg font-semibold text-green-800">Total Received</div>
          <div className="text-2xl font-bold text-green-900 mt-2">₹{totalReceived.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center">
          <div className="text-lg font-semibold text-yellow-800">Total Pending</div>
          <div className="text-2xl font-bold text-yellow-900 mt-2">₹{totalPending.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        {['All', 'Paid', 'Pending'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            className={filter === f ? "bg-blue-600 text-white" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{p.customer}</td>
                <td className="px-4 py-2 text-sm">{p.invoice}</td>
                <td className="px-4 py-2 text-sm">{p.date}</td>
                <td className="px-4 py-2 text-sm">₹{p.amount.toLocaleString()}</td>
                <td className="px-4 py-2 text-sm flex items-center gap-1">
                  {paymentMethods.find(m => m.label === p.method)?.icon}
                  {p.method}
                </td>
                <td className="px-4 py-2">
                  {p.status === "Paid" ? (
                    <span className="flex items-center gap-1 text-green-700 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-700 text-xs font-medium">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm">{p.reference || <span className="text-gray-400">-</span>}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="icon" variant="ghost" title="Generate Payment Link">
                    <Link2 className="w-4 h-4" />
                  </Button>
                  {p.status === "Pending" && (
                    <Button size="icon" variant="ghost" title="Mark as Paid">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </Button>
                  )}
                  {p.status === "Paid" && (
                    <Button size="icon" variant="ghost" title="Refund">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPayments.length === 0 && (
          <div className="text-gray-500 text-center py-8">No payments found.</div>
        )}
      </div>
    </div>
  );
} 