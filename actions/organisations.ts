'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { organisationSecrets, organisations } from '@/db/data';
import type { FormResult } from '@/lib/types';
import { formError, okResult } from '@/lib/utils';
import { decryptString, encryptString, pack, unpack } from '@/utils/crypto';

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
  const yandexApiKeyRaw = (formData.get('yandexApiKey') as string) ?? '';
  const yandexFolderIdRaw = (formData.get('yandexFolderId') as string) ?? '';

  const orgSchema = z.object({
    name: z.string().nonempty('Имя организации не может быть пустым'),
    description: z
      .string()
      .nonempty('Описание организации не может быть пустым'),
    yandexApiKey: z.string().trim().min(1, 'YANDEX_API_KEY обязателен'),
    yandexFolderId: z.string().trim().min(1, 'YANDEX_FOLDER_ID обязателен'),
  });

  const org = orgSchema.safeParse({
    name,
    description,
    yandexApiKey: yandexApiKeyRaw,
    yandexFolderId: yandexFolderIdRaw,
  });

  if (!org.success) {
    return formError(org.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const inserted = await db
    .insert(organisations)
    .values({
      name,
      description,
      userId: session.user.id as string,
    })
    .returning({ id: organisations.id });

  const organisationId = inserted[0]?.id;
  if (organisationId) {
    const { yandexApiKey, yandexFolderId } = org.data;
    await setOrganisationSecrets({
      organisationId,
      yandexApiKey,
      yandexFolderId,
    });
  }

  redirect('/organisations');
};

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().nonempty('Имя организации не может быть пустым'),
  description: z.string().nonempty('Описание организации не может быть пустым'),
  yandexApiKey: z.string().trim().optional(),
  yandexFolderId: z.string().trim().optional(),
});

export const updateOrganisation = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const yandexApiKey = (formData.get('yandexApiKey') as string) || '';
  const yandexFolderId = (formData.get('yandexFolderId') as string) || '';

  const parsed = updateSchema.safeParse({
    id,
    name,
    description,
    yandexApiKey: yandexApiKey || undefined,
    yandexFolderId: yandexFolderId || undefined,
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

  await db
    .update(organisations)
    .set({ name, description })
    .where(eq(organisations.id, id));

  const secretsInput: {
    organisationId: string;
    yandexApiKey?: string;
    yandexFolderId?: string;
  } = { organisationId: id };
  if (yandexApiKey) {
    secretsInput.yandexApiKey = yandexApiKey;
  }
  if (yandexFolderId) {
    secretsInput.yandexFolderId = yandexFolderId;
  }
  if (secretsInput.yandexApiKey || secretsInput.yandexFolderId) {
    await setOrganisationSecrets(secretsInput);
  }

  redirect('/organisations');
};

const secretsSchema = z.object({
  organisationId: z.string().min(1),
  yandexApiKey: z.string().min(1).optional(),
  yandexFolderId: z.string().min(1).optional(),
});

// Server-only: set or update encrypted secrets for organisation
export async function setOrganisationSecrets(
  input: unknown
): Promise<FormResult> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const parsed = secretsSchema.safeParse(input);
  if (!parsed.success) {
    return formError(parsed.error.issues);
  }
  const { organisationId, yandexApiKey, yandexFolderId } = parsed.data;

  // Ensure organisation belongs to user
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, organisationId),
  });
  if (!org || org.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  const aad = organisationId; // bind ciphertexts to org id
  const apiKeyEnc = yandexApiKey
    ? pack(encryptString(yandexApiKey, aad))
    : undefined;
  const folderIdEnc = yandexFolderId
    ? pack(encryptString(yandexFolderId, aad))
    : undefined;

  // Upsert by primary key organisation_id
  await db
    .insert(organisationSecrets)
    .values({
      organisationId,
      apiKeyEnc: apiKeyEnc ?? undefined,
      folderIdEnc: folderIdEnc ?? undefined,
    })
    .onConflictDoUpdate({
      target: organisationSecrets.organisationId,
      set: {
        apiKeyEnc: apiKeyEnc ?? organisationSecrets.apiKeyEnc,
        folderIdEnc: folderIdEnc ?? organisationSecrets.folderIdEnc,
        updatedAt: new Date(),
      },
    });

  return okResult();
}

// Server-only: read decrypted secrets (only on server, do not expose to client)
export async function getOrganisationSecrets(organisationId: string): Promise<{
  yandexApiKey?: string;
  yandexFolderId?: string;
} | null> {
  const org = await db.query.organisations.findFirst({
    where: eq(organisations.id, organisationId),
    with: { secrets: true },
  });
  if (!org) {
    throw new Error(`Organisation ${organisationId} not found`);
  }
  if (!org.secrets) {
    return null;
  }

  const aad = organisationId;
  const res: { yandexApiKey?: string; yandexFolderId?: string } = {};
  if (org.secrets.apiKeyEnc) {
    res.yandexApiKey = decryptString(unpack(org.secrets.apiKeyEnc), aad);
  }
  if (org.secrets.folderIdEnc) {
    res.yandexFolderId = decryptString(unpack(org.secrets.folderIdEnc), aad);
  }
  return res;
}
