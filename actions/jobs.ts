'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { jobs, organisations } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';

export const getJobs = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const jobsList = await db
    .select({
      id: jobs.id,
      name: jobs.name,
      description: jobs.description,
      organisation: {
        id: organisations.id,
        name: organisations.name,
      },
    })
    .from(jobs)
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(eq(organisations.userId, session.user.id as string));

  return jobsList;
};

export const getJobById = async (id: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, id) });
  if (!job) {
    return null;
  }
  // ensure job belongs to current user via its organisation
  if (job.organisationId) {
    const org = await db.query.organisations.findFirst({
      where: eq(organisations.id, job.organisationId),
    });
    if (!org || org.userId !== (session.user.id as string)) {
      return null;
    }
  } else {
    return null;
  }
  return job;
};

export const createJob = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const organisationId = (formData.get('organisationId') as string) ?? '';
  const name = (formData.get('name') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const jobSchema = z.object({
    organisationId: z.string().min(1, 'Организация обязательна'),
    name: z.string().nonempty('Наименование не может быть пустым'),
    description: z.string().nonempty('Описание вакансии не может быть пустым'),
  });

  const parsed = jobSchema.safeParse({ organisationId, name, description });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Ensure organisation belongs to current user
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, organisationId),
  });
  if (!org || org.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  await db.insert(jobs).values({
    organisationId,
    name,
    description,
  });

  redirect('/jobs');
};

const updateJobSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1, 'Организация обязательна'),
  name: z.string().nonempty('Наименование не может быть пустым'),
  description: z.string().nonempty('Описание вакансии не может быть пустым'),
});

export const updateJob = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';
  const organisationId = (formData.get('organisationId') as string) ?? '';
  const name = (formData.get('name') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';

  const parsed = updateJobSchema.safeParse({
    id,
    organisationId,
    name,
    description,
  });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // fetch job and ensure ownership via its current organisation
  const job = await db.query.jobs.findFirst({ where: eq(jobs.id, id) });
  if (!job) {
    throw new Error('Not found');
  }
  const currentOrg = await db.query.organisations.findFirst({
    where: eq(organisations.id, job.organisationId as string),
  });
  if (!currentOrg || currentOrg.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  // ensure target organisation also belongs to user
  const targetOrg = await db.query.organisations.findFirst({
    where: eq(organisations.id, organisationId),
  });
  if (!targetOrg || targetOrg.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  await db
    .update(jobs)
    .set({ name, description, organisationId })
    .where(eq(jobs.id, id));

  redirect('/jobs');
};
