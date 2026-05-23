"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoanForm } from "@/components/loan/loan-form";
import { LoanHistory } from "@/components/loan/loan-history";

export default function LoanPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Loan
          </h2>
          <p className="text-muted-foreground">
            Submit and track your loan requests
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          + New Request
        </Button>
      </div>

      {/* HISTORY */}
      <LoanHistory />

      {/* MODAL */}
      {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-lg flex flex-col max-h-[90vh]">

      {/* HEADER */}
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          New Loan Request
        </h3>

        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* BODY (SCROLL) */}
      <div className="p-6 overflow-y-auto">
        <LoanForm
          onSuccess={() => {
            setOpen(false)
            window.location.reload()
          }}
        />
      </div>

    </div>

  </div>
)}

    </div>
  );
}