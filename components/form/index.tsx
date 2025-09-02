"use client"

import { CircleExclamationFill } from "@gravity-ui/icons"
import { IconLoader, IconUpload } from "@tabler/icons-react"
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
    onFileDrop?: (file: File) => void
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
        const { onFileDrop } = props
        const [isDragActive, setIsDragActive] = React.useState(false)
        const [dragCounter, setDragCounter] = React.useState(0)

        const handleDragEnter = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragCounter((prev) => prev + 1)
            setIsDragActive(true)
        }

        const handleDragOver = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "copy"
            }
            if (!isDragActive) {
                setIsDragActive(true)
            }
        }

        const handleDragLeave = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragCounter((prev) => {
                const next = prev - 1
                if (next <= 0) {
                    setIsDragActive(false)
                    return 0
                }
                return next
            })
        }

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragActive(false)
            setDragCounter(0)
            const files = e.dataTransfer?.files
            if (!files || files.length === 0) {
                return
            }
            const file = files[0]
            if (onFileDrop) {
                onFileDrop(file)
            }
            if (e.dataTransfer) {
                e.dataTransfer.clearData()
            }
        }

        return (
            <form
                className={cn("relative grid max-w-2xl gap-6 pb-5", className)}
                onDragEnter={onFileDrop ? handleDragEnter : undefined}
                onDragLeave={onFileDrop ? handleDragLeave : undefined}
                onDragOver={onFileDrop ? handleDragOver : undefined}
                onDrop={onFileDrop ? handleDrop : undefined}
                {...props}
                ref={ref}
            >
                <div className="flex flex-col gap-2">
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
                        <div className="flex items-start gap-2 rounded-md bg-gradient-to-br from-background via-primary/5 to-primary/15 p-3 text-primary ring-1 ring-primary">
                            <CircleExclamationFill className="h-4 w-4 shrink-0" />
                            <div className="text-sm">{info}</div>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2 bg-background/85"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                        >
                            <IconLoader className="h-4 w-4 shrink-0 animate-spin" />
                            <span className="text-sm">Загрузка...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {onFileDrop && isDragActive && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-md bg-background/85"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            role="presentation"
                        >
                            <motion.div
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 rounded-md border-2 border-primary border-dashed bg-background/80 px-4 py-3 text-primary shadow-sm"
                                exit={{ opacity: 0, scale: 0 }}
                                initial={{ opacity: 0, scale: 0 }}
                            >
                                <IconUpload className="h-4 w-4" />
                                <span className="text-sm">
                                    Перетащите файл сюда, чтобы загрузить
                                </span>
                            </motion.div>
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
