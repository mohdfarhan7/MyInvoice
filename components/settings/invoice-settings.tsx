import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

export function InvoiceSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input id="invoicePrefix" defaultValue="INV-" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDays">Default Due Days</Label>
              <Input id="dueDays" type="number" defaultValue="30" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Round Off Amounts</Label>
                <p className="text-sm text-muted-foreground">Round invoice totals to nearest rupee</p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Default Terms & Conditions</Label>
            <Textarea
              id="terms"
              defaultValue="Payment is due within 30 days of invoice date. Late payments may incur additional charges."
              rows={4}
            />
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
