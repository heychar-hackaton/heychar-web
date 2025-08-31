import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getJobById } from "@/actions/jobs"
import { EditJobForm } from "../components/edit-form"

export const metadata: Metadata = {
  title: "Редактирование вакансии",
}

export default async function Page({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id)
  if (!job) {
    notFound()
  }

  return (
    <EditJobForm
      job={{
        id: job.id,
        name: job.name,
        description: job.description,
        organisationId: job.organisationId ?? null,
      }}
    />
  )
}
