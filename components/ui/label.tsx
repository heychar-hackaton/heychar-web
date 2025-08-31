'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { IconQuestionMark } from '@tabler/icons-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

function Label({
  className,
  required,
  hint,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full items-center gap-1', className)}>
      <LabelPrimitive.Root
        className={cn(
          'flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
          className,
          required && 'after:text-red-500 after:content-["*"]'
        )}
        data-slot="label"
        {...props}
      />
      {hint && (
        <Popover>
          <PopoverTrigger className="cursor-pointer rounded-full border border-input bg-foreground text-background">
            <IconQuestionMark className="size-3" />
          </PopoverTrigger>
          <PopoverContent align="center" side="left">
            {hint}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export { Label };
