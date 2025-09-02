import { IconPlus } from "@tabler/icons-react"
import EmptySearch from "@/components/illustrations/empty-search"
import { EmptyState } from "@/components/ui/empty-state"

export const EmptyCandidatesState = () => {
    return (
        <EmptyState
            description="Для продолжения необходимо добавить кандидата"
            illustration={<EmptySearch />}
            mainAction={{
                icon: <IconPlus className="size-4" />,
                title: "Создать",
                link: "/candidates/new",
            }}
            title="Нет кандидатов"
        />
    )
}
