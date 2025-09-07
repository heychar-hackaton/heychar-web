import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cancelInterview, getInterviewForApply } from "@/actions/interviews"
import { SubmitButton } from "@/components/form/submit-button"
import EmptyDatabase from "@/components/illustrations/empty-database"
import { EmptyMessage } from "@/components/illustrations/empty-message"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
    title: "Отмена собеседования",
}

export default async function Page(props: PageProps<"/cancel/[id]">) {
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

    if (interview.status === "cancelled") {
        return (
            <EmptyState
                description="Собеседование уже отменено"
                illustration={<EmptyMessage />}
                title="Уже отменено"
            />
        )
    }

    return (
        <EmptyState
            customAction={
                <form action={cancelInterview} className="mt-4">
                    <input
                        name="interviewId"
                        type="hidden"
                        value={interview.id}
                    />
                    <SubmitButton>Отменить собеседование</SubmitButton>
                </form>
            }
            description="Вы уверены, что хотите отменить собеседование?"
            illustration={<EmptyMessage />}
            title="Отмена собеседования"
        />
    )
}
