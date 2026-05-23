"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PettyCashForm } from "@/components/petty-cash/petty-cash-form";
import { PettyCashHistory } from "@/components/petty-cash/petty-cash-history";

export default function PettyCashPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Petty Cash</h2>
          <p className="text-muted-foreground">
            Submit and track your petty cash requests
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          + New Request
        </Button>
      </div>

      {/* HISTORY */}
      <PettyCashHistory />

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">
              New Petty Cash Request
            </h3>

            <PettyCashForm
  onSuccess={() => setOpen(false)}
/>

          </div>
        </div>
      )}
    </div>
  );
}