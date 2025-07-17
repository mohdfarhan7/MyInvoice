import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, BarChart3, PieChart, TrendingUp } from "lucide-react"

interface ReportCardsProps {
  type: "sales" | "gst" | "inventory" | "financial"
}

const reportData = {
  sales: [
    {
      title: "Sales Summary Report",
      description: "Comprehensive sales analysis with trends",
      icon: BarChart3,
      lastGenerated: "2 hours ago",
    },
    {
      title: "Customer Sales Report",
      description: "Sales breakdown by customer",
      icon: PieChart,
      lastGenerated: "1 day ago",
    },
    {
      title: "Product Performance",
      description: "Top selling products and categories",
      icon: TrendingUp,
      lastGenerated: "3 hours ago",
    },
  ],
  gst: [
    {
      title: "GSTR-1 Report",
      description: "Outward supplies report for GST filing",
      icon: FileText,
      lastGenerated: "1 hour ago",
    },
    {
      title: "GSTR-3B Report",
      description: "Monthly return summary",
      icon: FileText,
      lastGenerated: "2 days ago",
    },
    {
      title: "GST Summary",
      description: "Tax collected and paid summary",
      icon: BarChart3,
      lastGenerated: "5 hours ago",
    },
  ],
  inventory: [
    {
      title: "Stock Summary",
      description: "Current inventory levels",
      icon: BarChart3,
      lastGenerated: "30 minutes ago",
    },
    {
      title: "Low Stock Report",
      description: "Products below minimum stock level",
      icon: TrendingUp,
      lastGenerated: "1 hour ago",
    },
    {
      title: "Stock Valuation",
      description: "Total inventory value report",
      icon: PieChart,
      lastGenerated: "2 hours ago",
    },
  ],
  financial: [
    {
      title: "Profit & Loss",
      description: "Income and expense statement",
      icon: BarChart3,
      lastGenerated: "1 day ago",
    },
    {
      title: "Outstanding Report",
      description: "Receivables and payables",
      icon: TrendingUp,
      lastGenerated: "3 hours ago",
    },
    {
      title: "Cash Flow",
      description: "Money in and out analysis",
      icon: PieChart,
      lastGenerated: "6 hours ago",
    },
  ],
}

export function ReportCards({ type }: ReportCardsProps) {
  const reports = reportData[type]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card key={report.title} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <report.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
