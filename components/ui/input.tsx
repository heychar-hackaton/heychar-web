import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    inputClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { className, inputClassName, startContent, endContent, ...props },
        ref
    ) => {
        return (
            <div className={cn("relative w-full rounded-md", className)}>
                {startContent && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        {startContent}
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                        startContent ? "pl-10" : "",
                        endContent ? "pr-10" : "",
                        inputClassName
                    )}
                    ref={ref}
                    {...props}
                />
                {endContent && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {endContent}
                    </div>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
