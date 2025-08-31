import { IconPlus } from '@tabler/icons-react';
import EmptyBox from '@/components/illustrations/empty-box';
import { EmptyState } from '@/components/ui/empty-state';

export const EmptyOrganisationsState = () => {
  return (
    <EmptyState
      description="Для начала работы создайте организацию"
      illustration={<EmptyBox />}
      mainAction={{
        icon: <IconPlus className="size-4" />,
        title: 'Создать',
        link: '/organisations/new',
      }}
      title="Нет организаций"
    />
  );
};
