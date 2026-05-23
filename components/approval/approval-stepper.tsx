interface ApprovalStepperProps {
  currentStep: string
}

const steps = [
  "Submitted",
  "HRD Approved",
  "Manager Approved",
  "Director Approved",
  "Ready Finance",
  "Paid",
]

export default function ApprovalStepper({
  currentStep,
}: ApprovalStepperProps) {
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex

        return (
          <div
            key={step}
            className="flex items-start gap-3"
          >
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-4 h-4 rounded-full border-2 mt-1
                  ${
                    completed
                      ? "bg-green-500 border-green-500"
                      : active
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 bg-white"
                  }
                `}
              />

              {index !== steps.length - 1 && (
                <div className="w-[2px] h-6 bg-gray-300" />
              )}
            </div>

            <div>
              <p
                className={`
                  text-sm font-medium
                  ${
                    completed
                      ? "text-green-600"
                      : active
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                `}
              >
                {step}
              </p>

              <p className="text-xs text-muted-foreground">
                {completed
                  ? "Completed"
                  : active
                  ? "Current Step"
                  : "Waiting"}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}