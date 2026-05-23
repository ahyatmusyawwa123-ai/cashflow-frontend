import type { User, PettyCashRequest, LoanRequest, Member } from "./types"

// Mock current user - in production this would come from auth
export const currentUser: User = {
  id: "1",
  name: "Ahmad Rizki",
  email: "ahmad.rizki@company.com",
  role: "admin",
}

// Mock petty cash data
export const pettyCashRequests: PettyCashRequest[] = [
  {
    id: "pc-001",
    userId: "2",
    userName: "Siti Nurhaliza",
    title: "Office Supplies",
    amount: 750_000,
    date: "2026-04-15",
    description: "Purchase of stationery and printer cartridges",
    status: "disbursed",
    currentStep: 4,
    totalSteps: 4,
    proofUrl: "/receipts/pc-001.pdf",
    transferProofUrl: "/transfers/pc-001.pdf",
    createdAt: "2026-04-15T08:00:00Z",
    updatedAt: "2026-04-17T14:30:00Z",
  },
  {
    id: "pc-002",
    userId: "3",
    userName: "Budi Santoso",
    title: "Client Meeting Lunch",
    amount: 1_500_000,
    date: "2026-04-18",
    description: "Lunch meeting with potential client at Restoran Padang",
    status: "approved_hrd",
    currentStep: 2,
    totalSteps: 5,
    createdAt: "2026-04-18T09:00:00Z",
    updatedAt: "2026-04-18T11:00:00Z",
  },
  {
    id: "pc-003",
    userId: "4",
    userName: "Dewi Lestari",
    title: "Team Building Event",
    amount: 15_000_000,
    date: "2026-04-20",
    description: "Monthly team building activity expenses",
    status: "approved_manager",
    currentStep: 3,
    totalSteps: 6,
    createdAt: "2026-04-20T10:00:00Z",
    updatedAt: "2026-04-21T09:00:00Z",
  },
  {
    id: "pc-004",
    userId: "5",
    userName: "Eko Prasetyo",
    title: "Transportation Reimbursement",
    amount: 500_000,
    date: "2026-04-19",
    description: "Taxi fare for client visits",
    status: "submitted",
    currentStep: 1,
    totalSteps: 4,
    createdAt: "2026-04-19T14:00:00Z",
    updatedAt: "2026-04-19T14:00:00Z",
  },
  {
    id: "pc-005",
    userId: "6",
    userName: "Fitri Handayani",
    title: "Training Materials",
    amount: 3_500_000,
    date: "2026-04-21",
    description: "Books and online course subscriptions",
    status: "ready_for_finance",
    currentStep: 4,
    totalSteps: 5,
    proofUrl: "/receipts/pc-005.pdf",
    createdAt: "2026-04-21T08:30:00Z",
    updatedAt: "2026-04-21T15:00:00Z",
  },
  {
    id: "pc-006",
    userId: "7",
    userName: "Gunawan Wijaya",
    title: "Emergency Office Repair",
    amount: 8_000_000,
    date: "2026-04-17",
    description: "AC repair and maintenance",
    status: "rejected",
    currentStep: 2,
    totalSteps: 5,
    createdAt: "2026-04-17T11:00:00Z",
    updatedAt: "2026-04-18T10:00:00Z",
  },
]

// Mock loan data
export const loanRequests: LoanRequest[] = [
  {
    id: "ln-001",
    userId: "2",
    userName: "Siti Nurhaliza",
    title: "Emergency Medical Loan",
    amount: 10_000_000,
    tenor: 12,
    monthlyInstallment: 875_000,
    date: "2026-03-01",
    description: "Medical emergency for family member",
    status: "disbursed",
    currentStep: 6,
    totalSteps: 6,
    paidInstallments: 2,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-10T14:00:00Z",
  },
  {
    id: "ln-002",
    userId: "4",
    userName: "Dewi Lestari",
    title: "Home Renovation Loan",
    amount: 25_000_000,
    tenor: 24,
    monthlyInstallment: 1_100_000,
    date: "2026-04-10",
    description: "Home renovation project",
    status: "approved_director",
    currentStep: 4,
    totalSteps: 6,
    paidInstallments: 0,
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-19T11:00:00Z",
  },
  {
    id: "ln-003",
    userId: "5",
    userName: "Eko Prasetyo",
    title: "Vehicle Purchase Loan",
    amount: 50_000_000,
    tenor: 36,
    monthlyInstallment: 1_550_000,
    date: "2026-04-15",
    description: "Down payment for new motorcycle",
    status: "approved_hrd",
    currentStep: 2,
    totalSteps: 6,
    paidInstallments: 0,
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: "2026-04-17T14:00:00Z",
  },
  {
    id: "ln-004",
    userId: "8",
    userName: "Hendra Kusuma",
    title: "Education Loan",
    amount: 15_000_000,
    tenor: 18,
    monthlyInstallment: 880_000,
    date: "2026-04-20",
    description: "Children school tuition fee",
    status: "submitted",
    currentStep: 1,
    totalSteps: 6,
    paidInstallments: 0,
    createdAt: "2026-04-20T11:00:00Z",
    updatedAt: "2026-04-20T11:00:00Z",
  },
]

