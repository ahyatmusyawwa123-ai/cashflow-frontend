import { ApprovalQueue } from "@/components/approver/approval-queue"

export default function HRDApproverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          HRD Approval Queue
        </h2>
        <p className="text-muted-foreground">
          Review and approve submitted requests
        </p>
      </div>

      <ApprovalQueue
        role="hrd"
        title="Pending HRD Approval"
        description="Requests waiting for HRD review and approval"
      />
    </div>
  )
}