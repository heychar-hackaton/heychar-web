'use server';

import { and, eq, isNotNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates, jobs, organisations } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';

export const getCandidates = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const candidatesList = await db
    .select({
      id: candidates.id,
      name: candidates.name,
      email: candidates.email,
      phone: candidates.phone,
      description: candidates.description,
      job: {
        id: jobs.id,
        name: jobs.name,
      },
    })
    .from(candidates)
    .leftJoin(jobs, eq(candidates.jobId, jobs.id))
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(
      and(
        isNotNull(candidates.jobId),
        isNotNull(jobs.organisationId),
        isNotNull(organisations.userId),
        eq(organisations.userId, session.user.id)
      )
    );

  return candidatesList;
};

export const getCandidateById = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const candidate = await db
    .select({
      id: candidates.id,
      name: candidates.name,
      email: candidates.email,
      phone: candidates.phone,
      description: candidates.description,
      jobId: candidates.jobId,
    })
    .from(candidates)
    .leftJoin(jobs, eq(candidates.jobId, jobs.id))
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(
      and(
        eq(candidates.id, id),
        isNotNull(candidates.jobId),
        isNotNull(jobs.organisationId),
        isNotNull(organisations.userId),
        eq(organisations.userId, session.user.id)
      )
    )
    .limit(1);

  if (candidate.length === 0) {
    return null;
  }

  return candidate[0];
};

const candidateFieldsSchema = z.object({
  name: z.string().optional().default(''),
  email: z.email('Неверный email').or(z.literal('')),
  phone: z.string().or(z.literal('')),
  jobId: z.string().min(1, 'Вакансия обязательна'),
  description: z.string().min(1, 'Описание обязательно'),
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
  const jobId = (formData.get('jobId') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const parsed = candidateBaseSchema.safeParse({
    name,
    email,
    phone,
    jobId,
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
    jobId: parsed.data.jobId || null,
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
  const jobId = (formData.get('jobId') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const parsed = updateCandidateSchema.safeParse({
    id,
    name,
    email,
    phone,
    jobId,
    description,
  });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const candidateCheck = await db
    .select({
      id: candidates.id,
    })
    .from(candidates)
    .leftJoin(jobs, eq(candidates.jobId, jobs.id))
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(
      and(
        eq(candidates.id, parsed.data.id),
        isNotNull(candidates.jobId),
        isNotNull(jobs.organisationId),
        isNotNull(organisations.userId),
        eq(organisations.userId, session.user.id)
      )
    )
    .limit(1);

  if (candidateCheck.length === 0) {
    throw new Error('Not found');
  }

  await db
    .update(candidates)
    .set({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      jobId: parsed.data.jobId || null,
      description: parsed.data.description || null,
    })
    .where(eq(candidates.id, parsed.data.id));

  redirect('/candidates');
};
