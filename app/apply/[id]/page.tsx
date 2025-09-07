import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInterviewForApply } from "@/actions/interviews"

export const metadata: Metadata = {
    title: "Собеседование",
}

export default async function Page(props: PageProps<"/apply/[id]">) {
    const params = await props.params
    const interview = await getInterviewForApply(params.id)
    if (!interview) {
        notFound()
    }
    return <div>{interview.candidate?.name}</div>
}
