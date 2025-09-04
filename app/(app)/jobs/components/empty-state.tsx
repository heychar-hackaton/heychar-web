import { IconPlus } from '@tabler/icons-react';
import EmptyAdd from '@/components/illustrations/empty-add';
import { EmptyState } from '@/components/ui/empty-state';

export const EmptyJobsState = () => {
  return (
    <EmptyState
      description="Для продожения необходимо создать вакансию"
      illustration={<EmptyAdd />}
      mainAction={{
        icon: <IconPlus className="size-4" />,
        title: 'Создать',
        link: '/jobs/new',
      }}
      title="Нет вакансий"
    />
  );
};
