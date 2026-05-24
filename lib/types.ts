export type UserRole = "employee" | "hrd" | "manager" | "director" | "finance" | "admin"

export type ApprovalStatus =
  | "submitted"
  | "approved_hrd"
  | "approved_manager"
  | "approved_director"
  | "ready_finance"
  | "disbursed"
  | "paid"
  | "completed"
  | "rejected"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface PettyCashRequest {
  id: string
  userId: string
  userName: string
  title: string
  amount: number
  request_date: string
  description: string
  status: ApprovalStatus
  proof_url?: string
  transfer_proof?: string
  currentStep: number
  totalSteps: number
  proofUrl?: string
  transferProofUrl?: string
  createdAt: string
  updatedAt: string
}

export interface LoanRequest {
  id: string
  userId: string
  userName: string
  title: string
  amount: number
  tenor: number // in months
  monthly_installment: number
  date: string
  description: string
  status: ApprovalStatus
  request_date: string
  currentStep: number
  totalSteps: number
  paidInstallments: number
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  status: "active" | "inactive"
}

export const APPROVAL_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "approved_hrd", label: "HRD" },
  { key: "approved_manager", label: "Manager" },
  { key: "approved_director", label: "Director" },
  { key: "ready_finance", label: "Finance" },
  { key: "disbursed", label: "Done" },
] as const

export function getRequiredSteps(amount: number): typeof APPROVAL_STEPS {
  if (amount < 1_000_000) {
    // < 1M: HRD only
    return [
      { key: "submitted", label: "Submitted" },
      { key: "approved_hrd", label: "HRD" },
      { key: "ready_finance", label: "Finance" },
      { key: "disbursed", label: "Done" },
    ] as unknown as typeof APPROVAL_STEPS
  } else if (amount <= 10_000_000) {
    // 1M - 10M: HRD -> Manager
    return [
      { key: "submitted", label: "Submitted" },
      { key: "approved_hrd", label: "HRD" },
      { key: "approved_manager", label: "Manager" },
      { key: "ready_finance", label: "Finance" },
      { key: "disbursed", label: "Done" },
    ] as unknown as typeof APPROVAL_STEPS
  } else {
    // > 10M: HRD -> Manager -> Director
    return APPROVAL_STEPS
  }
}

export function getStatusColor(status: ApprovalStatus): string {
  switch (status) {
    case "submitted":
      return "bg-gray-100 text-gray-700"

    case "approved_hrd":
      return "bg-yellow-100 text-yellow-700"

    case "approved_manager":
      return "bg-orange-100 text-orange-700"

    case "approved_director":
      return "bg-blue-100 text-blue-700"

    case "ready_finance":
      return "bg-purple-100 text-purple-700"

    case "disbursed":
      return "bg-green-100 text-green-700"

    case "rejected":
      return "bg-red-100 text-red-700"

    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString))
}
