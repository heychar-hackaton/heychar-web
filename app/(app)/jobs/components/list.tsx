"use client"

import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { TJob } from "@/db/types"
import useColumns from "@/hooks/use-columns"

export const JobList = ({ jobs }: { jobs: TJob[] }) => {
    const router = useRouter()
    const columns = useColumns<TJob>(
        {
            columns: [
                {
                    accessorKey: "name",
                    header: "Наименование",
                },
                {
                    accessorKey: "organisation.name",
                    header: "Организация",
                },
                {
                    accessorKey: "archived",
                    header: "Статус",
                    cell: ({ row }) => {
                        return row.original.archived ? (
                            <Badge variant="destructive">В архиве</Badge>
                        ) : (
                            <Badge variant="default">Активна</Badge>
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
                    <Link href={"/jobs/new"}>
                        <Button size={"sm"}>
                            <IconPlus className="size-4" />
                            Добавить
                        </Button>
                    </Link>
                )}
                columns={columns}
                data={jobs}
                onRowClick={(row) => {
                    router.push(`/jobs/${row.original.id}`)
                }}
                rowClassName="cursor-pointer"
            />
        </div>
    )
}
