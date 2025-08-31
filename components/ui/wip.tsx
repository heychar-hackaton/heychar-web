import EmptyWindow from '../illustrations/empty-window';
import { EmptyState } from './empty-state';

export const WIP = () => {
  return (
    <EmptyState
      description="Но очень стараемся это сделать"
      illustration={<EmptyWindow />}
      title="Мы пока что это не реализовали"
    />
  );
};
