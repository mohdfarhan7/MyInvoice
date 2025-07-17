"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertCircle, Info, CheckCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Low Stock Alert",
    message: "5 products are running low on stock",
    time: "2 hours ago",
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  {
    id: 2,
    type: "info",
    title: "Payment Received",
    message: "₹15,000 received from ABC Corp",
    time: "4 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "info",
    title: "New Customer",
    message: "John Doe registered as new customer",
    time: "1 day ago",
    icon: Info,
    color: "text-blue-600",
  },
]

export function NotificationCenter() {
  return (
    <Card className="shadow-md border-0 rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          <Badge className="bg-red-100 text-red-800 ml-auto px-2 py-0.5 text-xs font-semibold rounded-full">3</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg border-l-4 ${
              notification.type === "warning"
                ? "border-yellow-400"
                : notification.type === "info"
                ? "border-blue-400"
                : "border-green-400"
            }`}
          >
            <notification.icon className={`h-4 w-4 mt-0.5 ${notification.color}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{notification.title}</div>
              <div className="text-xs text-gray-600">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
            </div>
          </div>
        ))}
        <div className="pt-2 text-right">
          <a href="#" className="text-xs text-blue-600 hover:underline font-medium">View All</a>
        </div>
      </CardContent>
    </Card>
  )
}
