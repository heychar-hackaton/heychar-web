import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const FormBody = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>
}

export default FormBody
