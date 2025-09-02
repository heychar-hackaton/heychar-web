"use client"

import Link from "next/link"
import type { JSX } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SubmitButton } from "./submit-button"
import { Separator } from "../ui/separator"

type Props = {
    submitLabel?: string
    cancelLabel?: string
    cancelLink?: string
    className?: string
    additionalActions?: JSX.Element
}

function FormFooter(props: Props) {
    return (
        <div>
            <Separator className="mb-3" />
            <div className={cn("flex w-full gap-3", props.className)}>
                <SubmitButton className="w-auto">
                    {props.submitLabel || "Сохранить"}
                </SubmitButton>
                <Link href={props.cancelLink || "./"}>
                    <Button type="button" variant="ghost">
                        {props.cancelLabel || "Отмена"}
                    </Button>
                </Link>
                {props.additionalActions}
            </div>
        </div>
    )
}

export default FormFooter
