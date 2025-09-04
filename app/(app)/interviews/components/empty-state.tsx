import { IconPlus } from '@tabler/icons-react';
import EmptyChat from '@/components/illustrations/empty-chat';
import { EmptyState } from '@/components/ui/empty-state';

export const EmptyInterviewsState = () => {
  return (
    <EmptyState
      description="Для продожения необходимо создать собеседование"
      illustration={<EmptyChat />}
      mainAction={{
        icon: <IconPlus className="size-4" />,
        title: 'Создать',
        link: '/interviews/new',
      }}
      title="Нет собеседований"
    />
  );
};
