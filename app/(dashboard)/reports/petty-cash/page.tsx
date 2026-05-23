"use client"

import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver"
import { Download, Search, Calendar } from "lucide-react"
import {
  Bar,
  BarChart,
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

import { formatCurrency, formatDate, getStatusColor } from "@/lib/types"
import ApprovalStepper from "@/components/approval/approval-stepper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function getRealtimeStatusColor(status: string): string {
  const colors: Record<string, string> = {
    submitted:
      "bg-yellow-100 text-yellow-700 border-yellow-200",

    approved_hrd:
      "bg-blue-100 text-blue-700 border-blue-200",

    approved_manager:
      "bg-indigo-100 text-indigo-700 border-indigo-200",

    approved_director:
      "bg-purple-100 text-purple-700 border-purple-200",

    ready_finance:
      "bg-cyan-100 text-cyan-700 border-cyan-200",

    disbursed:
      "bg-green-100 text-green-700 border-green-200",

    paid:
      "bg-green-100 text-green-700 border-green-200",

    rejected:
      "bg-red-100 text-red-700 border-red-200",
  }

  return (
    colors[status] ||
    "bg-gray-100 text-gray-700 border-gray-200"
  )
}
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    approved_hrd: "HRD Approved",
    approved_manager: "Manager Approved",
    approved_director: "Director Approved",
    ready_finance: "Ready for Finance",
    disbursed: "Disbursed",
    paid: "Paid",
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
const steps = [
  "Submitted",
  "HRD Approved",
  "Manager Approved",
  "Director Approved",
  "Ready Finance",
  "Paid",
]

export default function PettyCashReportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [requests, setRequests] = useState<any[]>([])
const [monthlyData, setMonthlyData] = useState<any[]>([])
const [selectedRequest, setSelectedRequest] = useState<any>(null)
const [openModal, setOpenModal] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState(5)
const [monthFilter, setMonthFilter] = useState("all")
const [yearFilter, setYearFilter] = useState("all")
const [sortOrder, setSortOrder] = useState("desc")
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/petty-cash-report")
    .then((res) => res.json())
    .then((data) => {
      setRequests(data)

      // MONTHLY CHART
      const grouped = data.reduce((acc: any, item: any) => {
        const month = new Date(item.request_date).toLocaleString("default", {
  month: "short",
})

        if (!acc[month]) {
          acc[month] = 0
        }

        acc[month] += Number(item.amount)

        return acc
      }, {})

      const formatted = Object.keys(grouped).map((month) => ({
        month,
        amount: grouped[month],
      }))

      setMonthlyData(formatted)
    })
}, [])

const filteredRequests = requests
  .filter((request) => {

    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employee_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      request.status === statusFilter

    const requestDate = new Date(request.request_date)

    const requestMonth =
      String(requestDate.getMonth() + 1)

    const requestYear =
      String(requestDate.getFullYear())

    const matchesMonth =
      monthFilter === "all" ||
      requestMonth === monthFilter

    const matchesYear =
      yearFilter === "all" ||
      requestYear === yearFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMonth &&
      matchesYear
    )
  })

  .sort((a, b) => {

    const dateA =
      new Date(a.request_date).getTime()

    const dateB =
      new Date(b.request_date).getTime()

    return sortOrder === "asc"
      ? dateA - dateB
      : dateB - dateA
  })

  const totalAmount = filteredRequests.reduce(
  (sum, r) => sum + Number(r.amount),
  0
)
  const disbursedAmount = filteredRequests
  .filter(
    (r) =>
      r.status === "disbursed" ||
      r.status === "ready_finance" ||
      r.status === "paid"
  )
  .reduce((sum, r) => sum + Number(r.amount), 0)
  const totalPages = Math.ceil(
  filteredRequests.length / itemsPerPage
)

const startIndex =
  (currentPage - 1) * itemsPerPage

const endIndex =
  startIndex + itemsPerPage

