'use client';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { TOrganisation } from '@/db/types';
import useColumns from '@/hooks/use-columns';

export const OrganisationList = ({
  organisations,
}: {
  organisations: TOrganisation[];
}) => {
  const router = useRouter();
  const columns = useColumns<TOrganisation>(
    {
      columns: [
        {
          accessorKey: 'name',
          header: 'Наименование',
        },
      ],
      hideSelection: true,
    },
    []
  );

  return (
    <div>
      <DataTable
        actions={() => (
          <Link href={'/organisations/new'}>
            <Button size={'sm'}>
              <IconPlus className="size-4" />
              Добавить
            </Button>
          </Link>
        )}
        columns={columns}
        data={organisations}
        onRowClick={(row) => {
          router.push(`/organisations/${row.original.id}`);
        }}
        rowClassName="cursor-pointer"
      />
    </div>
  );
};
