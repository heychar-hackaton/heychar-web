import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCandidateById } from "@/actions/candidates"

import { EditCandidateForm } from "../components/edit-form"

export const metadata: Metadata = {
    title: "Редактирование кандидата",
}

export default async function Page(props: PageProps<"/candidates/[id]">) {
    const params = await props.params
    const candidate = await getCandidateById(params.id)
    if (!candidate) {
        notFound()
    }

    return <EditCandidateForm candidate={candidate} />
}
