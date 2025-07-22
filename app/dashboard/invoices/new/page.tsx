"use client";
import { useRouter } from 'next/navigation';

export default function CreateInvoicePage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add invoice creation logic here
    alert('Invoice created!');
    router.push('/dashboard/invoices');
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Customer Name" required />
        <input className="w-full border p-2 rounded" placeholder="Amount" type="number" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create</button>
      </form>
    </div>
  );
} 