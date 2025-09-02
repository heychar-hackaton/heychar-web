import React, { type ReactNode } from "react"

const PageHeader = ({
    title,
    description,
    actions,
}: {
    title: ReactNode
    description?: ReactNode
    actions?: ReactNode
}) => {
    return (
        <div className="">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg">{title}</h1>
                {actions}
            </div>
            {description && (
                <span className="text-muted-foreground text-sm">
                    {description}
                </span>
            )}
        </div>
    )
}

export default PageHeader
