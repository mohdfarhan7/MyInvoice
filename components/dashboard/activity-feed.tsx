"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, FileText, Users, Package, DollarSign } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "invoice",
    title: "Invoice INV-2024-156 created",
    description: "₹25,000 for ABC Corp",
    time: "10 minutes ago",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "customer",
    title: "New customer added",
    description: "John Doe - john@example.com",
    time: "1 hour ago",
    icon: Users,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "product",
    title: "Product updated",
    description: "iPhone 15 Pro - Stock: 25",
    time: "2 hours ago",
    icon: Package,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment received",
    description: "₹15,000 from XYZ Ltd",
    time: "3 hours ago",
    icon: DollarSign,
    color: "text-green-600",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-gray-100`}>
              <activity.icon className={`h-3 w-3 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{activity.title}</div>
              <div className="text-xs text-gray-600">{activity.description}</div>
              <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
