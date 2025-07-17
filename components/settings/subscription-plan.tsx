import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Check, X, Zap } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    current: false,
    features: [
      { name: "5 Invoices per month", included: true },
      { name: "Basic reporting", included: true },
      { name: "Email support", included: true },
      { name: "GST compliance", included: false },
      { name: "Multi-user access", included: false },
      { name: "WhatsApp integration", included: false },
    ],
  },
  {
    name: "Silver",
    price: "₹299",
    period: "per month",
    current: true,
    features: [
      { name: "100 Invoices per month", included: true },
      { name: "Advanced reporting", included: true },
      { name: "Priority support", included: true },
      { name: "GST compliance", included: true },
      { name: "Multi-user access", included: false },
      { name: "WhatsApp integration", included: true },
    ],
  },
  {
    name: "Platinum",
    price: "₹599",
    period: "per month",
    current: false,
    features: [
      { name: "Unlimited Invoices", included: true },
      { name: "Advanced reporting", included: true },
      { name: "24/7 support", included: true },
      { name: "GST compliance", included: true },
      { name: "Multi-user access", included: true },
      { name: "WhatsApp integration", included: true },
    ],
  },
]

export function SubscriptionPlan() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">Silver Plan</h3>
              <p className="text-sm text-muted-foreground">₹299 per month</p>
            </div>
            <Badge className="bg-blue-600">Current</Badge>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Usage this month</span>
              <span className="text-sm font-medium">45/100 invoices</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Next billing date: March 15, 2024</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.current ? "ring-2 ring-blue-600" : ""}`}>
            {plan.current && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">Current Plan</Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {plan.name === "Platinum" && <Zap className="h-5 w-5 text-yellow-500" />}
                {plan.name}
              </CardTitle>
              <div className="text-3xl font-bold">{plan.price}</div>
              <p className="text-sm text-muted-foreground">{plan.period}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${!feature.included ? "text-gray-400" : ""}`}>{feature.name}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" variant={plan.current ? "outline" : "default"} disabled={plan.current}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
