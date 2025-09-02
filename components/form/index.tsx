"use client"

import { CircleExclamationFill } from "@gravity-ui/icons"
import { IconLoader } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"
import { cn } from "@/lib/utils"
import PageHeader from "./page-header"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    errors?: string[]
    info?: React.ReactNode
    headerTitle?: React.ReactNode
    headerDescription?: React.ReactNode
    headerActions?: React.ReactNode
    isLoading?: boolean
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
            headerActions,
            isLoading,
            ...props
        },
        ref
    ) => {
        return (
            <form
                className={cn("relative grid max-w-2xl gap-6 pb-5", className)}
                {...props}
                ref={ref}
            >
                {headerTitle && (
                    <PageHeader
                        actions={headerActions}
                        description={headerDescription}
                        title={headerTitle}
                    />
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
                    <div className="flex gap-2 rounded-md p-3 text-primary ring-1 ring-primary">
                        <CircleExclamationFill className="h-4 w-4 shrink-0" />
                        <div className="text-sm">{info}</div>
                    </div>
                )}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2 bg-background/80"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                        >
                            <IconLoader className="h-4 w-4 shrink-0 animate-spin" />
                            <span className="text-sm">Загрузка...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {children}
            </form>
        )
    }
)
Form.displayName = "Form"

export { Form }
