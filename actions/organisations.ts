'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { organisations, providers } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';
import { decryptString, unpack } from '@/utils/crypto';

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

export async function getOrganisations() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const orgs = await db.query.organisations.findMany({
    where: eq(organisations.userId, session.user.id as string),
  });

  return orgs;
}

export async function getOrganisationById(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, id),
    with: {
      provider: true,
    },
  });
  if (!org || org.userId !== (session.user.id as string)) {
    return null;
  }
  return org;
}

export const createOrganisation = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const providerId = formData.get('providerId') as string;

  const orgSchema = z.object({
    name: z.string().nonempty('Имя организации не может быть пустым'),
    description: z
      .string()
      .nonempty('Описание организации не может быть пустым'),
    providerId: z.string().nonempty('Необходимо выбрать провайдера'),
  });

  const org = orgSchema.safeParse({
    name,
    description,
    providerId,
  });

  if (!org.success) {
    return formError(org.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Verify provider belongs to user if provided
  if (providerId) {
    const provider = await db.query.providers.findFirst({
      where: eq(providers.id, providerId),
    });
    if (!provider || provider.userId !== (session.user.id as string)) {
      return formError([
        {
          code: 'custom',
          message: 'Выбранный провайдер не найден',
          path: ['providerId'],
        },
      ]);
    }
  }

  await db.insert(organisations).values({
    name,
    description,
    providerId: org.data.providerId,
    userId: session.user.id as string,
  });

  redirect('/organisations');
};

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().nonempty('Имя организации не может быть пустым'),
  description: z.string().nonempty('Описание организации не может быть пустым'),
  providerId: z.string().nonempty('Необходимо выбрать провайдера'),
});

export const updateOrganisation = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const providerId = (formData.get('providerId') as string) || '';

  const parsed = updateSchema.safeParse({
    id,
    name,
    description,
    providerId,
  });
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, id),
  });
  if (!org || org.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  // Verify provider belongs to user if provided
  if (providerId) {
    const provider = await db.query.providers.findFirst({
      where: eq(providers.id, providerId),
    });
    if (!provider || provider.userId !== (session.user.id as string)) {
      return formError([
        {
          code: 'custom',
          message: 'Выбранный провайдер не найден',
          path: ['providerId'],
        },
      ]);
    }
  }

  await db
    .update(organisations)
    .set({
      name,
      description,
      providerId: parsed.data.providerId,
    })
    .where(eq(organisations.id, id));

  redirect('/organisations');
};

// Server-only: read decrypted secrets for organisation's provider
export async function getOrganisationSecrets(organisationId: string): Promise<{
  provider: 'yandex' | 'openai';
  apiKey: string;
  folderId?: string; // Only for Yandex
}> {
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, organisationId),
    with: { provider: true },
  });
  if (!org) {
    throw new Error(`Organisation ${organisationId} not found`);
  }

  const aad = org.userId ?? ''; // bind ciphertexts to user id
  const apiKey = decryptString(unpack(org.provider.apiKeyEnc), aad);

  if (org.provider.type === 'yandex' && org.provider.folderIdEnc) {
    const folderId = decryptString(unpack(org.provider.folderIdEnc), aad);
    return {
      provider: 'yandex',
      apiKey,
      folderId,
    };
  }

  if (org.provider.type === 'openai') {
    return {
      provider: 'openai',
      apiKey,
    };
  }

  // This should never happen as provider is required
  throw new Error('Unknown provider type');
}
