import { InvoiceList } from "@/components/invoices/invoice-list"
import { InvoiceFilters } from "@/components/invoices/invoice-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage all your invoices and billing</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      <InvoiceFilters />
      <InvoiceList />
    </div>
  )
}
