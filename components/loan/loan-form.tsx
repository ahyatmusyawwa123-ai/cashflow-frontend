"use client";

import { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/types";


export function LoanForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [tenor, setTenor] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [loanSettings, setLoanSettings] = useState<any[]>([]);
  useEffect(() => {

  fetch("https://anyone-tinker-electable.ngrok-free.dev/loan-settings")
    .then((res) => res.json())
    .then((data) => {
      setLoanSettings(data);
    })
    .catch((err) => console.error(err));

}, []);
  const numericAmount = parseFloat(amount.replace(/[^\d]/g, "")) || 0;

  const formatCurrencyInput = (value: string) => {
    const numeric = value.replace(/[^\d]/g, "");
    if (!numeric) return "";
    return new Intl.NumberFormat("id-ID").format(parseInt(numeric));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    setAmount(formatted);
  };

  const loanCalculation = useMemo(() => {
    if (!numericAmount || !tenor) return null;

    const tenorMonths = parseInt(tenor);
    const selectedSetting = loanSettings.find(
  (item) => item.tenor === tenorMonths
);

const interestRate =
  (selectedSetting?.interest_rate || 0) / 100;

const totalInterest = numericAmount * interestRate;
    const totalAmount = numericAmount + totalInterest;
    const monthlyInstallment = totalAmount / tenorMonths;

    return {
      principal: numericAmount,
      totalInterest,
      totalAmount,
      monthlyInstallment,
      tenor: tenorMonths,
    };
  }, [numericAmount, tenor]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !amount || !tenor || !date || !description) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await fetch("https://anyone-tinker-electable.ngrok-free.dev/petty-cash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        title,
        type: "loan",
        amount: numericAmount,
        tenor,
        monthly_installment: loanCalculation?.monthlyInstallment || 0,
        request_date: format(date, "yyyy-MM-dd"),
        description,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed");
    }

    toast.success("Pengajuan berhasil", {
      description: "Your loan request has been submitted for approval.",
    });

    onSuccess?.();

    setTitle("");
    setAmount("");
    setTenor("");
    setDate(undefined);
    setDescription("");

  } catch (error) {

    toast.error("Gagal submit loan");

  } finally {

    setIsSubmitting(false);

  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Form Pengajuan Loan
        </h3>
        <p className="text-sm text-muted-foreground">
          Submit a new loan request for approval
        </p>
      </div>

      <FieldGroup>

        {/* TITLE */}
        <Field>
          <FieldLabel htmlFor="title">Judul</FieldLabel>
          <Input
            id="title"
            placeholder="Enter loan purpose"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </Field>

        {/* AMOUNT */}
        <Field>
          <FieldLabel htmlFor="amount">Nominal Pinjaman (IDR)</FieldLabel>
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
        </Field>

        {/* TENOR */}
        <Field>
          <FieldLabel>Tenor (Bulan)</FieldLabel>
          <Select value={tenor} onValueChange={setTenor} disabled={isSubmitting}>
            <SelectTrigger>
              <SelectValue placeholder="Select tenor" />
            </SelectTrigger>
            <SelectContent>
              {loanSettings.map((option) => (
                <SelectItem
  key={option.id}
  value={option.tenor.toString()}
>
  {option.tenor} Bulan
</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* DATE (FIXED) */}
        <Field>
          <FieldLabel htmlFor="date">Tanggal Pengajuan</FieldLabel>
          <Input
            id="date"
            type="date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
            onChange={(e) => setDate(new Date(e.target.value))}
            disabled={isSubmitting}
          />
        </Field>

        {/* DESCRIPTION */}
        <Field>
          <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
          <Textarea
            id="description"
            placeholder="Describe the purpose of this loan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
        </Field>

      </FieldGroup>

      {/* CALCULATION */}
      {loanCalculation && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Loan Calculation Preview
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Principal</p>
              <p className="font-medium">{formatCurrency(loanCalculation.principal)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Bunga</p>
              <p className="font-medium">{formatCurrency(loanCalculation.totalInterest)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-medium">{formatCurrency(loanCalculation.totalAmount)}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Cicilan / Bulan</p>
              <p className="font-semibold text-primary">
                {formatCurrency(loanCalculation.monthlyInstallment)}
              </p>
            </div>
          </div>
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
          "Submit Loan Request"
        )}
      </Button>

    </form>
  );
}