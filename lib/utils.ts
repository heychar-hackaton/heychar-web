import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type z from 'zod';
import type { FormResult } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formError = (issues: z.core.$ZodIssue[]): FormResult => {
  return {
    errors: issues.map((issue) => issue.message),
    success: false,
  };
};

export const okResult = <T = object>(data?: T): FormResult<T> => {
  return {
    data,
    success: true,
  };
};
