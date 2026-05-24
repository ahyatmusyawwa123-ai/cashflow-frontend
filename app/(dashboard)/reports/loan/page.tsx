"use client"

import { useEffect, useState } from "react"
import { Download, Search } from "lucide-react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { loanRequests, getLoanTrendData } from "@/lib/data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/types"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const trendData = getLoanTrendData()

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

const formatYAxis = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`
  }
  return value.toString()
}

export default function LoanReportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loanData, setLoanData] = useState<any[]>([])
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState(5)
const [monthFilter, setMonthFilter] = useState("all")
const [yearFilter, setYearFilter] = useState("all")
const [sortOrder, setSortOrder] = useState("desc")
  useEffect(() => {
  fetch("https://anyone-tinker-electable.ngrok-free.dev/api/loan-report")
    .then((res) => res.json())
    .then((data) => {
      setLoanData(data)
    })
    .catch((err) => console.error(err))
}, [])
const handleExportExcel = () => {
  const exportData = filteredLoans.map((loan) => ({
    Employee: loan.employee_name,
    Title: loan.title,
    Amount: loan.amount,
    Tenor: `${loan.tenor} months`,
    Status: loan.status,
    Paid_Installments: loan.paid_installments,
    Remaining_Balance: loan.remaining_balance,
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Report")

  XLSX.writeFile(workbook, "loan-report.xlsx")
}
const handleExportPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    "Loan Report",
    14,
    20
  )

  autoTable(doc, {
    startY: 30,

    head: [[
      "Employee",
      "Title",
      "Amount",
      "Tenor",
      "Status",
    ]],

    body: filteredLoans.map((loan) => [
      loan.employee_name,
      loan.title,
      formatCurrency(loan.amount),
      `${loan.tenor} months`,
      getStatusLabel(loan.status),
    ]),
  })

  doc.save("loan-report.pdf")
}

const filteredLoans = loanData
  .filter((loan) => {

    const matchesSearch =
      (loan.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||

      (loan.employee_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      loan.status === statusFilter

    const loanDate =
      new Date(loan.created_at)

    const loanMonth =
      String(loanDate.getMonth() + 1)

    const loanYear =
      String(loanDate.getFullYear())

    const matchesMonth =
      monthFilter === "all" ||
      loanMonth === monthFilter

    const matchesYear =
      yearFilter === "all" ||
      loanYear === yearFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMonth &&
      matchesYear
    )
  })

  .sort((a, b) => {

    const dateA =
      new Date(a.created_at).getTime()

    const dateB =
      new Date(b.created_at).getTime()

    return sortOrder === "asc"
      ? dateA - dateB
      : dateB - dateA
  })

  const totalAmount = filteredLoans.reduce(
  (sum, r) => sum + Number(r.amount),
  0
)
  const activeLoans = filteredLoans.filter(
  (r) => r.status !== "completed"
)
  const totalOutstanding = activeLoans.reduce(
  (sum, r) => sum + Number(r.remaining_balance),
  0
)
const totalPages = Math.ceil(
  filteredLoans.length / itemsPerPage
)

const startIndex =
  (currentPage - 1) * itemsPerPage

const endIndex =
  startIndex + itemsPerPage

const paginatedLoans =
  filteredLoans.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Laporan Loan
          </h2>
          <p className="text-muted-foreground">
            Comprehensive loan report and analytics
          </p>
        </div>
        <div className="flex gap-2">

  <Button
    variant="outline"
    onClick={handleExportExcel}
    className="cursor-pointer"
  >
    <Download className="mr-2 h-4 w-4" />
    Export Excel
  </Button>

  <Button
    onClick={handleExportPDF}
    className="cursor-pointer"
  >
    <Download className="mr-2 h-4 w-4" />
    Export PDF
  </Button>

</div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="items-center pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-center">
            <p className="text-xl font-bold text-foreground">
              {filteredLoans.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="items-center pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-center">
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="items-center pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-center">
            <p className="text-xl font-bold text-primary">{activeLoans.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="items-center pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-center">
            <p className="text-xl font-bold text-status-pending-foreground">
              {formatCurrency(totalOutstanding)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="border border-border transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Loan Trend</CardTitle>
          <CardDescription>Monthly loan disbursement trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-card p-3 shadow-md">
                          <p className="font-medium text-foreground">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            Amount: {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ fill: "var(--chart-2)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="border border-border transition-all duration-300 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Loan Details</CardTitle>
          <CardDescription>All loan requests</CardDescription>
        </CardHeader>
        <CardContent>
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
  
  {/* SEARCH BOX (Tetap berada di ujung paling kiri) */}
  <div className="relative w-full sm:w-[240px]">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />
  </div>

  {/* CONTAINER GEROMBOLAN FILTER (Merapat ke ujung kanan) */}
  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
    
    {/* FILTER STATUS */}
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-[130px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="disbursed">Active</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>

    {/* FILTER BULAN */}
    <Select value={monthFilter} onValueChange={setMonthFilter}>
      <SelectTrigger className="w-full sm:w-[120px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Month</SelectItem>
        <SelectItem value="1">January</SelectItem>
        <SelectItem value="2">February</SelectItem>
        <SelectItem value="3">March</SelectItem>
        <SelectItem value="4">April</SelectItem>
        <SelectItem value="5">May</SelectItem>
        <SelectItem value="6">June</SelectItem>
        <SelectItem value="7">July</SelectItem>
        <SelectItem value="8">August</SelectItem>
        <SelectItem value="9">September</SelectItem>
        <SelectItem value="10">October</SelectItem>
        <SelectItem value="11">November</SelectItem>
        <SelectItem value="12">December</SelectItem>
      </SelectContent>
    </Select>

    {/* FILTER TAHUN */}
    <Select value={yearFilter} onValueChange={setYearFilter}>
      <SelectTrigger className="w-full sm:w-[100px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Year</SelectItem>
        <SelectItem value="2024">2024</SelectItem>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2026">2026</SelectItem>
      </SelectContent>
    </Select>

    {/* SORT */}
    <Select value={sortOrder} onValueChange={setSortOrder}>
      <SelectTrigger className="w-full sm:w-[110px]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="desc">Newest</SelectItem>
        <SelectItem value="asc">Oldest</SelectItem>
      </SelectContent>
    </Select>

  </div>
</div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tenor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans.map((loan, index) => (
                  <TableRow
  key={loan.id}
  className={`
    transition-colors
    hover:bg-slate-100

    ${
      index % 2 === 0
        ? "bg-blue-50/70"
        : "bg-white"
    }
  `}
>
                    <TableCell className="font-medium text-foreground">
                      {loan.employee_name}
                    </TableCell>
                    <TableCell className="text-foreground">{loan.title}</TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(loan.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {loan.tenor} months
                    </TableCell>
                   <TableCell>

  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium

      ${
        loan.status === "completed"
          ? "bg-green-100 text-green-700"

          : loan.status === "paid"
          ? "bg-emerald-100 text-emerald-700"

          : loan.status === "approved_hrd"
          ? "bg-yellow-100 text-yellow-700"

          : loan.status === "approved_manager"
          ? "bg-blue-100 text-blue-700"

          : loan.status === "submitten"
          ? "bg-purple-100 text-purple-700"

          : "bg-slate-100 text-slate-700"
      }
    `}
  >

    {loan.status}

  </span>

