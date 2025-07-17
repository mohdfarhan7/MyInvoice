"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessProfile } from "./business-profile"
import { InvoiceSettings } from "./invoice-settings"
import { NotificationSettings } from "./notification-settings"
import { SubscriptionPlan } from "./subscription-plan"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="business" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="business">Business Profile</TabsTrigger>
        <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
      </TabsList>

      <TabsContent value="business">
        <BusinessProfile />
      </TabsContent>

      <TabsContent value="invoice">
        <InvoiceSettings />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionPlan />
      </TabsContent>
    </Tabs>
  )
}
