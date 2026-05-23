"use client"

import { useEffect, useState } from "react"
import { Download, Search, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
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
import { formatCurrency } from "@/lib/types"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Only show disbursed loans


// Generate installment schedule for each loan




export default function InstallmentsReportPage() {
  const [data, setData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)

const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState(5)
  useEffect(() => {
  fetch("https://anyone-tinker-electable.ngrok-free.dev/installments")
    .then((res) => res.json())
    .then((res) => setData(res))
}, [])

  const handlePay = async (id: number) => {
  await fetch(`https://anyone-tinker-electable.ngrok-free.dev/installments/${id}/pay`, {
    method: "PUT",
  })

  // refresh data
  fetch("https://anyone-tinker-electable.ngrok-free.dev/installments")
    .then((res) => res.json())
    .then((res) => setData(res))
}

const groupedLoans = Object.values(
  data.reduce((acc: any, item: any) => {

    if (!acc[item.loan_id]) {
      acc[item.loan_id] = {
        loan_id: item.loan_id,
        employee_name: item.employee_name,
        title: item.title,
        installments: [],
      }
    }

    acc[item.loan_id].installments.push(item)

    return acc

  }, {})
)

const filteredLoans = groupedLoans.filter((loan: any) => {

  const matchesSearch =
    loan.employee_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||

    loan.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

  if (statusFilter === "all") {
    return matchesSearch
  }

  const hasStatus = loan.installments.some(
    (i: any) => i.status === statusFilter
  )

  return matchesSearch && hasStatus
})
const totalPages = Math.ceil(
  filteredLoans.length / itemsPerPage
)

const startIndex =
  (currentPage - 1) * itemsPerPage

const paginatedLoans =
  filteredLoans.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const paidInstallments = data.filter((i) => i.status === "paid")
  const dueInstallments = data.filter((i) => i.status === "due")
  const overdueInstallments = data.filter(
  (i) => i.status === "overdue"
)
  const totalCollected = paidInstallments.reduce((sum, i) => sum + i.amount, 0)
  const totalDue = dueInstallments.reduce((sum, i) => sum + i.amount, 0)
  const activeLoans = [
  ...new Set(
    data
      .filter((i) => i.loan_status !== "completed")
      .map((i) => i.loan_id)
  ),
]

const completedLoans = [
  ...new Set(
    data
      .filter((i) => i.loan_status === "completed")
      .map((i) => i.loan_id)
  ),
]
const exportToExcel = () => {

const exportData = filteredLoans.map((loan: any) => ({

  Employee: loan.employee_name,

  Loan: loan.title,

  TotalInstallment: loan.installments.length,

  Paid:
    loan.installments.filter(
      (i: any) => i.status === "paid"
    ).length,

  Remaining:
    loan.installments
      .filter((i: any) => i.status !== "paid")
      .reduce(
        (sum: number, i: any) => sum + i.amount,
        0
      ),
}))

  const worksheet = XLSX.utils.json_to_sheet(exportData)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Installments"
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

  saveAs(fileData, "installment-report.xlsx")
}
const exportToPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(18)

  doc.text(
    "Installment Report",
    14,
    20
  )

autoTable(doc, {
  startY: 30,

  head: [[
    "Employee",
    "Loan",
    "Total Installment",
    "Paid",
    "Remaining",
  ]],

  body: filteredLoans.map((loan: any) => [

    loan.employee_name,

    loan.title,

    loan.installments.length,

    loan.installments.filter(
      (i: any) => i.status === "paid"
    ).length,

    formatCurrency(
      loan.installments
        .filter((i: any) => i.status !== "paid")
        .reduce(
          (sum: number, i: any) => sum + i.amount,
          0
        )
    ),

  ]),
})

doc.save("installment-report.pdf")
}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Angsuran Loan
          </h2>
          <p className="text-muted-foreground">
            Track and manage loan installment payments
          </p>
        </div>
        <div className="flex gap-2">

  <Button
    variant="outline"
    onClick={exportToExcel}
  >
    <Download className="mr-2 h-4 w-4" />
    Export Excel
  </Button>

  <Button
    onClick={exportToPDF}
  >
    <Download className="mr-2 h-4 w-4" />
    Export PDF
  </Button>

</div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  <CardContent className="flex flex-col items-center justify-center text-center p-6">

    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <span>Paid Installments</span>
    </div>

    <h2 className="text-3xl font-bold text-slate-900">
      {paidInstallments.length}
    </h2>

  </CardContent>
</Card>
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  <CardContent className="flex flex-col items-center justify-center text-center p-6">

    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
      <Clock className="h-4 w-4 text-amber-500" />
      <span>Due This Month</span>
    </div>

    <h2 className="text-3xl font-bold text-slate-900">
      {dueInstallments.length}
    </h2>

  </CardContent>
</Card>
<Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  <CardContent className="flex flex-col items-center justify-center text-center p-6">

    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <span>Overdue</span>
    </div>

    <h2 className="text-3xl font-bold text-red-600">
      {overdueInstallments.length}
    </h2>

  </CardContent>
</Card>
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  <CardContent className="flex flex-col items-center justify-center text-center p-6">

    <div className="text-sm text-slate-500 mb-4 text-center">
      Total Collected
    </div>

    <h2 className="text-2xl font-bold text-green-700">
      {formatCurrency(totalCollected)}
    </h2>

  </CardContent>
</Card>
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  <CardContent className="flex flex-col items-center justify-center text-center p-6">

    <div className="text-sm text-slate-500 mb-4 text-center">
      Amount Due
    </div>

    <h2 className="text-3xl font-bold text-amber-700">
      {formatCurrency(totalDue)}
    </h2>

  </CardContent>
</Card>
      </div>

<div className="grid gap-4 md:grid-cols-2">

  {/* LEFT CARD */}
  <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

    <CardContent className="grid grid-cols-2 gap-6 py-6">

      <div className="text-center">

        <p className="text-sm text-slate-500 mb-2">
          Active Loans
        </p>

        <h2 className="text-3xl font-bold text-blue-600">
          {activeLoans.length}
        </h2>

      </div>

      <div className="text-center">

        <p className="text-sm text-slate-500 mb-2">
          Completed Loans
        </p>

        <h2 className="text-3xl font-bold text-green-600">
          {completedLoans.length}
        </h2>

      </div>

    </CardContent>

  </Card>

  {/* RIGHT CARD */}
  <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

    <CardContent className="grid grid-cols-2 gap-6 py-6">

      <div className="text-center">

        <p className="text-sm text-slate-500 mb-2">
          Success Rate
        </p>

        <h2 className="text-3xl font-bold text-purple-600">

          {Math.round(
            (
              completedLoans.length /
              (activeLoans.length + completedLoans.length || 1)
            ) * 100
          )}%

        </h2>

      </div>

      <div className="text-center">

        <p className="text-sm text-slate-500 mb-2">
          Total Installments
        </p>

        <h2 className="text-3xl font-bold text-orange-600">
          {data.length}
        </h2>

      </div>

    </CardContent>

  </Card>

</div>

      {/* Active Loans Overview */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
  <CardHeader className="pb-4">
    <CardTitle className="text-2xl font-semibold tracking-tight">
      Active Loans Summary
    </CardTitle>

    <CardDescription className="text-slate-500">
      Overview of active loan repayments
    </CardDescription>
  </CardHeader>

  <CardContent className="grid gap-4 md:grid-cols-2">

    {activeLoans.map((loanId) => {

      const loanInstallments = data.filter(
        (i) => i.loan_id === loanId
      )

      const paidCount = loanInstallments.filter(
        (i) => i.status === "paid"
      ).length

      const totalCount = loanInstallments.length

      const progress = (paidCount / totalCount) * 100

      const firstLoan = loanInstallments[0]

      const remaining =
        loanInstallments
          .filter((i) => i.status !== "paid")
          .reduce((sum, i) => sum + i.amount, 0)
const hasOverdue = loanInstallments.some(
  (i) => i.status === "overdue"
)
      return (
        <div
          key={loanId}
          className="rounded-xl border border-slate-200 bg-slate-50/40 p-4"
        >

          <div className="flex items-start justify-between mb-4">

            <div>
              <h3 className="font-semibold text-slate-900">
                {firstLoan.employee_name}
              </h3>

              <p className="text-sm text-slate-500">
                {firstLoan.title}
              </p>
            </div>

            <div className="text-right">
              <p className="text-base font-semibold text-slate-900">
                {formatCurrency(firstLoan.amount)}/month
              </p>

              <p className="text-sm text-slate-500">
                Remaining: {formatCurrency(remaining)}
              </p>
            </div>

          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">

  <div
    className={`h-full rounded-full transition-all duration-500

      ${
        progress >= 100
          ? "bg-gradient-to-r from-green-400 to-green-600"

          : hasOverdue
          ? "bg-gradient-to-r from-red-400 to-red-600"

          : "bg-gradient-to-r from-blue-400 to-blue-600"
      }
    `}
    style={{
      width: `${progress}%`,
    }}
  />

</div>

          <div className="mt-2 text-right text-sm text-slate-500">
            {paidCount}/{totalCount} paid
          </div>

        </div>
      )
    })}

  </CardContent>
</Card>

      {/* Installment Schedule Table */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight">Installment Schedule</CardTitle>
          <CardDescription className="text-slate-500">Detailed payment schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or loan title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("paid")}
              >
                Paid
              </Button>
              <Button
                variant={statusFilter === "due" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("due")}
              >
                Due
              </Button>
              <Button
                variant={statusFilter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("upcoming")}
              >
                Upcoming
              </Button>
              <Button
  variant={statusFilter === "overdue" ? "default" : "outline"}
  size="sm"
  onClick={() => setStatusFilter("overdue")}
>
  Overdue
</Button>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader>
  <TableRow className="bg-muted/50">
    <TableHead>Employee</TableHead>
    <TableHead>Loan</TableHead>
    <TableHead>Total Installment</TableHead>
    <TableHead>Paid</TableHead>
    <TableHead>Remaining</TableHead>
    <TableHead>Status</TableHead>
    <TableHead>Action</TableHead>
  </TableRow>
</TableHeader>
<TableBody>

  {paginatedLoans.map((loan: any, index) => {

    const totalInstallment =
      loan.installments.length

    const paidInstallment =
      loan.installments.filter(
        (i: any) => i.status === "paid"
      ).length

    const remaining = 
      loan.installments.filter(
        (i: any) => i.status !== "paid"
      ).reduce(
        (sum: number, i: any) => sum + i.amount,
        0
      )
      

    const hasOverdue =
      loan.installments.some(
        (i: any) => i.status === "overdue"
      )

    return (

<TableRow
  key={loan.loan_id}
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

        <TableCell className="font-medium">
          {loan.employee_name}
        </TableCell>

        <TableCell>
          {loan.title}
        </TableCell>

        <TableCell>
          {totalInstallment}
        </TableCell>

        <TableCell>
          {paidInstallment}/{totalInstallment}
        </TableCell>

        <TableCell>
          {formatCurrency(remaining)}
        </TableCell>

        <TableCell>

          <Badge
            className={
              hasOverdue
                ? "bg-red-100 text-red-700"

                : paidInstallment === totalInstallment
                ? "bg-green-100 text-green-700"

                : "bg-yellow-100 text-yellow-700"
            }
          >
            {
              hasOverdue
                ? "Overdue"

                : paidInstallment === totalInstallment
                ? "Completed"

                : "Active"
            }
          </Badge>

        </TableCell>

        <TableCell>

          <Button
            size="sm"
            onClick={() => {
              setSelectedLoan(loan)
              setIsModalOpen(true)
            }}
          >
            Detail
          </Button>

        </TableCell>

      </TableRow>
    )
  })}

</TableBody>
            </Table>
          </div>
          <div className="mt-6 flex items-center justify-between">

  <p className="text-sm text-slate-500">
    Showing{" "}
    {startIndex + 1}
    {" "}to{" "}
    {Math.min(
      startIndex + itemsPerPage,
      filteredLoans.length
    )}{" "}
    of {filteredLoans.length} entries
  </p>

  <div className="flex items-center gap-3">
<Select
  value={itemsPerPage.toString()}
  onValueChange={(value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }}
>
  <SelectTrigger className="w-[80px]">
    <SelectValue />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="5">5</SelectItem>
    <SelectItem value="10">10</SelectItem>
    <SelectItem value="20">20</SelectItem>
  </SelectContent>
</Select>
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(currentPage - 1)
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
          variant={
            currentPage === i + 1
              ? "default"
              : "outline"
          }
          onClick={() =>
            setCurrentPage(i + 1)
          }
          className="w-9"
        >
          {i + 1}
        </Button>
      )
    )}

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage(currentPage + 1)
      }
    >
      Next
    </Button>

  </div>

