'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';

export const getCandidates = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const candidatesList = await db.select().from(candidates);

  return candidatesList;
};

export const getCandidateById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const candidate = await db.query.candidates.findFirst({
    where: eq(candidates.id, id),
  });
  if (!candidate) {
    return null;
  }
  return candidate;
};

const candidateFieldsSchema = z.object({
  name: z.string().optional().default(''),
  email: z.email('Неверный email').or(z.literal('')),
  phone: z.string().or(z.literal('')),
  description: z.string().or(z.literal('')).optional().default(''),
});

const candidateBaseSchema = candidateFieldsSchema.refine(
  (val) => val.email !== '' || val.phone !== '',
  {
    message: 'Укажите email или телефон',
    path: ['email'],
  }
);

export const createCandidate = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const name = (formData.get('name') as string) ?? '';
  const email = (formData.get('email') as string) ?? '';
  const phone = (formData.get('phone') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const parsed = candidateBaseSchema.safeParse({
    name,
    email,
    phone,
    description,
  });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await db.insert(candidates).values({
    name: parsed.data.name || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    description: parsed.data.description || null,
  });

  redirect('/candidates');
};

const updateCandidateSchema = candidateFieldsSchema
  .extend({ id: z.string().min(1) })
  .refine((val) => val.email !== '' || val.phone !== '', {
    message: 'Укажите email или телефон',
    path: ['email'],
  });

export const updateCandidate = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';
  const name = (formData.get('name') as string) ?? '';
  const email = (formData.get('email') as string) ?? '';
  const phone = (formData.get('phone') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const parsed = updateCandidateSchema.safeParse({
    id,
    name,
    email,
    phone,
    description,
  });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const candidate = await db.query.candidates.findFirst({
    where: eq(candidates.id, parsed.data.id),
  });
  if (!candidate) {
    throw new Error('Not found');
  }

  await db
    .update(candidates)
    .set({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      description: parsed.data.description || null,
    })
    .where(eq(candidates.id, parsed.data.id));

  redirect('/candidates');
};
