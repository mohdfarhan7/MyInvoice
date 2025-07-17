"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Download, Printer } from "lucide-react";

const initialBills = [
  {
    id: "EWB-001",
    date: "2024-06-01",
    consignor: "ABC Traders",
    consignee: "XYZ Distributors",
    goods: "Electronics",
    vehicle: "MH12AB1234",
    status: "Active",
    amount: 50000,
  },
  {
    id: "EWB-002",
    date: "2024-06-02",
    consignor: "DEF Suppliers",
    consignee: "LMN Retailers",
    goods: "FMCG",
    vehicle: "MH14CD5678",
    status: "Expired",
    amount: 20000,
  },
];

export default function EWayBillsPage() {
  const [bills, setBills] = useState(initialBills);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    consignor: "",
    consignee: "",
    goods: "",
    vehicle: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setBills([
        {
          id: `EWB-00${bills.length + 1}`,
          date: new Date().toISOString().slice(0, 10),
          consignor: form.consignor,
          consignee: form.consignee,
          goods: form.goods,
          vehicle: form.vehicle,
          status: "Active",
          amount: Number(form.amount),
        },
        ...bills,
      ]);
      setForm({ consignor: "", consignee: "", goods: "", vehicle: "", amount: "" });
      setIsSubmitting(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">E-Way Bills</h1>
          <p className="text-gray-600 mt-1">Generate and manage your E-Way Bills here.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Generate E-Way Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate E-Way Bill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consignor</label>
                  <input
                    name="consignor"
                    value={form.consignor}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consignee</label>
                  <input
                    name="consignee"
                    value={form.consignee}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goods</label>
                  <input
                    name="goods"
                    value={form.goods}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <input
                    name="vehicle"
                    value={form.vehicle}
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
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Generating..." : "Generate E-Way Bill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* E-Way Bills Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Consignor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Consignee</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Goods</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-sm">{bill.id}</td>
                <td className="px-4 py-2 text-sm">{bill.date}</td>
                <td className="px-4 py-2 text-sm">{bill.consignor}</td>
                <td className="px-4 py-2 text-sm">{bill.consignee}</td>
                <td className="px-4 py-2 text-sm">{bill.goods}</td>
                <td className="px-4 py-2 text-sm">{bill.vehicle}</td>
                <td className="px-4 py-2 text-sm">₹{bill.amount.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${bill.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{bill.status}</span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="icon" variant="ghost" title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" title="Print">
                    <Printer className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && (
          <div className="text-gray-500 text-center py-8">No E-Way Bills found.</div>
        )}
      </div>
    </div>
  );
} 