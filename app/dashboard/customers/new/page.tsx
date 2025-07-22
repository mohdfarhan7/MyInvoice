"use client";
import { useRouter } from 'next/navigation';

export default function AddCustomerPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add customer creation logic here
    alert('Customer added!');
    router.push('/dashboard/customers');
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Customer Name" required />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" required />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
    </div>
  );
} 