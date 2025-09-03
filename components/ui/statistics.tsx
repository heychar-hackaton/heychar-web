import type { ReactNode } from "react"

const Statistics = ({
    value,
    description,
}: {
    value?: ReactNode
    description: ReactNode
}) => {
    return (
        <div className="flex flex-col">
            <span className="font-semibold text-3xl">{value}</span>
            <span className="text-muted-foreground text-sm">{description}</span>
        </div>
    )
}

export default Statistics
