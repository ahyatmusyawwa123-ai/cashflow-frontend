"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoanSetting {
  id: number;
  tenor: number;
  interest_rate: number;
  is_active: boolean;
}

export default function MasterLoanPage() {
const { toast } = useToast();

const [settings, setSettings] = useState<LoanSetting[]>([]);
const [tenor, setTenor] = useState("");
const [interest, setInterest] = useState("");
const [loading, setLoading] = useState(false);
const [editId, setEditId] = useState<number | null>(null);
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(5);
const [openModal, setOpenModal] = useState(false);
const fetchSettings = async () => {

  const res = await fetch(
    "http://127.0.0.1:8000/api/loan-settings"
  );

  const data = await res.json();

  setSettings(data);

};

useEffect(() => {
  fetchSettings();
}, []);
const handleEdit = (item: LoanSetting) => {

  setEditId(item.id);

  setTenor(item.tenor.toString());

  setInterest(item.interest_rate.toString());

  setOpenModal(true);

};
const filteredSettings = settings.filter((item) =>
  item.tenor
    .toString()
    .includes(searchQuery)
);
const totalPages = Math.ceil(
  filteredSettings.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const endIndex =
  startIndex + itemsPerPage;

const paginatedSettings =
  filteredSettings.slice(
    startIndex,
    endIndex
  );
const activeCount = settings.filter(
  (item) => item.is_active
).length;

const inactiveCount = settings.filter(
  (item) => !item.is_active
).length;

const averageInterest =
  settings.length > 0
    ? (
        settings.reduce(
          (acc, item) =>
            acc + Number(item.interest_rate),
          0
        ) / settings.length
      ).toFixed(2)
    : "0";

const handleDelete = async (id: number) => {

  const confirmDelete = confirm(
    "Yakin ingin menghapus setting ini?"
  );

  if (!confirmDelete) return;

  try {

    await fetch(
      `http://127.0.0.1:8000/api/loan-settings/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchSettings();
    toast({
  title: "Setting deleted",
  description:
    "Loan setting berhasil dihapus",
});

  } catch (error) {

    console.error(error);

  }

};
const handleToggleStatus = async (id: number) => {

  try {

    await fetch(
      `http://127.0.0.1:8000/api/loan-settings/${id}/toggle`,
      {
        method: "PUT",
      }
    );

    fetchSettings();
    toast({
  title: "Status updated",
  description:
    "Status setting berhasil diubah",
});

  } catch (error) {

    console.error(error);

  }

};
const handleSave = async () => {

  if (!tenor || !interest) return;

  try {

    setLoading(true);

    await fetch(
  editId
    ? `http://127.0.0.1:8000/api/loan-settings/${editId}`
    : "http://127.0.0.1:8000/api/loan-settings",
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenor,
          interest_rate: interest,
        }),
      }
    );

    setTenor("");
    setInterest("");
    setEditId(null);

    fetchSettings();
    toast({
  title: editId
    ? "Setting updated"
    : "Setting added",
  description: editId
    ? "Loan setting berhasil diperbarui"
    : "Loan setting berhasil ditambahkan",
});

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Master Loan Settings
        </h1>


        <p className="text-muted-foreground">
          Manage loan tenor and interest settings
        </p>

      </div>
      {/* SUMMARY */}
<div className="grid gap-4 md:grid-cols-3">

  <div className="rounded-xl border bg-card p-5 shadow-sm text-center">
    <p className="text-sm text-muted-foreground">
      Total Tenor
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {settings.length}
    </h2>

    <p className="mt-1 text-xs text-muted-foreground">
      Registered tenor settings
    </p>
  </div>

  <div className="rounded-xl border bg-card p-5 shadow-sm text-center">
    <p className="text-sm text-muted-foreground">
      Active Settings
    </p>

    <h2 className="mt-2 text-3xl font-bold text-green-600">
      {activeCount}
    </h2>

    <p className="mt-1 text-xs text-muted-foreground">
      Currently active loan settings
    </p>
  </div>

  <div className="rounded-xl border bg-card p-5 shadow-sm text-center">
    <p className="text-sm text-muted-foreground">
      Average Interest
    </p>

    <h2 className="mt-2 text-3xl font-bold text-blue-600">
      {averageInterest}%
    </h2>

    <p className="mt-1 text-xs text-muted-foreground">
      Average interest from all tenor
    </p>
  </div>

</div>

      {/* TABLE */}
      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">

  <div className="relative w-full max-w-[280px]">

    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

    <Input
      placeholder="Search tenor..."
      value={searchQuery}
      onChange={(e) =>
        setSearchQuery(e.target.value)
      }
      className="pl-9"
    />

  </div>

  <Button
    onClick={() => {
      setOpenModal(true);
      setEditId(null);
      setTenor("");
      setInterest("");
    }}
  >
    + Add Setting
  </Button>

</div>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Tenor</th>
              <th className="text-left py-3">Interest</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSettings.map((item, index) => (
              <tr
                key={item.id}
                className={
                  index % 2 === 0
                    ? "bg-blue-50/70"
                    : "bg-white"
                }
              >
                <td className="py-4 px-2">
                  {item.tenor} Bulan
                </td>

                <td className="py-4 px-2">
                  {item.interest_rate}%
                </td>

                <td className="py-4 px-2">
                  <button
  onClick={() =>
    handleToggleStatus(item.id)
  }
  className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium transition text-xs font-medium ${
                      item.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="py-4 px-2">

  <div className="flex gap-3">

    <button
      onClick={() => handleEdit(item)}
      className="cursor-pointer text-blue-600 font-medium hover:underline"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(item.id)}
      className="cursor-pointer text-red-600 font-medium hover:underline"
    >
      Delete
    </button>

  </div>

</td>

              </tr>
            ))}
          </tbody>

        </table>
<div className="mt-6 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">

  <div className="text-sm text-muted-foreground">

    Showing

    <span className="mx-1 font-medium text-foreground">
      {startIndex + 1}
    </span>

    to

    <span className="mx-1 font-medium text-foreground">
      {Math.min(
        endIndex,
        filteredSettings.length
      )}
    </span>

    of

    <span className="mx-1 font-medium text-foreground">
      {filteredSettings.length}
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

        const page = index + 1;

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

        );
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
{openModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-xl font-semibold">

          {editId
            ? "Edit Setting"
            : "Add Setting"}

        </h2>

        <button
          onClick={() => setOpenModal(false)}
          className="text-2xl text-muted-foreground hover:text-foreground"
        >
          ×
        </button>

      </div>

      <div className="space-y-4">

        <Input
          type="number"
          placeholder="Tenor"
          value={tenor}
          onChange={(e) =>
            setTenor(e.target.value)
          }
        />

        <Input
          type="number"
          placeholder="Interest %"
          value={interest}
          onChange={(e) =>
            setInterest(e.target.value)
          }
        />

        <Button
          className="w-full"
          onClick={async () => {

            await handleSave();

            setOpenModal(false);

          }}
          disabled={loading}
        >

          {loading
            ? "Saving..."
            : editId
            ? "Update Setting"
            : "Save Setting"}

        </Button>
      </div>

    </div>

  </div>

)}
  </div>

</div>
      </div>

    </div>
  );
}