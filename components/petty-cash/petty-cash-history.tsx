"use client"

import { useEffect, useState } from "react"
import { Search, Upload, Download, FileText, Eye } from "lucide-react"
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
import type { ApprovalStatus, PettyCashRequest } from "@/lib/types"
import { ApprovalStepper } from "@/components/approval-stepper"
import { toast } from "sonner"

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
function getProgressValue(status: string) {

  switch (status) {

    case "submitted":
      return 20

    case "approved_hrd":
      return 40

    case "approved_manager":
      return 60

    case "approved_director":
      return 80

    case "paid":
    case "completed":
    case "disbursed":
      return 100

    default:
      return 10
  }
}

function RequestDetailModal({ request }: { request: PettyCashRequest }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 w-9 rounded-lg border border-border hover:bg-blue-100 cursor-pointer">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
<DialogHeader className="border-b px-6 py-5 bg-muted/30">
  <DialogTitle className="text-xl font-bold">
    {request.title}
  </DialogTitle>

  <DialogDescription className="text-sm text-muted-foreground">
    Request ID: {request.id} • {formatDate(request.request_date)}
  </DialogDescription>
</DialogHeader>
        <div className="space-y-6 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(request.amount)}
                <div className="mt-5">
  <p className="text-sm text-muted-foreground mb-1">
    Description
  </p>

  <p className="text-sm text-foreground">
    {request.description}
  </p>
</div>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
<Badge
  className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${
    request.status === "paid"
      ? "bg-green-100 text-green-700 shadow-sm"

      : request.status === "approved_hrd"
      ? "bg-yellow-100 text-yellow-700 shadow-sm"

      : request.status === "approved_manager"
      ? "bg-blue-100 text-blue-700 shadow-sm"

      : request.status === "approved_director"
      ? "bg-indigo-100 text-indigo-700 shadow-sm"

      : request.status === "completed"
      ? "bg-red-100 text-red-700 shadow-sm"

      : request.status === "rejected"
      ? "bg-red-100 text-red-700 shadow-sm"

      : "bg-gray-100 text-gray-700 shadow-sm"
  }`}
>
  {getStatusLabel(request.status)}
</Badge>
{request.transfer_proof && (
  <div className="mt-4">
    <p className="text-sm font-medium mb-2">
      Bukti Transfer
    </p>

    <a
      href={request.transfer_proof}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer"
    >
      📄 Lihat Bukti Transfer
    </a>
  </div>
)}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-4">Approval Progress</p>
            <ApprovalStepper
              amount={request.amount}
              currentStatus={request.status}
            />
          </div>
          {request.transfer_proof && (
            <div className="rounded-2xl border bg-blue-50/50 p-4 text-center">
              <p className="text-sm font-medium text-foreground mb-2">
                Transfer Proof Available
              </p>
              <a
  href={request.transfer_proof}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    variant="outline"
    size="sm"
    className="rounded-xl cursor-pointer"
  >
    <Download className="mr-2 h-4 w-4" />
    Download Bukti Transfer
  </Button>
</a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function PettyCashHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [requests, setRequests] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
const [rowsPerPage, setRowsPerPage] = useState(5)
const [uploadOpen, setUploadOpen] = useState(false)

const [selectedRequestId, setSelectedRequestId] =
  useState<string | null>(null)

const [selectedFile, setSelectedFile] =
  useState<File | null>(null)
useEffect(() => {
  fetch(
    "https://anyone-tinker-electable.ngrok-free.dev/api/petty-cash",
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("PETTY CASH DATA =", data)
      setRequests(data)
    })
    .catch((err) => {
      console.log("FETCH ERROR =", err)
    })
}, [])
const filteredRequests = requests.filter((request) => {

const matchesSearch =
  (request.title || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||

  (request.employee_name || "")
    .toLowerCase()
    .includes(searchQuery.toLowerCase())

  const matchesStatus =
    statusFilter === "all" ||
    request.status === statusFilter

  return matchesSearch && matchesStatus

})

const totalPages = Math.ceil(
  filteredRequests.length / rowsPerPage
)

const startIndex =
  (currentPage - 1) * rowsPerPage

const paginatedRequests =
  filteredRequests.slice(
    startIndex,
    startIndex + rowsPerPage
  )
const handleUploadProof = async () => {

  if (!selectedFile || !selectedRequestId) {

    toast.error("Please select PDF file")

    return
  }

  try {

    const formData = new FormData()

    formData.append(
      "usage_proof",
      selectedFile
    )

    const response = await fetch(

      `https://anyone-tinker-electable.ngrok-free.dev/api/petty-cash/${selectedRequestId}/upload-usage-proof`,

      {
        method: "POST",
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {

      toast.error(data.message || "Upload gagal")

      return
    }

    toast.success(
      "Bukti berhasil diupload"
    )

    // refresh data
const refresh = await fetch(
  "https://anyone-tinker-electable.ngrok-free.dev/api/petty-cash",
  {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  }
)
    const refreshData = await refresh.json()

    setRequests(refreshData)

    setUploadOpen(false)

    setSelectedFile(null)

    setSelectedRequestId(null)

  } catch (error) {

    console.error(error)

    toast.error("Terjadi kesalahan")
  }
}

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Riwayat Petty Cash</CardTitle>
        <CardDescription>View and manage your petty cash requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
