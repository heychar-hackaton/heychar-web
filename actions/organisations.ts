'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { organisations } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError, okResult } from '@/lib/utils';

export async function hasAnyOrganisation() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.userId, session.user.id as string),
  });

  return !!org;
}

export const createOrganisation = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const orgSchema = z.object({
    name: z.string().nonempty('Имя организации не может быть пустым'),
    description: z
      .string()
      .nonempty('Описание организации не может быть пустым'),
  });

  const org = orgSchema.safeParse({
    name,
    description,
  });

  if (!org.success) {
    return formError(org.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  await db.insert(organisations).values({
    name,
    description,
    userId: session.user.id as string,
  });

  return okResult();
};
