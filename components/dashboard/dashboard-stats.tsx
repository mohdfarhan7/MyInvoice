"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Package } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,45,680",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Invoices",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Customers",
    value: "89",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Products",
    value: "234",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    color: "text-orange-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="group hover:shadow-xl transition-shadow border-0 rounded-2xl bg-white"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </span>
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {stat.trend === "up" ? "+" : "-"}
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
