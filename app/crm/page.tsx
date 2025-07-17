"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, Building2, Calendar } from "lucide-react"

export default function CRMDashboardPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">CRM Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/crm/leads">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="w-6 h-6" /> Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <div className="text-gray-500">Total Leads</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crm/opportunities">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Star className="w-6 h-6" /> Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <div className="text-gray-500">Open Opportunities</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crm/contacts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users className="w-6 h-6" /> Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <div className="text-gray-500">Total Contacts</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crm/accounts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Building2 className="w-6 h-6" /> Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <div className="text-gray-500">Total Accounts</div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/crm/activities">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Calendar className="w-6 h-6" /> Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <div className="text-gray-500">Upcoming Activities</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 