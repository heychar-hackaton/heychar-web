"use client"

import useColumns from "@/hooks/use-columns"
import { DataTable } from "@/components/ui/data-table"
import { useRouter } from "next/navigation"
import { TJob } from "@/db/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

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
      ],
      hideSelection: true,
    },
    []
  )

  return (
    <div>
      <DataTable
        columns={columns}
        data={jobs}
        actions={() => (
          <Link href={"/jobs/new"}>
            <Button size={"sm"}>
              <IconPlus className="size-4" />
              Добавить
            </Button>
          </Link>
        )}
        onRowClick={(row) => {
          router.push(`/jobs/${row.original.id}`)
        }}
        rowClassName="cursor-pointer"
      />
    </div>
  )
}
