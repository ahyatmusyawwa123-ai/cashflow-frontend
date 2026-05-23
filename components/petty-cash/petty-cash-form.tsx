"use client"

import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { getRequiredSteps } from "@/lib/types"
import { ApprovalStepper } from "@/components/approval-stepper"

type Props = {
  onSuccess?: () => void
}

export function PettyCashForm({ onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")

  const numericAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0

  const formatCurrencyInput = (value: string) => {
    const numeric = value.replace(/[^\d]/g, "")
    if (!numeric) return ""
    return new Intl.NumberFormat("id-ID").format(parseInt(numeric))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setAmount(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount || !date || !description) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
  const res = await fetch("http://127.0.0.1:8000/api/petty-cash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: localStorage.getItem("user_id"),
      title,
      type: "petty_cash",
      amount: numericAmount,
      request_date: format(date, "yyyy-MM-dd"),
      description,
    }),
  })

  const data = await res.json()

  if (data.status === "success") {
    toast.success("Pengajuan berhasil", {
      description: "Petty cash berhasil disimpan ke database",
    })

    // reset form
    setTitle("")
    setAmount("")
    setDate(undefined)
    setDescription("")
    onSuccess?.()
  } else {
    toast.error("Gagal mengajukan petty cash")
  }

} catch (error) {
  toast.error("Server error")
}

setIsSubmitting(false)
  }

  const steps = getRequiredSteps(numericAmount)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Form Pengajuan Petty Cash
        </h3>
        <p className="text-sm text-muted-foreground">
          Submit a new petty cash request for approval
        </p>
      </div>

      <FieldGroup>

        {/* JUDUL */}
        <Field>
          <FieldLabel htmlFor="title">Judul</FieldLabel>
          <Input
            id="title"
            placeholder="Enter request title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </Field>

        {/* NOMINAL */}
        <Field>
          <FieldLabel htmlFor="amount">Nominal (IDR)</FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rp
            </span>
            <Input
              id="amount"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>

          {numericAmount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Approval workflow: {steps.map((s) => s.label).join(" → ")}
            </p>
          )}
        </Field>

        {/* TANGGAL */}
        <Field>
          <FieldLabel htmlFor="date">Tanggal</FieldLabel>
          <Input
            id="date"
            type="date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
            onChange={(e) => setDate(new Date(e.target.value))}
            disabled={isSubmitting}
          />
        </Field>

        {/* DESKRIPSI */}
        <Field>
          <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
          <Textarea
            id="description"
            placeholder="Describe the purpose of this request..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
        </Field>

      </FieldGroup>

      {/* APPROVAL PREVIEW */}
      {numericAmount > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground mb-4">
            Approval Steps Preview
          </p>
          <ApprovalStepper amount={numericAmount} currentStatus="submitted" />
        </div>
      )}

      {/* BUTTON */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>

    </form>
  );
}