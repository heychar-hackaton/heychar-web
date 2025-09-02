"use client"

import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
                },
                {
                    accessorKey: "phone",
                    header: "Телефон",
                },
                {
                    accessorKey: "name",
                    header: "Имя",
                    cell: ({ row }) => {
                        return row.original.name || "Без имени"
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
