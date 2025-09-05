import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchBlock({
    label,
    description,
    sublabel,
    checked,
    onCheckedChange,
}: {
    label: string
    description: React.ReactNode
    sublabel?: string
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}) {
    const id = useId()
    return (
        <div className="relative flex w-full items-start gap-2 rounded-md border border-input bg-card p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
            <Switch
                aria-describedby={`${id}-description`}
                checked={checked}
                className="data-[state=checked]:[&_span]:rtl:-translate-x-2 order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2"
                id={id}
                onCheckedChange={onCheckedChange}
            />
            <div className="grid grow gap-2">
                <Label htmlFor={id}>
                    {label}{" "}
                    <span className="font-normal text-muted-foreground text-xs leading-[inherit]">
                        {sublabel}
                    </span>
                </Label>
                <div
                    className="text-muted-foreground text-xs"
                    id={`${id}-description`}
                >
                    {description}
                </div>
            </div>
        </div>
    )
}
