'use client';

import { IconDotsVertical } from '@tabler/icons-react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type React from 'react';
import { type DependencyList, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props<TData, TValue> {
  hideSelection?: boolean;
  actions?: (props: CellContext<TData, TValue>) => React.JSX.Element;
  columns: ColumnDef<TData, TValue>[];
}

function useColumns<TData, TValue = unknown>(
  { hideSelection, actions, columns }: Props<TData, TValue>,
  deps: DependencyList
): ColumnDef<TData, TValue>[] {
  return useMemo(() => {
    const result: ColumnDef<TData, TValue>[] = [];

    if (!hideSelection) {
      result.push(SelectColumn());
    }

    result.push(...columns);

    if (actions) {
      result.push(ActionsColumn(actions));
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // biome-ignore lint/correctness/useExhaustiveDependencies: react types
  }, deps);
}

export default useColumns;

function SelectColumn<TData, TValue>() {
  return {
    id: 'select',
    size: 34,
    header: ({ table }) => (
      <Checkbox
        aria-label="Выбрать все"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Выбрать строку"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  } as ColumnDef<TData, TValue>;
}

function ActionsColumn<TData, TValue>(
  items: (props: CellContext<TData, TValue>) => React.JSX.Element
) {
  return {
    id: 'actions',
    size: 48,
    cell: (props) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Открыть меню</span>
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">{items(props)}</DropdownMenuContent>
        </DropdownMenu>
      );
    },
  } as ColumnDef<TData, TValue>;
}
