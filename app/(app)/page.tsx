import { IconPlus } from "@tabler/icons-react"
import { hasAnyOrganisation } from "@/actions/organisations"
import EmptyBox from "@/components/illustrations/empty-box"
import { EmptyState } from "@/components/ui/empty-state"
import { WIP } from "@/components/ui/wip"

export default async function Home() {
  const hasOrganisations = await hasAnyOrganisation()

  if (!hasOrganisations) {
    return (
      <EmptyState
        description="Для начала работы создайте организацию"
        illustration={<EmptyBox />}
        mainAction={{
          icon: <IconPlus className="size-4" />,
          title: "Создать",
          link: "/organisations/new",
        }}
        title="Нет организаций"
      />
    )
  }

  return <WIP />
}
