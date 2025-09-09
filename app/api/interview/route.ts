import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { interviews } from '@/db/data';
import type { TInterviewRecommendation } from '@/db/types';

type InterviewResult = {
  interviewId: string;
  recommendation: TInterviewRecommendation;
  overall_score: number;
  candidate_name: string;
  skills: {
    name: string;
    type: 'hard' | 'soft';
    score: number;
  }[];
};

export async function POST(request: Request) {
  const { interviewId } = (await request.json()) as InterviewResult;
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, interviewId),
  });

  if (!interview) {
    return Response.json({ error: 'Interview not found' }, { status: 404 });
  }

  return Response.json({ ok: true });
}
