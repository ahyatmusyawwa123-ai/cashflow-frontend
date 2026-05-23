import { ApprovalQueue } from "@/components/approver/approval-queue"

export default function ManagerApproverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Manager Approval Queue
        </h2>
        <p className="text-muted-foreground">
          Review requests approved by HRD
        </p>
      </div>

      <ApprovalQueue
        role="manager"
        title="Pending Manager Approval"
        description="Requests that have been approved by HRD and require Manager approval"
      />
    </div>
  )
}
