import { IconPlus } from "@tabler/icons-react"
import EmptyBox from "@/components/illustrations/empty-box"
import { EmptyState } from "@/components/ui/empty-state"

export const EmptyProvidersState = () => {
    return (
        <EmptyState
            description="Для работы с AI необходимо создать провайдера"
            illustration={<EmptyBox />}
            mainAction={{
                icon: <IconPlus className="size-4" />,
                title: "Создать",
                link: "/providers/new",
            }}
            title="Нет провайдеров"
        />
    )
}
