import React, { ReactNode } from "react"

const PageHeader = ({
  title,
  description,
}: {
  title: ReactNode
  description?: ReactNode
}) => {
  return (
    <div className="mb-2">
      <h1 className="text-lg font-semibold">{title}</h1>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </div>
  )
}

export default PageHeader
