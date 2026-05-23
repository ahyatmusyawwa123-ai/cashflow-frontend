"use client"

import { useEffect, useState } from "react"
import { Search, Eye, FileText } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/types"
import type { LoanRequest } from "@/lib/types"
import { ApprovalStepper } from "@/components/approval-stepper"

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    approved_hrd: "HRD Approved",
    approved_manager: "Manager Approved",
    approved_director: "Director Approved",
    ready_for_finance: "Ready for Finance",
    disbursed: "Disbursed",
    rejected: "Rejected",
  }
  return labels[status] || status
}

function LoanDetailModal({ loan }: { loan: LoanRequest }) {
  const installmentProgress = (loan.paidInstallments / loan.tenor) * 100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{loan.title}</DialogTitle>
          <DialogDescription>
            Loan ID: {loan.id} | {formatDate(loan.request_date)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(loan.status)}>
                {getStatusLabel(loan.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenor</p>
              <p className="font-medium text-foreground">{loan.tenor} months</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Installment</p>
              <p className="font-medium text-foreground">
                {formatCurrency(loan.monthly_installment)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground">{loan.description}</p>
          </div>

          {loan.status === "disbursed" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Payment Progress</p>
                <p className="text-sm font-medium text-foreground">
                  {loan.paidInstallments}/{loan.tenor} installments
                </p>
              </div>
              <Progress value={installmentProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Remaining: {formatCurrency(
  loan.monthly_installment *
    (loan.tenor - (loan.paidInstallments || 0))
)}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-3">Approval Progress</p>
            <ApprovalStepper amount={loan.amount} currentStatus={loan.status} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function LoanHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loanRequests, setLoanRequests] = useState<any[]>([])
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/petty-cash")
    .then((res) => res.json())
    .then((data) => {
      const loans = data.filter(
        (item: any) => item.type === "loan"
      )

      setLoanRequests(loans)
    })
}, [])
const [statusFilter, setStatusFilter] = useState<string>("all")
const [currentPage, setCurrentPage] = useState(1)
const [rowsPerPage, setRowsPerPage] = useState(5)

const filteredLoans = loanRequests.filter((loan) => {

  const matchesSearch =

    (loan.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||

    (loan.userName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

  const matchesStatus =
    statusFilter === "all" ||
    loan.status === statusFilter

  return matchesSearch && matchesStatus

})

const totalPages = Math.ceil(
  filteredLoans.length / rowsPerPage
)

const startIndex =
  (currentPage - 1) * rowsPerPage

const paginatedLoans =
  filteredLoans.slice(
    startIndex,
    startIndex + rowsPerPage
  )
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Riwayat Loan</CardTitle>
        <CardDescription>View and track your loan requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] cursor-pointer">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved_hrd">HRD Approved</SelectItem>
              <SelectItem value="approved_manager">Manager Approved</SelectItem>
              <SelectItem value="approved_director">Director Approved</SelectItem>
              <SelectItem value="disbursed">Disbursed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Judul</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tenor</TableHead>
                <TableHead>Angsuran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No loans found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLoans.map((loan, index) => (
                  <TableRow
  key={loan.id}
  className={`hover:bg-blue-50 transition-colors ${
    index % 2 === 0
      ? "bg-blue-50/70"
      : "bg-white"
  }`}
>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{loan.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {loan.userName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(loan.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {loan.tenor} months
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(loan.amount / loan.tenor)}
                    </TableCell>
                    <TableCell>
                      <Badge
  className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${
    loan.status === "paid"
      ? "bg-green-100 text-green-700"

      : loan.status === "approved_hrd"
      ? "bg-yellow-100 text-yellow-700"

      : loan.status === "approved_manager"
      ? "bg-blue-100 text-blue-700"

      : loan.status === "approved_director"
      ? "bg-indigo-100 text-indigo-700"

      : loan.status === "completed"
      ? "bg-cyan-100 text-cyan-700"

      : loan.status === "rejected"
      ? "bg-red-100 text-red-700"

      : "bg-gray-100 text-gray-700"
  }`}
>
                        {getStatusLabel(loan.status)}
                      </Badge>
                    </TableCell>
<TableCell>

  <div className="flex items-center gap-2">

    <div className="w-[140px] h-2 rounded-full bg-muted overflow-hidden">

      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
        style={{
width: `${
  loan.status === "completed" ||
  loan.status === "paid"

    ? 100

    : loan.status === "approved_director"
    ? 80

    : loan.status === "approved_manager"
    ? 60

    : loan.status === "approved_hrd"
    ? 40

    : loan.status === "submitted"
    ? 20

    : 10
}%`,
        }}
      />

    </div>

    <span className="text-sm font-medium text-muted-foreground min-w-[60px]">

{loan.status === "completed" ||
loan.status === "paid"

  ? "Complete"

  : loan.status === "approved_director"
  ? "80%"

  : loan.status === "approved_manager"
  ? "60%"

  : loan.status === "approved_hrd"
  ? "40%"

  : loan.status === "submitted"
  ? "20%"

  : "10%"}

    </span>

  </div>

</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
  <LoanDetailModal loan={loan} />
</div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-6">

  <p className="text-sm text-muted-foreground">

    Showing {startIndex + 1} to{" "}

    {Math.min(
      startIndex + rowsPerPage,
      filteredLoans.length
    )}{" "}

    of {filteredLoans.length} entries

  </p>

  <div className="flex items-center gap-2">

    <Select
      value={rowsPerPage.toString()}
      onValueChange={(value) => {

        setRowsPerPage(Number(value))

        setCurrentPage(1)

      }}
    >

      <SelectTrigger className="w-[80px] cursor-pointer">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </SelectContent>

    </Select>

    <div className="flex items-center gap-2">

      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((prev) => prev - 1)
        }
      >
        Previous
      </Button>

      {Array.from(
        { length: totalPages },
        (_, i) => (
          <Button
            key={i}
            size="sm"
            className="cursor-pointer"
            variant={
              currentPage === i + 1
                ? "default"
                : "outline"
            }
            onClick={() =>
              setCurrentPage(i + 1)
            }
          >
            {i + 1}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((prev) => prev + 1)
        }
      >
        Next
      </Button>

    </div>

  </div>

</div>
      </CardContent>
    </Card>
  )
}

