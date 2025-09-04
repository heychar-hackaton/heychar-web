import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInterviewById } from "@/actions/interviews"
import EmptyChart from "@/components/illustrations/empty-chart"
import { EmptyInterface } from "@/components/illustrations/empty-interface"
import { EmptyState } from "@/components/ui/empty-state"
import { PreviewForm } from "../components/preview-form"

export const metadata: Metadata = {
    title: "Интервью",
}

export default async function Page(props: PageProps<"/interviews/[id]">) {
    const params = await props.params
    const interview = await getInterviewById(params.id)
    if (!interview) {
        notFound()
    }

    if (!interview.startTime) {
        return (
            <EmptyState
                description="Собеседование еще не началось, пожалуйста, подождите"
                illustration={<EmptyChart />}
                title="Еще не началось"
            />
        )
    }

    if (!interview.endTime) {
        return (
            <EmptyState
                description="Собеседование еще не закончилось, пожалуйста, подождите"
                illustration={<EmptyInterface />}
                title="В процессе"
            />
        )
    }

    return <PreviewForm interview={interview} />
}
