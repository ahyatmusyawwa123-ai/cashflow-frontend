"use client"

import { Check, Circle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApprovalStatus } from "@/lib/types"
import { getRequiredSteps } from "@/lib/types"

interface ApprovalStepperProps {
  amount: number
  currentStatus: ApprovalStatus
  className?: string
}

export function ApprovalStepper({
  amount,
  currentStatus,
  className,
}: ApprovalStepperProps) {
  const steps = getRequiredSteps(amount)
  const isRejected = currentStatus === "rejected"

  const getCurrentStepIndex = (): number => {
    if (isRejected) return -1
    const index = steps.findIndex((step) => step.key === currentStatus)
    return index === -1 ? steps.length - 1 : index
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = !isRejected && index < currentStepIndex
          const isCurrent = !isRejected && index === currentStepIndex
          const isPending = !isRejected && index > currentStepIndex

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-status-approved bg-status-approved",
                    isCurrent && "border-primary bg-primary",
                    isPending && "border-border bg-background",
                    isRejected && "border-status-rejected bg-status-rejected"
                  )}
                >
                  {isCompleted && (
                    <Check className="h-4 w-4 text-status-approved-foreground" />
                  )}
                  {isCurrent && !isRejected && (
                    <Circle className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
                  )}
                  {isPending && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                  {isRejected && index === 0 && (
                    <X className="h-4 w-4 text-status-rejected-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium whitespace-nowrap",
                    isCompleted && "text-status-approved-foreground",
                    isCurrent && "text-primary",
                    isPending && "text-muted-foreground",
                    isRejected && "text-status-rejected-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    isCompleted ? "bg-status-approved" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
