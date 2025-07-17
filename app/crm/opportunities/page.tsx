"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockOpportunities = [
  { id: 1, name: "Acme Deal", stage: "New", value: 50000, owner: "Alice" },
  { id: 2, name: "Beta Project", stage: "Qualified", value: 20000, owner: "Bob" },
  { id: 3, name: "Gamma Contract", stage: "Proposal", value: 35000, owner: "Alice" },
  { id: 4, name: "Delta Sale", stage: "Won", value: 100000, owner: "Bob" },
  { id: 5, name: "Epsilon Pitch", stage: "Lost", value: 0, owner: "Alice" },
]

const stages = ["New", "Qualified", "Proposal", "Won", "Lost"]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState(mockOpportunities)

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <Button>Add Opportunity</Button>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {stages.map((stage) => (
          <div key={stage} className="min-w-[250px] bg-gray-50 rounded-xl p-4 flex-1">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{stage}</h2>
            <div className="space-y-4">
              {opportunities.filter((o) => o.stage === stage).map((opp) => (
                <Card key={opp.id} className="shadow-sm">
                  <CardContent className="py-4">
                    <div className="font-medium text-gray-900">{opp.name}</div>
                    <div className="text-gray-500 text-sm">Owner: {opp.owner}</div>
                    <div className="text-indigo-700 font-bold mt-2">₹{opp.value.toLocaleString()}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 