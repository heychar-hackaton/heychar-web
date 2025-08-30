import { hasAnyOrganisation } from "@/actions/organisations"
import { WIP } from "@/components/ui/wip"
import { EmptyOrganisationsState } from "./organisations/components/empty-state"

export default async function Home() {
  const hasOrganisations = await hasAnyOrganisation()

  if (!hasOrganisations) {
    return <EmptyOrganisationsState />
  }

  return <WIP />
}