<div className="flex items-center gap-2">

  <div className="relative w-full sm:w-[260px]">

    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

    <Input
      placeholder="Search by title or name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />

  </div>

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
              <SelectItem value="ready_finance">Ready for Finance</SelectItem>
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"> Progres</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No requests found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request, index) => (
                  <TableRow
  key={request.id}
  className={`hover:bg-blue-50 transition-colors ${
    index % 2 === 0
      ? "bg-blue-50/70"
      : "bg-white"
  }`}
>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {request.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.employee_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatCurrency(request.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(request.request_date)}
                    </TableCell>
                    <TableCell>
<Badge
  className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${
    request.status === "paid"
      ? "bg-green-100 text-green-700"

      : request.status === "approved_hrd"
      ? "bg-yellow-100 text-yellow-700"

      : request.status === "approved_manager"
      ? "bg-blue-100 text-blue-700"

      : request.status === "approved_director"
      ? "bg-indigo-100 text-indigo-700"

      : request.status === "completed"
      ? "bg-red-100 text-red-700"

      : request.status === "rejected"
      ? "bg-red-100 text-red-700"

      : "bg-gray-100 text-gray-700"
  }`}
>
  {getStatusLabel(request.status)}
</Badge>
                    </TableCell>
<TableCell>

  <div className="flex items-center gap-2">

<div className="w-[100px] h-2 rounded-full bg-muted overflow-hidden">

  <div
    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
    style={{
      width: `${getProgressValue(request.status)}%`,
    }}
  />

</div>

    <span className="text-xs font-medium text-muted-foreground">

      {request.status === "completed" ||
      request.status === "paid"
        ? "Complete"

        : `${getProgressValue(request.status)}%`}
    </span>

  </div>

</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <RequestDetailModal request={request} />
                        {!request.usage_proof &&
                          request.status !== "rejected" &&
                          request.status !== "disbursed" && (
                            <Button
                              className="h-9 w-9 rounded-lg border border-border hover:bg-blue-100 cursor-pointer"
                              onClick={() => {

  setSelectedRequestId(request.id)

  setUploadOpen(true)

}}
                            >
                              <Upload className="h-4 w-4" />
                              <span className="sr-only">Upload proof</span>
                            </Button>
                          )}
                        {request.proofUrl && (
                          <Button className="h-9 w-9 rounded-lg border border-border hover:bg-blue-100 cursor-pointer">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download proof</span>
                          </Button>
                        )}
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
      filteredRequests.length
    )}{" "}
    of {filteredRequests.length} entries
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
<Dialog
  open={uploadOpen}
  onOpenChange={setUploadOpen}
>

  <DialogContent className="sm:max-w-md">

    <DialogHeader>

      <DialogTitle>
        Upload Bukti Penggunaan
      </DialogTitle>

      <DialogDescription>
        Upload file PDF bukti penggunaan dana
      </DialogDescription>

    </DialogHeader>

    <div className="space-y-4">

      <Input
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => {

          const file = e.target.files?.[0]

          if (!file) return

          if (file.type !== "application/pdf") {

            toast.error("Only PDF file allowed")

            return
          }

          setSelectedFile(file)
        }}
      />

      {selectedFile && (

        <div className="rounded-lg border p-3 text-sm">

          <p className="font-medium">
            {selectedFile.name}
          </p>

          <p className="text-muted-foreground text-xs">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>

        </div>

      )}

      <Button
        className="w-full cursor-pointer"
        onClick={handleUploadProof}
      >
        Upload PDF
      </Button>

    </div>

  </DialogContent>

</Dialog>
      </CardContent>
    </Card>
  )
}
