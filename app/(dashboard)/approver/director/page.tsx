import { ApprovalQueue } from "@/components/approver/approval-queue"

export default function DirectorApproverPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Director Approval Queue
        </h2>
        <p className="text-muted-foreground">
          Final approval for high-value requests
        </p>
      </div>

      <ApprovalQueue
        role="director"
        title="Pending Director Approval"
        description="High-value requests (over 10M) requiring Director approval"
      />
    </div>
  )
}
