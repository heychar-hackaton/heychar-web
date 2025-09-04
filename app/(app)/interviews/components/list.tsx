'use client';

import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { TInterview } from '@/db/types';
import useColumns from '@/hooks/use-columns';

export const InterviewList = ({ interviews }: { interviews: TInterview[] }) => {
  const router = useRouter();
  const columns = useColumns<TInterview>(
    {
      columns: [
        {
          accessorKey: 'candidate.name',
          header: 'Кандидат',
        },
        {
          accessorKey: 'job.name',
          header: 'Вакансия',
        },
        {
          accessorKey: 'organisation.name',
          header: 'Организация',
        },
        {
          accessorKey: 'completed',
          header: 'Статус',
          cell: ({ row }) => {
            return row.original.completed ? (
              <Badge variant="default">Завершено</Badge>
            ) : (
              <Badge variant="secondary">В процессе</Badge>
            );
          },
        },
        {
          accessorKey: 'startTime',
          header: 'Дата начала',
          cell: ({ row }) => {
            const startTime = row.original.startTime;
            return startTime
              ? new Date(startTime).toLocaleDateString('ru-RU')
              : '-';
          },
        },
        {
          accessorKey: 'matchPercentage',
          header: 'Совпадение',
          cell: ({ row }) => {
            const matchPercentage = row.original.matchPercentage;
            return matchPercentage ? `${Number(matchPercentage)}%` : '-';
          },
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
          <>
            <Link href={'/interviews/new'}>
              <Button size={'sm'}>
                <IconPlus className="size-4" />
                Добавить
              </Button>
            </Link>
          </>
        )}
        columns={columns}
        data={interviews}
        onRowClick={(row) => {
          router.push(`/interviews/${row.original.id}`);
        }}
        rowClassName="cursor-pointer"
      />
    </div>
  );
};
