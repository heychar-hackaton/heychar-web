import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full items-center justify-between px-2 pt-2">
      <div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
        {table.getFilteredRowModel().rows.length > 20 && (
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm">Количество строк на странице</p>
            <Select
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getPageCount()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {table.getPageCount() > 1 && (
          <>
            <div className="flex w-[150px] items-center justify-center font-medium text-sm">
              Страница {table.getState().pagination.pageIndex + 1} из{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                variant="outline"
              >
                <span className="sr-only">Go to first page</span>
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8 p-0"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                variant="outline"
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                className="h-8 w-8 p-0"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                variant="outline"
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                variant="outline"
              >
                <span className="sr-only">Go to last page</span>
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