const paginatedRequests =
  filteredRequests.slice(startIndex, endIndex)
  const exportToExcel = () => {

  const exportData = filteredRequests.map((item) => ({
    Employee: item.employee_name,
    Title: item.title,
    Amount: item.amount,
    Status: getStatusLabel(item.status),
    Date: item.request_date,
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Petty Cash Report"
  )

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  )

  saveAs(fileData, "petty-cash-report.xlsx")
}

const exportToPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    "Petty Cash Report",
    14,
    20
  )

  doc.setFontSize(11)

  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    28
  )

  autoTable(doc, {
    startY: 35,

    head: [[
      "Employee",
      "Title",
      "Amount",
      "Status",
      "Date",
    ]],

    body: filteredRequests.map((item) => [
      item.employee_name,
      item.title,
      formatCurrency(item.amount),
      getStatusLabel(item.status),
      formatDate(item.request_date),
    ]),

    styles: {
      fontSize: 10,
    },

    headStyles: {
      fillColor: [37, 99, 235],
    },
  })

  doc.save("petty-cash-report.pdf")
}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Laporan Petty Cash
          </h2>
          <p className="text-muted-foreground">
            Comprehensive petty cash report and analytics
          </p>
        </div>
        <div className="flex gap-2">

  <Button
    variant="outline"
    onClick={exportToExcel}
    className="cursor-pointer"
  >
    <Download className="mr-2 h-4 w-4 cursor-pointer" />
    Export Excel
  </Button>

  <Button
    onClick={exportToPDF}
    className="cursor-pointer"
  >
    <Download className="mr-2 h-4 w-4" />
    Export PDF
  </Button>

</div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {filteredRequests.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disbursed Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(disbursedAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Distribution</CardTitle>
          <CardDescription>Petty cash requests by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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
                <Bar
  dataKey="amount"
  fill="#2563eb"
  radius={[8, 8, 0, 0]}
  barSize={60}
/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Request Details</CardTitle>
          <CardDescription>All petty cash requests</CardDescription>
        </CardHeader>
<CardContent>
  {/* Wrapper luar tetap justify-between untuk memisahkan Search (kiri) dan Kumpulan Filter (kanan) */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
    
    {/* 1. Kolom Search (Tetap Mandiri di Sebelah Kiri) */}
    <div className="relative w-full sm:w-[240px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>

    {/* 2. Kelompok Filter (Dibungkus div baru agar berkumpul rapat di Sebelah Kanan) */}
    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end">
      
      {/* Filter Status */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="disbursed">Disbursed</SelectItem>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progres</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request, index) => (
                  <TableRow
  key={request.id}
  className={`
    cursor-pointer
    transition-colors
    hover:bg-slate-100

    ${
      index % 2 === 0
        ? "bg-blue-50/70"
        : "bg-white"
    }
  `}
  onClick={() => {
    setSelectedRequest(request)
    setOpenModal(true)
  }}
>
                    <TableCell className="font-medium text-foreground">
                      {request.employee_name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {request.title}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(request.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(request.request_date)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRealtimeStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
<TableCell>
  <div className="w-32">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full"
        style={{
          width: `${
            ((steps.indexOf(
              getStatusLabel(request.status)
            ) + 1) /
              steps.length) *
            100
          }%`,
        }}
      />
    </div>

    <p className="text-xs text-muted-foreground mt-1">
      {steps.indexOf(
        getStatusLabel(request.status)
      ) + 1}
      /{steps.length} Step
    </p>
  </div>
</TableCell>

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
      {Math.min(endIndex, filteredRequests.length)}
    </span>

    of

    <span className="mx-1 font-medium text-foreground">
      {filteredRequests.length}
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
      <Dialog
  open={openModal}
  onOpenChange={setOpenModal}
>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>
        Approval Timeline
      </DialogTitle>
    </DialogHeader>

    {selectedRequest && (
      <div className="space-y-4">

        <div>
          <h3 className="font-semibold text-lg">
            {selectedRequest.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {formatCurrency(selectedRequest.amount)}
          </p>
        </div>

        <ApprovalStepper
          currentStep={
            getStatusLabel(selectedRequest.status)
          }
        />

      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  )
}
