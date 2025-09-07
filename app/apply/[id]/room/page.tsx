import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getInterviewForApply } from "@/actions/interviews"
import LiveKitRoomComponent from "@/app/apply/components/room"

export const metadata: Metadata = {
    title: "Собеседование",
}

export default async function Page(props: PageProps<"/apply/[id]/room">) {
    const params = await props.params
    const interview = await getInterviewForApply(params.id)
    if (!interview) {
        notFound()
    }

    const roomName = `interview-${interview.id}`
    const participantName = interview.candidate?.name || "Кандидат"
    const autoDispatchAgent = true

    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
                </div>
            }
        >
            <LiveKitRoomComponent
                autoDispatchAgent={autoDispatchAgent}
                participantName={participantName}
                roomName={roomName}
            />
        </Suspense>
    )
}
