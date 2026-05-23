"use client"

import { Wallet, Banknote, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/types"
import { getDashboardStats } from "@/lib/data"

const stats = getDashboardStats()

const statItems = [
  {
    title: "Total Petty Cash",
    value: formatCurrency(stats.totalPettyCash),
    icon: Wallet,
    description: "All petty cash requests",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Total Loan",
    value: formatCurrency(stats.totalLoan),
    icon: Banknote,
    description: "All loan requests",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Pending Approval",
    value: stats.pendingApproval.toString(),
    icon: Clock,
    description: "Requests awaiting approval",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Total Disbursed",
    value: formatCurrency(stats.totalDisbursed),
    icon: CheckCircle2,
    description: "Successfully disbursed",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.title} className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
