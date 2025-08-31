"use client"

import { CircleExclamationFill } from "@gravity-ui/icons"
import * as React from "react"
import { cn } from "@/lib/utils"
import PageHeader from "./page-header"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  errors?: string[]
  info?: React.ReactNode
  headerTitle?: React.ReactNode
  headerDescription?: React.ReactNode
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      className,
      children,
      headerTitle,
      headerDescription,
      errors,
      info,
      ...props
    },
    ref
  ) => {
    return (
      <form
        className={cn("grid max-w-2xl gap-6 pb-5", className)}
        {...props}
        ref={ref}
      >
        {headerTitle && (
          <PageHeader description={headerDescription} title={headerTitle} />
        )}

        {errors && (
          <div className="flex gap-2 rounded-md p-3 text-destructive ring-1 ring-destructive">
            <CircleExclamationFill className="h-4 w-4 shrink-0" />
            <div className="text-sm">
              {errors.map((item) => (
                <div className="break-words" key={item}>
                  - {item}
                </div>
              ))}
            </div>
          </div>
        )}
        {info && (
          <div className="flex items-center gap-2 rounded-md p-3 text-primary ring-1 ring-primary">
            <CircleExclamationFill className="h-4 w-4 shrink-0" />
            <div className="text-sm">{info}</div>
          </div>
        )}

        {children}
      </form>
    )
  }
)
Form.displayName = "Form"

export { Form }
