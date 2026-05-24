"use client"

import { FileText, Banknote } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { pettyCashRequests, loanRequests } from "@/lib/data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/types"

const recentPettyCash = pettyCashRequests.slice(0, 4)
const recentLoans = loanRequests.slice(0, 4)

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    approved_hrd: "HRD Approved",
    approved_manager: "Manager Approved",
    approved_director: "Director Approved",
    ready_finance: "Ready for Finance",
    disbursed: "Disbursed",
    rejected: "Rejected",
  }
  return labels[status] || status
}

export function RecentActivity() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Recent Petty Cash */}
      <Card className="border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center gap-2">
          <FileText className="h-5 w-5 text-chart-1" />
          <div>
            <CardTitle className="text-foreground">Latest Petty Cash</CardTitle>
            <CardDescription>Recent petty cash requests</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPettyCash.map((request) => (
                <TableRow
  key={request.id}
  className="hover:bg-muted/50 transition-colors"
>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.userName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
  className={`
    ${getStatusColor(request.status)}
    px-3 py-1
    rounded-full
    text-xs font-semibold
    shadow-sm
    transition-all duration-200
    hover:scale-105 hover:shadow-md
    backdrop-blur-sm
  `}
>
  {getStatusLabel(request.status)}
</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Loans */}
      <Card className="border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center gap-2">
          <Banknote className="h-5 w-5 text-chart-2" />
          <div>
            <CardTitle className="text-foreground">Latest Loan</CardTitle>
            <CardDescription>Recent loan requests</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLoans.map((request) => (
                <TableRow
  key={request.id}
  className="hover:bg-muted/50 transition-colors"
>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.userName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(request.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
  className={`
    ${getStatusColor(request.status)}
    px-3 py-1
    rounded-full
    text-xs font-semibold
    shadow-sm
    transition-all duration-200
    hover:scale-105 hover:shadow-md
    backdrop-blur-sm
  `}
>
  {getStatusLabel(request.status)}
</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
