import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getOrganisationById,
  getOrganisationSecrets,
} from "@/actions/organisations"
import { EditOrganisationForm } from "../components/edit-form"

export const metadata: Metadata = {
  title: "Редактирование",
}

export default async function Page(props: PageProps<"/organisations/[id]">) {
  const params = await props.params
  const organisation = await getOrganisationById(params.id)
  if (!organisation) {
    notFound()
  }

  const secrets = await getOrganisationSecrets(organisation.id)
  console.log(secrets)

  return <EditOrganisationForm org={organisation} />
}
