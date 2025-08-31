import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const FormField = ({ children, className }: Props) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>{children}</div>
  );
};
