"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, AlertTriangle, CheckCircle } from "lucide-react"

export function GSTWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          GST Filing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Period</span>
          <Badge variant="outline">Dec 2024</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">GSTR-1</span>
            </div>
            <Badge className="bg-green-100 text-green-800">Filed</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">GSTR-3B</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 mb-2">Tax Summary</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>CGST</span>
              <span>₹12,450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>SGST</span>
              <span>₹12,450</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>₹24,900</span>
            </div>
          </div>
        </div>

        <Button className="w-full" size="sm">
          File GSTR-3B
        </Button>
      </CardContent>
    </Card>
  )
}
