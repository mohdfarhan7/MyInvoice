import { ReportCards } from "@/components/reports/report-cards"
import { ReportFilters } from "@/components/reports/report-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and reports</p>
        </div>
      </div>
      <ReportFilters />
      <Tabs defaultValue="sales" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-8">
          <ReportCards type="sales" />
        </TabsContent>
        <TabsContent value="inventory" className="space-y-8">
          <ReportCards type="inventory" />
        </TabsContent>
        <TabsContent value="financial" className="space-y-8">
          <ReportCards type="financial" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
