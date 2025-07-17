import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="p-6 space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <SalesChart />
            <CategoryChart />
          </div>
          <div className="space-y-10">
            <NotificationCenter />
            <ActivityFeed />
          </div>
        </div>

        <QuickActions />
      </div>
    </div>
  )
}
