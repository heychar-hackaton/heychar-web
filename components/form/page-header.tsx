import React, { type ReactNode } from "react"

const PageHeader = ({
  title,
  description,
}: {
  title: ReactNode
  description?: ReactNode
}) => {
  return (
    <div className="mb-2">
      <h1 className="font-semibold text-lg">{title}</h1>
      {description && (
        <span className="text-muted-foreground text-sm">{description}</span>
      )}
    </div>
  )
}

export default PageHeader
