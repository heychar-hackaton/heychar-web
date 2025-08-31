import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const FormSegmentHeader = ({
  className,
  label,
  description,
}: {
  className?: string
  label: ReactNode
  description?: ReactNode
}) => {
  return (
    <div className={cn("mt-2 font-semibold text-sm", className)}>
      {label}
      {description && (
        <div className="text-sm font-normal text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  )
}

export default FormSegmentHeader