// Mock members data
export const members: Member[] = [
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    joinDate: "2022-03-15",
    status: "active",
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi.santoso@company.com",
    department: "Sales",
    position: "Sales Executive",
    joinDate: "2023-01-10",
    status: "active",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi.lestari@company.com",
    department: "HR",
    position: "HR Specialist",
    joinDate: "2021-08-20",
    status: "active",
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    email: "eko.prasetyo@company.com",
    department: "IT",
    position: "Software Developer",
    joinDate: "2023-06-01",
    status: "active",
  },
  {
    id: "6",
    name: "Fitri Handayani",
    email: "fitri.handayani@company.com",
    department: "Finance",
    position: "Accountant",
    joinDate: "2022-11-05",
    status: "active",
  },
  {
    id: "7",
    name: "Gunawan Wijaya",
    email: "gunawan.wijaya@company.com",
    department: "Operations",
    position: "Operations Manager",
    joinDate: "2020-02-28",
    status: "inactive",
  },
  {
    id: "8",
    name: "Hendra Kusuma",
    email: "hendra.kusuma@company.com",
    department: "Engineering",
    position: "Senior Engineer",
    joinDate: "2019-09-15",
    status: "active",
  },
]

// Dashboard statistics
export function getDashboardStats() {
  const totalPettyCash = pettyCashRequests.reduce((sum, req) => sum + req.amount, 0)
  const totalLoan = loanRequests.reduce((sum, req) => sum + req.amount, 0)
  const pendingApproval =
    pettyCashRequests.filter(
      (r) => r.status !== "disbursed" && r.status !== "rejected"
    ).length +
    loanRequests.filter((r) => r.status !== "disbursed" && r.status !== "rejected")
      .length
  const totalDisbursed =
    pettyCashRequests.filter((r) => r.status === "disbursed").reduce((sum, r) => sum + r.amount, 0) +
    loanRequests.filter((r) => r.status === "disbursed").reduce((sum, r) => sum + r.amount, 0)

  return {
    totalPettyCash,
    totalLoan,
    pendingApproval,
    totalDisbursed,
  }
}

// Monthly petty cash data for bar chart
export function getMonthlyPettyCashData() {
  return [
    { month: "Jan", amount: 12_500_000 },
    { month: "Feb", amount: 18_200_000 },
    { month: "Mar", amount: 15_800_000 },
    { month: "Apr", amount: 29_250_000 },
    { month: "May", amount: 22_100_000 },
    { month: "Jun", amount: 19_500_000 },
  ]
}

// Loan trend data for line chart
export function getLoanTrendData() {
  return [
    { month: "Jan", amount: 45_000_000, count: 3 },
    { month: "Feb", amount: 62_000_000, count: 4 },
    { month: "Mar", amount: 55_000_000, count: 3 },
    { month: "Apr", amount: 100_000_000, count: 5 },
    { month: "May", amount: 78_000_000, count: 4 },
    { month: "Jun", amount: 85_000_000, count: 5 },
  ]
}

// Approval status data for pie chart
export function getApprovalStatusData() {
  const allRequests = [...pettyCashRequests, ...loanRequests]
  const pending = allRequests.filter(
    (r) =>
      r.status === "submitted" ||
      r.status === "approved_hrd" ||
      r.status === "approved_manager" ||
      r.status === "approved_director" ||
      r.status === "ready_for_finance"
  ).length
  const approved = allRequests.filter((r) => r.status === "disbursed").length
  const rejected = allRequests.filter((r) => r.status === "rejected").length

  return [
    { name: "Pending", value: pending, fill: "var(--status-pending)" },
    { name: "Approved", value: approved, fill: "var(--status-approved)" },
    { name: "Rejected", value: rejected, fill: "var(--status-rejected)" },
  ]
}
