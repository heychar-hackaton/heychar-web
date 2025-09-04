'use server';

import { and, eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates, interviews, jobs, organisations, skills } from '@/db/data';

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
