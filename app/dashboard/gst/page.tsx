"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const gstReturns = [
  {
    name: "GSTR-1",
    status: "Filed",
    dueDate: "10th Jan 2024",
    period: "Dec 2023",
    downloadUrl: "#",
  },
  {
    name: "GSTR-3B",
    status: "Pending",
    dueDate: "20th Jan 2024",
    period: "Dec 2023",
    downloadUrl: "#",
  },
];

const taxSummary = [
  { label: "CGST", value: 12450 },
  { label: "SGST", value: 12450 },
  { label: "IGST", value: 0 },
  { label: "Total", value: 24900 },
];

export default function GSTFilingPage() {
  const [open, setOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Dec 2023");
  const [isFiling, setIsFiling] = useState(false);
  const [filed, setFiled] = useState(false);

  const handleFileReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFiling(true);
    setTimeout(() => {
      setIsFiling(false);
      setFiled(true);
      setOpen(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">GST Filing</h1>
          <p className="text-gray-600 mt-1">Manage and file your GST returns here.</p>
        </div>
      </div>

      {/* GST Returns Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gstReturns.map((ret) => (
          <div key={ret.name} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{ret.name}</h2>
                <div className="text-sm text-gray-500">Period: {ret.period}</div>
                <div className="text-xs text-gray-400">Due: {ret.dueDate}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ret.status === "Filed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{ret.status}</span>
            </div>
            <div className="flex gap-2 mt-4">
              {ret.status === "Filed" ? (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Download</Button>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setFiled(false)}>File Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>File {ret.name} Return</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFileReturn} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Period</label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                          <option>Dec 2023</option>
                          <option>Nov 2023</option>
                          <option>Oct 2023</option>
                        </select>
                      </div>
                      <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600 mb-2">Review Data</div>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>Sales: ₹1,00,000</li>
                          <li>Tax Collected: ₹24,900</li>
                          <li>Invoices: 12</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="w-full" disabled={isFiling}>
                          {isFiling ? "Filing..." : "File Return"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">View History</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Summary */}
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {taxSummary.map((tax) => (
            <div key={tax.label} className="flex flex-col items-center">
              <span className="text-sm text-gray-500">{tax.label}</span>
              <span className="text-xl font-bold text-gray-900">₹{tax.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filing History Placeholder */}
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing History</h3>
        <div className="text-gray-500 text-center">Filing history will appear here.</div>
      </div>
    </div>
  );
} 