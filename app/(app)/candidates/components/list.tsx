"use client"

import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { TCandidate } from "@/db/types"
import useColumns from "@/hooks/use-columns"

export const CandidateList = ({ candidates }: { candidates: TCandidate[] }) => {
    const router = useRouter()
    const columns = useColumns<TCandidate>(
        {
            columns: [
                {
                    accessorKey: "email",
                    header: "Email",
                    cell: ({ row }) => {
                        return row.original.email ? (
                            row.original.email
                        ) : (
                            <span className="text-muted-foreground">
                                Не указан
                            </span>
                        )
                    },
                },
                {
                    accessorKey: "phone",
                    header: "Телефон",
                    cell: ({ row }) => {
                        return row.original.phone ? (
                            row.original.phone
                        ) : (
                            <span className="text-muted-foreground">
                                Не указан
                            </span>
                        )
                    },
                },
                {
                    accessorKey: "name",
                    header: "Имя",
                    cell: ({ row }) => {
                        return row.original.name ? (
                            row.original.name
                        ) : (
                            <span className="text-muted-foreground">
                                Не указано
                            </span>
                        )
                    },
                },
                {
                    accessorKey: "job.name",
                    header: "Вакансия",
                },
                {
                    accessorKey: "archived",
                    header: "Статус",
                    cell: ({ row }) => {
                        return row.original.archived ? (
                            <Badge variant="destructive">В архиве</Badge>
                        ) : (
                            <Badge variant="default">Активен</Badge>
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
                    <Link href={"/candidates/new"}>
                        <Button size={"sm"}>
                            <IconPlus className="size-4" />
                            Добавить
                        </Button>
                    </Link>
                )}
                columns={columns}
                data={candidates}
                onRowClick={(row) => {
                    router.push(`/candidates/${row.original.id}`)
                }}
                rowClassName="cursor-pointer"
            />
        </div>
    )
}
