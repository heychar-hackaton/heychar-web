import type { Metadata } from "next"
import { getOrganisations } from "@/actions/organisations"
import { EmptyOrganisationsState } from "./components/empty-state"
import { OrganisationList } from "./components/list"

export const metadata: Metadata = {
  title: "Организации",
}
export default async function Page() {
  const orgs = await getOrganisations()

  if (!orgs.length) {
    return <EmptyOrganisationsState />
  }

  return <OrganisationList organisations={orgs} />
}
