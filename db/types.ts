import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { getCandidateById, getCandidates } from '@/actions/candidates';
import type { getInterviewById, getInterviews } from '@/actions/interviews';
import type { getJobs } from '@/actions/jobs';
import type { users } from './auth';
import type {
  interviewRecommendationEnum,
  organisations,
  skills,
} from './data';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type TUser = InferSelectModel<typeof users>;
export type TNewUser = InferInsertModel<typeof users>;

export type TOrganisation = InferSelectModel<typeof organisations>;
export type TNewOrganisation = InferInsertModel<typeof organisations>;

export type TJob = ArrayElement<Awaited<ReturnType<typeof getJobs>>>;

export type TCandidate = ArrayElement<
  Awaited<ReturnType<typeof getCandidates>>
>;

export type TCandidateInfo = NonNullable<
  Awaited<ReturnType<typeof getCandidateById>>
>;

export type TInterview = ArrayElement<
  Awaited<ReturnType<typeof getInterviews>>
>;
export type TInterviewInfo = NonNullable<
  Awaited<ReturnType<typeof getInterviewById>>
>;

export type TSkill = InferSelectModel<typeof skills>;
export type TNewSkill = InferInsertModel<typeof skills>;

export type TInterviewRecommendation =
  (typeof interviewRecommendationEnum)['enumValues'][number];
