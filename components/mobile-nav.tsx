"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MobileNav() {
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Create Invoice</DropdownMenuItem>
          <DropdownMenuItem>Add Product</DropdownMenuItem>
          <DropdownMenuItem>Add Customer</DropdownMenuItem>
          <DropdownMenuItem>Record Payment</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