</TableCell>
                    <TableCell>

  {loan.tenor > 0 ? (

    <button
      onClick={() => {
        setSelectedLoan(loan)
        setIsModalOpen(true)
      }}
      className="cursor-pointer transition-all hover:opacity-80 hover:scale-105">

      <div className="flex items-center gap-2">

        <Progress
          value={
            (loan.paid_installments / loan.tenor) * 100
          }
          className="h-2 w-20"
        />

        <span className="text-xs text-muted-foreground">

          {loan.paid_installments}/{loan.tenor}

        </span>

      </div>

    </button>

  ) : (

    <span className="text-xs text-muted-foreground">
      -
    </span>

  )}

</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

  <div className="text-sm text-muted-foreground">

    Showing

    <span className="mx-1 font-medium text-foreground">
      {startIndex + 1}
    </span>

    to

    <span className="mx-1 font-medium text-foreground">
      {Math.min(endIndex, filteredLoans.length)}
    </span>

    of

    <span className="mx-1 font-medium text-foreground">
      {filteredLoans.length}
    </span>

    entries

  </div>

  <div className="flex items-center gap-3">

    <Select
      value={String(itemsPerPage)}
      onValueChange={(value) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
      }}
    >

      <SelectTrigger className="h-9 w-[90px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </SelectContent>

    </Select>

    <div className="flex items-center gap-1">

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

      {Array.from({
        length: totalPages,
      }).map((_, index) => {

        const page = index + 1

        return (

          <Button
            key={page}
            size="sm"
            variant={
              currentPage === page
                ? "default"
                : "outline"
            }
            onClick={() =>
              setCurrentPage(page)
            }
            className="h-9 w-9 p-0 cursor-pointer"
          >
            {page}
          </Button>
        )
      })}

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
          </div>
        </CardContent>
      </Card>
    {isModalOpen && selectedLoan && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            Loan Payment Progress
          </h2>

          <p className="text-sm text-slate-500">
            Detailed installment progress
          </p>

        </div>

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-2xl text-slate-500"
        >
          ×
        </button>

      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">

        <div>
          <p className="text-sm text-slate-500">
            Employee
          </p>

          <p className="font-semibold">
            {selectedLoan.employee_name}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Loan Title
          </p>

          <p className="font-semibold">
            {selectedLoan.title}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Amount
          </p>

          <p className="font-semibold">
            {formatCurrency(selectedLoan.amount)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Tenor
          </p>

          <p className="font-semibold">
            {selectedLoan.tenor} Months
          </p>
        </div>

      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">

        {Array.from({
          length: selectedLoan.tenor,
        }).map((_, index) => {

          const installmentNumber = index + 1

          const isPaid =
            installmentNumber <=
            selectedLoan.paid_installments

          return (

            <div
              key={installmentNumber}
              className="flex items-center justify-between rounded-xl border p-4"
            >

              <div>

                <p className="font-medium">

                  Installment #{installmentNumber}

                </p>

                <p className="text-sm text-slate-500">

                  Monthly payment installment

                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium

                  ${
                    isPaid

                      ? "bg-green-100 text-green-700"

                      : "bg-slate-100 text-slate-700"
                  }
                `}
              >

                {isPaid ? "Paid" : "Remaining"}

              </span>

            </div>
          )
        })}

      </div>

    </div>

  </div>
)}

</div>
  )
}