import Link from "next/link"
import { Button } from "./button"

type Props = {
    title: string
    description?: string
    illustration?: React.ReactNode
    mainAction?: {
        icon?: React.ReactNode
        title: string
        link: string
    }
    customAction?: React.ReactNode
}

export const EmptyState = ({
    title,
    description,
    illustration,
    mainAction,
    customAction,
}: Props) => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                {illustration}
                <h1 className="font-semibold text-2xl">{title}</h1>
                {description && (
                    <p className="text-muted-foreground">{description}</p>
                )}
                {mainAction && !customAction && (
                    <Link className="mt-4" href={mainAction.link}>
                        <Button className="flex items-center gap-2">
                            {mainAction.icon}
                            {mainAction.title}
                        </Button>
                    </Link>
                )}
                {customAction}
            </div>
        </div>
    )
}
