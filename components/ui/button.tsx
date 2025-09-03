import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-ring/50 ring-ring/10 transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-4 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 dark:outline-ring/40 dark:ring-ring/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const LoadingIcon = (
    <svg
        className="size-5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>Loading</title>
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
        />
    </svg>
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
        loading?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            data-slot="button"
            disabled={loading || props.disabled}
            {...props}
        >
            <span
                className={cn(
                    loading
                        ? "opacity-0"
                        : "inline-flex items-center justify-center gap-2",
                    className
                )}
            >
                {children}
            </span>
            {loading && <span className="absolute">{LoadingIcon}</span>}
        </Comp>
    )
}

export { Button, buttonVariants }
