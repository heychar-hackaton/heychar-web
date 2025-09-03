import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCandidateById } from "@/actions/candidates"
import { EditCandidateForm } from "../components/edit-form"

export const metadata: Metadata = {
    title: "Редактирование кандидата",
}

export default async function Page({ params }: { params: { id: string } }) {
    const candidate = await getCandidateById(params.id)
    if (!candidate) {
        notFound()
    }

    return (
        <EditCandidateForm
            candidate={{
                id: candidate.id,
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                description: candidate.description,
                createdAt: candidate.createdAt,
                job: candidate.job,
                archived: candidate.archived,
            }}
        />
    )
}
