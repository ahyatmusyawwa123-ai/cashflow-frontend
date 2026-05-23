"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, Search, AlertCircle } from "lucide-react"
import { toast } from "sonner"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/types"
import { ApprovalStepper } from "@/components/approval-stepper"
import { Empty } from "@/components/ui/empty"

interface ApprovalQueueProps {
  role: "hrd" | "manager" | "director" | "finance"
  title: string
  description: string
}

export function ApprovalQueue({ role, title, description }: ApprovalQueueProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")
const [selectedYear, setSelectedYear] = useState("all")
  const [rejectReason, setRejectReason] = useState("")
  const [data, setData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
const [itemsPerPage, setItemsPerPage] = useState(5)
const [monthFilter, setMonthFilter] = useState("all")
const [yearFilter, setYearFilter] = useState("all")
const [sortOrder, setSortOrder] = useState("desc")

  // ✅ FETCH DATA DARI BACKEND
  useEffect(() => {
    const fetchData = async () => {
      let url = ""

      if (role === "hrd") {
  url = "http://127.0.0.1:8000/api/approval/hrd"
} else if (role === "manager") {
        url = "http://127.0.0.1:8000/api/approval/manager"
      } else if (role === "director") {
        url = "http://127.0.0.1:8000/api/approval/director"
      } else if (role === "finance") {
  url = "http://127.0.0.1:8000/api/approval/finance"
}

      try {
        const res = await fetch(url)
        const result = await res.json()

        console.log("DATA API:", result)

        setData(result)
      } catch (err) {
        console.error("ERROR FETCH:", err)
      }
    }

    fetchData()
  }, [role])

  // ✅ FILTER SEARCH SAJA (TIDAK ADA FILTER STATUS LAGI)
const pendingRequests = data
  .filter((request) => {

    const searchMatch =
      request.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||

      (request.user_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const requestDate = new Date(
      request.request_date
    )

    const month =
      String(requestDate.getMonth() + 1)

    const year =
      String(requestDate.getFullYear())

    const monthMatch =
      selectedMonth === "all" ||
      month === selectedMonth

    const yearMatch =
      selectedYear === "all" ||
      year === selectedYear

    return (
      searchMatch &&
      monthMatch &&
      yearMatch
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

  const totalPages = Math.ceil(
  pendingRequests.length / itemsPerPage
)

const startIndex =
  (currentPage - 1) * itemsPerPage

const paginatedRequests =
  pendingRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // ✅ APPROVE
  // ✅ APPROVE
const handleApprove = async (id: number) => {
  await fetch(`http://127.0.0.1:8000/api/approval/${role}/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, action: "approve" }),
  })

  toast.success("Approved")
  location.reload()
}

  // ✅ REJECT
  // ✅ REJECT
const handleReject = async (id: number) => {
  await fetch(`http://127.0.0.1:8000/api/approval/${role}/reject/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, action: "reject" }),
  })

  toast.error("Rejected")
  setRejectReason("")
  location.reload()
}

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* SEARCH */}
<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

  {/* SEARCH */}
  <div className="relative w-full sm:w-[250px]">

    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) =>
        setSearchQuery(e.target.value)
      }
      className="pl-9"
    />

  </div>

  {/* FILTER BULAN */}
  <div className="flex gap-2">
  <Select
    value={selectedMonth}
    onValueChange={setSelectedMonth}
  >

    <SelectTrigger className="w-full sm:w-[150px]">
      <SelectValue placeholder="Month" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="all">
        All Month
      </SelectItem>

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
  <Select
    value={selectedYear}
    onValueChange={setSelectedYear}
  >

    <SelectTrigger className="w-full sm:w-[120px]">
      <SelectValue placeholder="Year" />
    </SelectTrigger>

    <SelectContent>

      <SelectItem value="all">
        All Year
      </SelectItem>

      <SelectItem value="2024">
        2024
      </SelectItem>

      <SelectItem value="2025">
        2025
      </SelectItem>

      <SelectItem value="2026">
        2026
      </SelectItem>

    </SelectContent>

  </Select>
  {/* SORT */}
<Select
  value={sortOrder}
  onValueChange={setSortOrder}
>
  <SelectTrigger className="w-full sm:w-[140px]">
    <SelectValue placeholder="Sort" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="desc">
      Newest
    </SelectItem>

    <SelectItem value="asc">
      Oldest
    </SelectItem>
  </SelectContent>
</Select>
  </div>

</div>

        {/* EMPTY */}
        {pendingRequests.length === 0 ? (
          <Empty
            icon={<AlertCircle className="h-10 w-10" />}
            title="Tidak ada data"
            description="Belum ada pengajuan"
          />
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedRequests.map((item, index) => (
<TableRow
  key={item.id}
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
                    <TableCell>{item.user_name}</TableCell>

                    <TableCell>
                      <div>
                        <p>{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>

<TableCell>

  <Badge
    className={`
      rounded-full
      px-3

      ${
        item.type === "loan"
          ? "bg-blue-100 text-blue-700"

          : "bg-purple-100 text-purple-700"
      }
    `}
  >

    {item.type === "petty_cash"
      ? "PettyCash"
      : "Loan"}

  </Badge>

</TableCell>

<TableCell>
  {formatCurrency(item.amount)}
</TableCell>

<TableCell>
  {new Date(item.request_date)
    .toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
</TableCell>

                    <TableCell>
                      <Badge
  className={`
    rounded-full
    px-3
    capitalize

    ${
      item.status === "paid"
        ? "bg-green-100 text-green-700"

      : item.status === "approved_hrd"
        ? "bg-yellow-100 text-yellow-700"

      : item.status === "approved_manager"
        ? "bg-orange-100 text-orange-700"

      : item.status === "approved_director"
        ? "bg-blue-100 text-blue-700"

      : item.status === "ready_finance"
        ? "bg-purple-100 text-purple-700"

      : item.status === "submitted"
        ? "bg-slate-100 text-slate-700"

      : "bg-red-100 text-red-700"
    }
  `}
>
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {/* VIEW */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
  size="icon"
  variant="ghost"
  className="rounded-full hover:bg-slate-100"
>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>

<DialogContent className="sm:max-w-[600px]">

  <DialogHeader className="space-y-3">

    <div className="flex items-start justify-between">

      <div>
        <DialogTitle className="text-2xl">
          {item.title}
        </DialogTitle>

        <DialogDescription>
          Request ID #{item.id}
        </DialogDescription>
      </div>

      <Badge
        className={
          item.type === "loan"
            ? "bg-blue-100 text-blue-700"
            : "bg-purple-100 text-purple-700"
        }
      >
        {item.type === "loan"
          ? "Loan"
          : "PettyCash"}
      </Badge>

    </div>

    <div className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3">

      <div>
        <p className="text-sm text-muted-foreground">
          Total Amount
        </p>

        <h3 className="text-2xl font-bold">
          {formatCurrency(item.amount)}
        </h3>
      </div>

      <Badge
        className={`
          px-3 py-1 capitalize

          ${
            item.status === "paid"
              ? "bg-green-100 text-green-700"

            : item.status === "approved_hrd"
              ? "bg-yellow-100 text-yellow-700"

            : item.status === "approved_manager"
              ? "bg-orange-100 text-orange-700"

            : item.status === "approved_director"
              ? "bg-blue-100 text-blue-700"

            : item.status === "ready_finance"
              ? "bg-purple-100 text-purple-700"

            : "bg-slate-100 text-slate-700"
          }
        `}
      >
        {item.status}
      </Badge>

    </div>

  </DialogHeader>

  {/* DETAIL GRID */}
  <div className="grid grid-cols-2 gap-4 rounded-xl border p-4">

    <div>
      <p className="text-sm text-muted-foreground">
        Employee
      </p>

      <p className="font-medium">
        {item.user_name}
      </p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">
        Date
      </p>

      <p className="font-medium">
        {new Date(item.request_date)
          .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
      </p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">
        Description
      </p>

      <p className="font-medium">
        {item.description}
      </p>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">
        Current Step
      </p>

      <p className="font-medium capitalize">
        {item.current_step}
      </p>
    </div>

  </div>

  {/* APPROVAL */}
  <div className="space-y-3">

    <div>
      <h4 className="font-semibold">
        Approval Progress
      </h4>

      <p className="text-sm text-muted-foreground">
        Current approval workflow status
      </p>
    </div>

    <ApprovalStepper
      amount={item.amount}
      currentStatus={item.status}
    />

  </div>

</DialogContent>  
                        </Dialog>

                        {/* APPROVE */}
                        {(
  (role === "hrd" && item.status === "submitted") ||
  (role === "manager" && item.status === "approved_hrd") ||
  (role === "director" && item.status === "approved_manager")
) && (
                          <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Lanjut ke tahap berikutnya
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleApprove(item.id)}
                              >
                                Approve
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {/* REJECT */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject</DialogTitle>
                            </DialogHeader>

                            <Textarea
                              placeholder="Alasan..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />

                            <Button
                              variant="destructive"
                              onClick={() => handleReject(item.id)}
                            >
                              Reject
                            </Button>
                          </DialogContent>
                        </Dialog>
                        </>
                        )}
                      </div>
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
      {Math.min(
        startIndex + itemsPerPage,
        pendingRequests.length
      )}
    </span>

    of

    <span className="mx-1 font-medium text-foreground">
      {pendingRequests.length}
    </span>

    entries

  </div>

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
          className="h-9 w-9 p-0"
        >
          {page}
        </Button>
      )
    })}

    <Button
      variant="outline"
      size="sm"
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
        )}
      </CardContent>
    </Card>
  )
}