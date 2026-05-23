"use client";

import { useEffect, useState } from "react";
import { Search, Upload, CheckCircle2, Eye, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function FinancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const [monthFilter, setMonthFilter] = useState("all");
const [yearFilter, setYearFilter] = useState("all");

const [itemsPerPage, setItemsPerPage] = useState(5);
const [sortOrder, setSortOrder] = useState("desc")
const [openUploadId, setOpenUploadId] = useState<number | null>(null);

  // 🔥 FETCH DATA BACKEND
const fetchData = async () => {
  const res = await fetch(
    "https://anyone-tinker-electable.ngrok-free.dev/api/approval/finance"
  );

  const result = await res.json();

  setData(result);
};

useEffect(() => {
  fetchData();
}, []);

  // 🔥 FILTER SEARCH
const filtered = data
  .filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((item) => {
    const date = new Date(item.request_date);

    const month = date.toLocaleString("id-ID", {
      month: "long",
    });

    const year = String(date.getFullYear());

    const matchMonth =
      monthFilter === "all" ||
      month.toLowerCase() === monthFilter;

    const matchYear =
      yearFilter === "all" ||
      year === yearFilter;

    return matchMonth && matchYear;
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

  // 🔥 UPLOAD + CAIRKAN
const handleConfirm = async (id: number) => {

if (!id) {
  toast.error("Data tidak ditemukan!");
  return;
}

  if (!file) {
    toast.error("Upload bukti transfer dulu!");
    return;
  }

  try {

    const formData = new FormData();

    formData.append(
      "transfer_proof",
      file
    );

await fetch(
  `https://anyone-tinker-electable.ngrok-free.dev/api/approval/finance/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

toast.success(
  "Dana berhasil dicairkan!"
);

setFile(null);

setOpenUploadId(null);

await fetchData();

  } catch (err) {

    toast.error(
      "Gagal mencairkan dana"
    );

    console.error(err);

  }

};

const totalPages = Math.ceil(
  filtered.length / itemsPerPage
);

const paginatedData = filtered.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">Finance Dashboard</h2>
        <p className="text-muted-foreground">
          Process approved requests and manage disbursements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ready for Disbursement</CardTitle>
          <CardDescription>
            Approved requests waiting for fund transfer
          </CardDescription>
        </CardHeader>

        <CardContent>

          {/* SEARCH */}
<div className="mb-6 flex items-center justify-between gap-4">
  
  {/* SEARCH */}
  <div className="relative w-full max-w-[260px]">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />
  </div>

  {/* FILTER */}
  <div className="flex items-center gap-3">

    <Select
      value={monthFilter}
      onValueChange={setMonthFilter}
    >
      <SelectTrigger className="w-[150px] cursor-pointer">
        <SelectValue placeholder="Month" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Month
        </SelectItem>

        <SelectItem value="januari">Januari</SelectItem>
        <SelectItem value="februari">Februari</SelectItem>
        <SelectItem value="maret">Maret</SelectItem>
        <SelectItem value="april">April</SelectItem>
        <SelectItem value="mei">Mei</SelectItem>
        <SelectItem value="juni">Juni</SelectItem>
        <SelectItem value="juli">Juli</SelectItem>
        <SelectItem value="agustus">Agustus</SelectItem>
        <SelectItem value="september">September</SelectItem>
        <SelectItem value="oktober">Oktober</SelectItem>
        <SelectItem value="november">November</SelectItem>
        <SelectItem value="desember">Desember</SelectItem>
      </SelectContent>
    </Select>

    <Select
      value={yearFilter}
      onValueChange={setYearFilter}
    >
      <SelectTrigger className="w-[120px] cursor-pointer">
        <SelectValue placeholder="Year" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Year
        </SelectItem>

        <SelectItem value="2024">2024</SelectItem>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2026">2026</SelectItem>
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

          {/* TABLE */}
          {filtered.length === 0 ? (
            <p>Tidak ada data</p>
          ) : (
          
          <>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

<TableBody>
{paginatedData.map((item, index) => (
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
                    <TableCell>{item.title}</TableCell>
<TableCell>
  {item.type === "petty_cash" ? (
    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
      PettyCash
    </Badge>
  ) : (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
      Loan
    </Badge>
  )}
</TableCell>
<TableCell>
  Rp{" "}
  {Number(item.amount).toLocaleString("id-ID")}
</TableCell>
<TableCell>
  {new Date(item.request_date).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  )}
</TableCell>
<TableCell>
  {item.status === "ready_finance" ? (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
      Ready
    </Badge>
  ) : (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
      Paid
    </Badge>
  )}
</TableCell>

                    <TableCell>
                      <div className="flex gap-2">

                        {/* DETAIL */}
<Dialog>
  <DialogTrigger asChild>
    <Button
      size="icon"
      className="rounded-lg cursor-pointer"
    >
      <Eye className="h-4 w-4" />
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-xl rounded-2xl p-0 overflow-hidden">

    {/* HEADER */}
    <DialogHeader className="border-b bg-muted/30 px-6 py-5">
      <DialogTitle className="text-xl font-bold">
        {item.title}
      </DialogTitle>

      <DialogDescription>
        Request ID: {item.id}
      </DialogDescription>
    </DialogHeader>

    {/* CONTENT */}
    <div className="space-y-6 px-6 py-5">

      {/* TOP INFO */}
      <div className="grid grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-5">

          <div>
            <p className="text-sm text-muted-foreground">
              Amount
            </p>

            <p className="text-xl font-semibold">
              Rp{" "}
              {Number(item.amount).toLocaleString(
                "id-ID"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Description
            </p>

            <p className="text-sm">
              {item.description}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Status
            </p>

            {item.status === "paid" ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Paid
              </Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Ready
              </Badge>
            )}
          </div>

          {/* PREVIEW BUKTI */}
          {item.type === "petty_cash" &&
 item.usage_proof&& (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Bukti Pemakaian
              </p>

              <a
                href={
  item.usage_proof?.startsWith("http")
    ? item.usage_proof
    : `http://127.0.0.1:8000/storage/${item.usage_proof}`
}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer"
              >
                📄 Preview Bukti PDF
              </a>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER BOX */}
      <div className="rounded-2xl border bg-blue-50/40 p-4 text-center">

        <p className="text-sm font-medium mb-3">
          Download Bukti Pemakaian
        </p>

        {item.type === "petty_cash" &&
 item.usage_proof? (
          <a
            href={
  item.usage_proof?.startsWith("http")
    ? item.usage_proof
    : `http://127.0.0.1:8000/storage/${item.usage_proof}`
}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer"

            >
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Bukti belum diupload pegawai
          </div>
        )}

      </div>

    </div>

  </DialogContent>
</Dialog>
                        {/* UPLOAD */}
{/* UPLOAD */}
<Dialog
  open={openUploadId === item.id}
  onOpenChange={(open) => {
    if (open) {
      setOpenUploadId(item.id);
    } else {
      setOpenUploadId(null);
    }
  }}
>
  <DialogTrigger asChild>
    <Button
      size="icon"
      className="rounded-lg cursor-pointer"
    >
      <Upload className="h-4 w-4" />
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">

    {/* HEADER */}
    <DialogHeader className="border-b px-6 py-5 bg-muted/30">
      <DialogTitle className="text-xl font-bold">
        Upload Bukti Transfer
      </DialogTitle>

      <DialogDescription>
        Upload file PDF bukti transfer untuk mencairkan dana.
      </DialogDescription>
    </DialogHeader>

    {/* CONTENT */}
    <div className="space-y-5 px-6 py-5">

      {/* BOX FILE */}
      <label
        htmlFor={`upload-${item.id}`}
        className="
          flex flex-col items-center justify-center
          rounded-2xl border-2 border-dashed
          border-blue-200 bg-blue-50/40
          p-8 text-center cursor-pointer
          transition hover:bg-blue-50
        "
      >
        <Upload className="h-10 w-10 text-blue-600 mb-3" />

        <p className="font-medium">
          Klik untuk upload file
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          PDF only • Max 5MB
        </p>

        {file && (
          <div className="mt-4 rounded-lg bg-white px-4 py-2 text-sm shadow-sm border">
            📄 {file.name}
          </div>
        )}

        <input
          id={`upload-${item.id}`}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />
      </label>

      {/* WARNING */}
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
        <AlertCircle className="h-4 w-4 mt-0.5" />

        <p>
          Pastikan file yang diupload adalah bukti transfer yang valid.
        </p>
      </div>

      {/* BUTTON */}
      <Button
        className="w-full rounded-xl h-11 cursor-pointer"
onClick={async () => {
  await handleConfirm(item.id);
}}
      >
        Upload & Cairkan Dana
      </Button>

    </div>

  </DialogContent>
</Dialog>

                        {/* CONFIRM */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" className="cursor-pointer">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cairkan Dana?
                              </AlertDialogTitle>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  setSelectedId(item.id);
                                  handleConfirm();
                                }}
                              >
                                Ya, Cairkan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 flex items-center justify-between">
  
  <p className="text-sm text-muted-foreground">
    Showing{" "}
    {(currentPage - 1) * itemsPerPage + 1}
    {" "}to{" "}
    {Math.min(
      currentPage * itemsPerPage,
      filtered.length
    )}{" "}
    of {filtered.length} entries
  </p>

  <div className="flex items-center gap-2">
<Select
  value={itemsPerPage.toString()}
  onValueChange={(value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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
      (_, index) => (
        <Button
          key={index}
          size="sm"
          variant={
            currentPage === index + 1
              ? "default"
              : "outline"
          }
          className="h-9 w-9 p-0 cursor-pointer"
          onClick={() =>
            setCurrentPage(index + 1)
          }
        >
          {index + 1}
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
  </>
)}

        </CardContent>
      </Card>
    </div>
  );
}