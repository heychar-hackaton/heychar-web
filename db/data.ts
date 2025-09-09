import { relations } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './auth';

// -------------------- ENUMS --------------------
export const skillTypeEnum = pgEnum('skill_type_enum', ['hard', 'soft']);
export const interviewRecommendationEnum = pgEnum(
  'interview_recommendation_enum',
  ['next_stage', 'rejection', 'needs_clarification']
);
export const interviewStatusEnum = pgEnum('interview_status_enum', [
  'scheduled',
  'in_progress',
  'paused',
  'completed',
  'cancelled',
]);
export const providerEnum = pgEnum('provider_enum', ['yandex', 'openai']);

// -------------------- Domain tables --------------------
export const providers = pgTable('providers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  type: providerEnum('type').notNull(),
  apiKeyEnc: text('api_key_enc').notNull(),
  folderIdEnc: text('folder_id_enc'), // Only for Yandex
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});
export const organisations = pgTable('organisations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  providerId: text('provider_id')
    .notNull()
    .references(() => providers.id, {
      onDelete: 'set null',
    }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
});

export const jobs = pgTable('jobs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  organisationId: text('organisation_id').references(() => organisations.id, {
    onDelete: 'cascade',
  }),
  hardSkillsScore: real('hard_skills_score').default(0.5),
  softSkillsScore: real('soft_skills_score').default(0.5),
  archived: boolean('archived').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});

export const candidates = pgTable('candidates', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  description: text('description'),
  jobId: text('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  archived: boolean('archived').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
});

export const interviews = pgTable('interviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  organisationId: text('organisation_id').references(() => organisations.id, {
    onDelete: 'set null',
  }),
  jobId: text('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  candidateId: text('candidate_id').references(() => candidates.id, {
    onDelete: 'cascade',
  }),
  status: interviewStatusEnum('status').default('scheduled').notNull(),
  messages:
    jsonb('messages').$type<
      {
        role: 'user' | 'assistant';
        content: string;
      }[]
    >(),
  summary: text('summary'),
  recordingUrl: text('recording_url'),
  matchPercentage: numeric('match_percentage'),
  recommendation: interviewRecommendationEnum('recommendation'),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }),
  endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }),
});

export const skills = pgTable('skills', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  candidateId: text('candidate_id').references(() => candidates.id, {
    onDelete: 'cascade',
  }),
  name: text('name').notNull(),
  type: skillTypeEnum('type'),
  value: numeric('value'),
});

// -------------------- Relations --------------------

export const providersRelations = relations(providers, ({ one, many }) => ({
  owner: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
  organisations: many(organisations),
}));

export const organisationsRelations = relations(
  organisations,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [organisations.userId],
      references: [users.id],
    }),
    provider: one(providers, {
      fields: [organisations.providerId],
      references: [providers.id],
    }),
    jobs: many(jobs),
    interviews: many(interviews),
  })
);

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [jobs.organisationId],
    references: [organisations.id],
  }),
  interviews: many(interviews),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  job: one(jobs, { fields: [candidates.jobId], references: [jobs.id] }),
  interviews: many(interviews),
  skills: many(skills),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  organisation: one(organisations, {
    fields: [interviews.organisationId],
    references: [organisations.id],
  }),
  job: one(jobs, { fields: [interviews.jobId], references: [jobs.id] }),
  candidate: one(candidates, {
    fields: [interviews.candidateId],
    references: [candidates.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  candidate: one(candidates, {
    fields: [skills.candidateId],
    references: [candidates.id],
  }),
}));
