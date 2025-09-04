import type { Metadata } from "next"
import { getInterviews } from "@/actions/interviews"
import { EmptyInterviewsState } from "./components/empty-state"
import { InterviewList } from "./components/list"

export const metadata: Metadata = {
    title: "Собеседования",
}

export default async function Page() {
    const interviews = await getInterviews()

    if (interviews.length === 0) {
        return <EmptyInterviewsState />
    }

    return <InterviewList interviews={interviews} />
}
