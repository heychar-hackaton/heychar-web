'use server';

import { IconBriefcase, IconPhone, IconUsers } from '@tabler/icons-react';
import { and, count, eq, gt, isNotNull } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { candidates, interviews, jobs, organisations } from '@/db/data';
import type { TStat } from '@/lib/types';

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Get count of active jobs for the user
  const activeJobsResult = await db
    .select({ count: count() })
    .from(jobs)
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(
      and(eq(organisations.userId, session.user.id), eq(jobs.archived, false))
    );

  // Get count of active candidates for the user
  const activeCandidatesResult = await db
    .select({ count: count() })
    .from(candidates)
    .leftJoin(jobs, eq(candidates.jobId, jobs.id))
    .leftJoin(organisations, eq(jobs.organisationId, organisations.id))
    .where(
      and(
        eq(organisations.userId, session.user.id),
        eq(candidates.archived, false),
        isNotNull(candidates.jobId)
      )
    );

  // Get count of upcoming interviews for the user
  const upcomingInterviewsResult = await db
    .select({ count: count() })
    .from(interviews)
    .leftJoin(organisations, eq(interviews.organisationId, organisations.id))
    .where(
      and(
        eq(organisations.userId, session.user.id),
        eq(interviews.completed, false),
        isNotNull(interviews.startTime),
        gt(interviews.startTime, new Date())
      )
    );

  const stats: TStat[] = [
    {
      label: 'Вакансии',
      icon: IconBriefcase,
      value: activeJobsResult[0]?.count || 0,
      description: 'активных',
      link: '/jobs',
    },
    {
      label: 'Кандидаты',
      icon: IconUsers,
      value: activeCandidatesResult[0]?.count || 0,
      description: 'активных',
      link: '/candidates',
    },
    {
      label: 'Собеседования',
      icon: IconPhone,
      value: upcomingInterviewsResult[0]?.count || 0,
      description: 'планируемых',
      link: '/interviews',
    },
  ];

  return {
    stats,
  };
}
