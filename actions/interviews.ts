'use server';

import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates, interviews, jobs, organisations } from '@/db/data';

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