</div>
        </CardContent>

      </Card>
{isModalOpen && selectedLoan && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            {selectedLoan.title}
          </h2>

          <p className="text-slate-500">
            {selectedLoan.employee_name}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-2xl"
        >
          ×
        </button>

      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">

        {selectedLoan.installments.map((item: any) => {

          const dueDate = new Date(item.created_at)

          dueDate.setMonth(
            dueDate.getMonth() +
            (item.installment_no - 1)
          )

          return (

            <div
              key={item.id}
              className="rounded-xl border p-4"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-semibold">
                    Installment #{item.installment_no}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {dueDate.toLocaleDateString("id-ID")}
                  </p>

                  <p className="mt-1 font-medium">
                    {formatCurrency(item.amount)}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <Badge
                    className={
                      item.status === "paid"
                        ? "bg-green-100 text-green-700"

                        : item.status === "overdue"
                        ? "bg-red-100 text-red-700"

                        : item.status === "due"
                        ? "bg-yellow-100 text-yellow-700"

                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {item.status}
                  </Badge>

                  {item.status !== "paid" && (

                    <Button
                      size="sm"
                      onClick={async () => {

                        await handlePay(item.id)

                        const refreshed =
                          await fetch(
                            "https://anyone-tinker-electable.ngrok-free.dev/installments"
                          ).then((res) => res.json())

                        setData(refreshed)

                        const updatedLoan =
                          Object.values(
                            refreshed.reduce(
                              (acc: any, inst: any) => {

                                if (!acc[inst.loan_id]) {

                                  acc[inst.loan_id] = {
                                    loan_id: inst.loan_id,
                                    employee_name: inst.employee_name,
                                    title: inst.title,
                                    installments: [],
                                  }
                                }

                                acc[inst.loan_id]
                                  .installments
                                  .push(inst)

                                return acc

                              },
                              {}
                            )
                          ).find(
                            (l: any) =>
                              l.loan_id === selectedLoan.loan_id
                          )

                        setSelectedLoan(updatedLoan)

                      }}
                    >
                      Bayar
                    </Button>

                  )}

                </div>

              </div>

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
