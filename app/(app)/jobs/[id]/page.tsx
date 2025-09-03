import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getJobById } from "@/actions/jobs"
import { EditJobForm } from "../components/edit-form"

export const metadata: Metadata = {
    title: "Редактирование вакансии",
}

export default async function Page(props: PageProps<"/jobs/[id]">) {
    const params = await props.params
    const job = await getJobById(params.id)
    if (!job) {
        notFound()
    }

    return <EditJobForm job={job} />
}
