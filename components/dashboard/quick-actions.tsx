"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Users, Package, Receipt, MessageSquare, BarChart3 } from "lucide-react"

const quickActions = [
  {
    title: "Create Invoice",
    description: "Generate a new invoice",
    icon: FileText,
    color: "bg-blue-600 hover:bg-blue-700",
    href: "/dashboard/invoices/new",
  },
  {
    title: "Add Customer",
    description: "Register new customer",
    icon: Users,
    color: "bg-green-600 hover:bg-green-700",
    href: "/dashboard/customers/new",
  },
  {
    title: "Add Product",
    description: "Add new product/service",
    icon: Package,
    color: "bg-purple-600 hover:bg-purple-700",
    href: "/dashboard/products/new",
  },
  {
    title: "Send WhatsApp",
    description: "Send invoice via WhatsApp",
    icon: MessageSquare,
    color: "bg-green-500 hover:bg-green-600",
    href: "/dashboard/whatsapp",
  },
  {
    title: "View Reports",
    description: "Business analytics",
    icon: BarChart3,
    color: "bg-indigo-600 hover:bg-indigo-700",
    href: "/dashboard/reports",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all bg-transparent"
              asChild
            >
              <a href={action.href}>
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
