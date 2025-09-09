import { eq } from 'drizzle-orm';
import { generateInterviewSummary } from '@/actions/ai';

import { db } from '@/db';
import { interviews, skills } from '@/db/data';
import type { TInterviewRecommendation } from '@/db/types';

type InterviewResult = {
  interview_id: string;
  start_time: string;
  end_time: string;
  recommendation: TInterviewRecommendation;
  overall_score: number;
  candidate_name: string;
  skills: {
    name: string;
    type: 'hard' | 'soft';
    score: number;
  }[];
  red_flags: string[];
  messages: {
    items: [
      {
        id: string;
        role: 'user' | 'assistant';
        content: string[];
        interrupted: boolean;
      },
    ];
  };
};

export async function POST(request: Request) {
  const data = (await request.json()) as InterviewResult;
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, data.interview_id),
  });

  if (!interview) {
    return Response.json({ error: 'Interview not found' }, { status: 404 });
  }

  await db
    .update(interviews)
    .set({
      recommendation: data.recommendation,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      status: 'completed',
      matchPercentage: data.overall_score.toString(),
      redFlags: data.red_flags.join('\n'),
      messages: data.messages.items.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content.join('\n'),
        interrupted: message.interrupted,
      })),
    })
    .where(eq(interviews.id, data.interview_id));

  await db
    .delete(skills)
    .where(eq(skills.candidateId, interview.candidateId as string));

  await db.insert(skills).values(
    data.skills.map((skill) => ({
      candidateId: interview.candidateId,
      name: skill.name,
      type: skill.type,
      value: skill.score.toString(),
    }))
  );

  const summary = await generateInterviewSummary(data.interview_id);

  if (summary.success) {
    await db
      .update(interviews)
      .set({ summary: summary.data.result.alternatives[0].message.text })
      .where(eq(interviews.id, data.interview_id));
  }

  return Response.json({ ok: true });
}
