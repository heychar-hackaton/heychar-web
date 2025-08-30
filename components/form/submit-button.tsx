'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

export function SubmitButton({
  children,
  className,
  tabIndex,
  autoFocus,
}: {
  children?: ReactNode;
  className?: string;
  tabIndex?: number;
  autoFocus?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      autoFocus={autoFocus}
      className={className}
      loading={pending}
      tabIndex={tabIndex}
      type="submit"
    >
      {children}
    </Button>
  );
}
