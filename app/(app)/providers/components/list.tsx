"use client"

import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import useColumns from "@/hooks/use-columns"

type Provider = {
    id: string
    name: string
    type: "yandex" | "openai"
    createdAt: Date
}

export const ProviderList = ({ providers }: { providers: Provider[] }) => {
    const router = useRouter()
    const columns = useColumns<Provider>(
        {
            columns: [
                {
                    accessorKey: "name",
                    header: "Название",
                },
                {
                    accessorKey: "type",
                    header: "Тип",
                    cell: ({ row }) => {
                        return (
                            <Badge variant="secondary">
                                {row.original.type === "yandex"
                                    ? "Яндекс"
                                    : "OpenAI"}
                            </Badge>
                        )
                    },
                },
            ],
            hideSelection: true,
        },
        []
    )

    return (
        <div>
            <DataTable
                actions={() => (
                    <Link href={"/providers/new"}>
                        <Button size={"sm"}>
                            <IconPlus className="size-4" />
                            Добавить
                        </Button>
                    </Link>
                )}
                columns={columns}
                data={providers}
                onRowClick={(row) => {
                    router.push(`/providers/${row.original.id}`)
                }}
                rowClassName="cursor-pointer"
            />
        </div>
    )
}
