"use client";
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add product creation logic here
    alert('Product added!');
    router.push('/dashboard/products');
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Product Name" required />
        <input className="w-full border p-2 rounded" placeholder="Price" type="number" required />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
    </div>
  );
} 