import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { accounts, sessions, users, verificationTokens } from './auth';
import type { candidates, interviews, jobs, organisations, skills } from './data';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type NewVerificationToken = InferInsertModel<typeof verificationTokens>;

export type organisation = InferSelectModel<typeof organisations>;
export type Neworganisation = InferInsertModel<typeof organisations>;

export type Job = InferSelectModel<typeof jobs>;
export type NewJob = InferInsertModel<typeof jobs>;

export type Candidate = InferSelectModel<typeof candidates>;
export type NewCandidate = InferInsertModel<typeof candidates>;

export type Interview = InferSelectModel<typeof interviews>;
export type NewInterview = InferInsertModel<typeof interviews>;

export type Skill = InferSelectModel<typeof skills>;
export type NewSkill = InferInsertModel<typeof skills>;
