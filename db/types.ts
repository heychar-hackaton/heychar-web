import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { accounts, sessions, users, verificationTokens } from './auth';
import type {
  candidates,
  interviews,
  jobs,
  organisations,
  skills,
} from './data';

export type TUser = InferSelectModel<typeof users>;
export type TNewUser = InferInsertModel<typeof users>;

export type TOrganisation = InferSelectModel<typeof organisations>;
export type TNewOrganisation = InferInsertModel<typeof organisations>;

export type TJob = InferSelectModel<typeof jobs>;
export type TNewJob = InferInsertModel<typeof jobs>;

export type TCandidate = InferSelectModel<typeof candidates>;
export type TNewCandidate = InferInsertModel<typeof candidates>;

export type TInterview = InferSelectModel<typeof interviews>;
export type TNewInterview = InferInsertModel<typeof interviews>;

export type TSkill = InferSelectModel<typeof skills>;
export type TNewSkill = InferInsertModel<typeof skills>;
