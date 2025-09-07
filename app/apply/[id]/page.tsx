import {
    IconBuilding,
    IconHexagonLetterHFilled,
    IconUserFilled,
} from "@tabler/icons-react"
import { ChevronLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getInterviewForApply } from "@/actions/interviews"
import EmptyDatabase from "@/components/illustrations/empty-database"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { CallButton } from "../components/call-button"

export const metadata: Metadata = {
    title: "Собеседование",
}

export default async function Page(props: PageProps<"/apply/[id]">) {
    const params = await props.params
    const interview = await getInterviewForApply(params.id)
    if (!interview) {
        notFound()
    }

    if (interview.status === "completed") {
        return (
            <EmptyState
                description="Собеседование уже проведено"
                illustration={<EmptyDatabase />}
                title="В уже всё"
            />
        )
    }

    if (interview.status === "in_progress") {
        return (
            <EmptyState
                description="Собеседование уже началось"
                illustration={<EmptyDatabase />}
                title="В процессе"
            />
        )
    }

    return (
        <div className="mx-auto flex h-full flex-col items-center justify-center gap-8">
            <div className="relative grid grid-cols-8 items-center">
                <div className="col-span-3 flex items-center justify-end gap-4">
                    <div className="flex flex-col items-end gap-1 text-right">
                        <h3 className="font-bold text-xl leading-none">
                            {interview.candidate?.name}
                        </h3>
                        <p className="flex gap-2 text-sm">
                            <span>{interview.candidate?.email}</span>
                        </p>
                    </div>
                    <div className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 text-background transition-colors hover:via-foreground/60">
                        <IconUserFilled className="size-6" />
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                    <IconHexagonLetterHFilled className="size-16 text-primary" />
                </div>
                <div className="col-span-3 flex items-center justify-start gap-4">
                    <div className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 text-background transition-colors hover:via-foreground/60">
                        <IconBuilding className="size-6" />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <h3 className="font-bold text-xl leading-none">
                            {interview.organisation?.name}
                        </h3>
                        <p className="flex gap-2 text-sm">
                            <span>{interview.job?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Link href={`/apply/${interview.id}/room`}>
                    <Button
                        className="group h-auto gap-4 py-2 text-right"
                        variant="outline"
                    >
                        <ChevronLeftIcon
                            aria-hidden="true"
                            className="group-hover:-translate-x-0.5 opacity-60 transition-transform"
                            size={16}
                        />
                        <div className="space-y-1">
                            <h3 className="font-bold">Продолжить онлайн</h3>
                            <p className="whitespace-break-spaces font-normal text-muted-foreground">
                                Вы перейдете на страницу собеседования
                            </p>
                        </div>
                    </Button>
                </Link>
                <CallButton
                    interviewId={interview.id}
                    phone={interview.candidate?.phone ?? ""}
                />
            </div>
        </div>
    )
}
