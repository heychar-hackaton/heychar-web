import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProviderById } from "@/actions/providers"
import { EditProviderForm } from "../components/edit-form"

export const metadata: Metadata = {
    title: "Редактирование провайдера",
}

export default async function Page(props: PageProps<"/providers/[id]">) {
    const params = await props.params
    const provider = await getProviderById(params.id)
    if (!provider) {
        notFound()
    }

    return <EditProviderForm provider={provider} />
}
