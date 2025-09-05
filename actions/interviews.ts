'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates, interviews, jobs, organisations, skills } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';

export const getInterviews = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const interviewsList = await db
    .select({
      id: interviews.id,
      completed: interviews.completed,
      summary: interviews.summary,
      recordingUrl: interviews.recordingUrl,
      matchPercentage: interviews.matchPercentage,
      recommendation: interviews.recommendation,
      startTime: interviews.startTime,
      endTime: interviews.endTime,
      organisation: {
        id: organisations.id,
        name: organisations.name,
      },
      job: {
        id: jobs.id,
        name: jobs.name,
      },
      candidate: {
        id: candidates.id,
        name: candidates.name,
        email: candidates.email,
      },
    })
    .from(interviews)
    .leftJoin(organisations, eq(interviews.organisationId, organisations.id))
    .leftJoin(jobs, eq(interviews.jobId, jobs.id))
    .leftJoin(candidates, eq(interviews.candidateId, candidates.id))
    .where(eq(organisations.userId, session.user.id as string));

  return interviewsList;
};

export const getInterviewById = async (interviewId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Получаем основную информацию об интервью с данными кандидата и вакансии
  const interviewData = await db
    .select({
      id: interviews.id,
      completed: interviews.completed,
      summary: interviews.summary,
      recordingUrl: interviews.recordingUrl,
      matchPercentage: interviews.matchPercentage,
      recommendation: interviews.recommendation,
      startTime: interviews.startTime,
      endTime: interviews.endTime,
      messages: interviews.messages,
      organisation: {
        id: organisations.id,
        name: organisations.name,
        description: organisations.description,
      },
      job: {
        id: jobs.id,
        name: jobs.name,
        description: jobs.description,
        archived: jobs.archived,
        createdAt: jobs.createdAt,
      },
      candidate: {
        id: candidates.id,
        name: candidates.name,
        email: candidates.email,
        phone: candidates.phone,
        description: candidates.description,
        archived: candidates.archived,
        createdAt: candidates.createdAt,
      },
    })
    .from(interviews)
    .leftJoin(organisations, eq(interviews.organisationId, organisations.id))
    .leftJoin(jobs, eq(interviews.jobId, jobs.id))
    .leftJoin(candidates, eq(interviews.candidateId, candidates.id))
    .where(
      and(
        eq(interviews.id, interviewId),
        eq(organisations.userId, session.user.id as string)
      )
    );

  if (!interviewData.length) {
    throw new Error('Interview not found');
  }

  const interview = interviewData[0];

  // Получаем навыки кандидата
  const candidateSkills = await db
    .select({
      id: skills.id,
      name: skills.name,
      type: skills.type,
      value: skills.value,
    })
    .from(skills)
    .where(eq(skills.candidateId, interview.candidate?.id || ''));

  return {
    ...interview,
    candidate: interview.candidate
      ? {
          ...interview.candidate,
          skills: candidateSkills,
        }
      : null,
  };
};

export const createInterviews = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const jobId = (formData.get('jobId') as string) ?? '';
  const candidateIds = formData.getAll('candidateIds') as string[];

  const interviewSchema = z.object({
    jobId: z.string().min(1, 'Вакансия обязательна'),
    candidateIds: z
      .array(z.string())
      .min(1, 'Выберите хотя бы одного кандидата'),
  });

  const parsed = interviewSchema.safeParse({ jobId, candidateIds });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Проверяем, что вакансия принадлежит пользователю
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
    with: {
      organisation: true,
    },
  });

  if (
    !job?.organisation ||
    job.organisation.userId !== (session.user.id as string)
  ) {
    throw new Error('Forbidden');
  }

  // Проверяем, что все кандидаты принадлежат этой вакансии
  const candidatesList = await db
    .select({
      id: candidates.id,
      jobId: candidates.jobId,
    })
    .from(candidates)
    .where(
      and(
        eq(candidates.jobId, jobId),
        // Проверяем, что все выбранные кандидаты существуют и принадлежат этой вакансии
        ...candidateIds.map((id) => eq(candidates.id, id))
      )
    );

  if (candidatesList.length !== candidateIds.length) {
    throw new Error(
      'Некоторые кандидаты не найдены или не принадлежат выбранной вакансии'
    );
  }

  // Создаем интервью для каждого кандидата
  const interviewsToCreate = candidateIds.map((candidateId) => ({
    organisationId: job.organisationId,
    jobId,
    candidateId,
    completed: false,
  }));

  await db.insert(interviews).values(interviewsToCreate);

  redirect('/interviews');
};
