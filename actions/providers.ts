'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import { organisations, providers } from '@/db/schema';
import type { FormResult } from '@/lib/types';
import { formError } from '@/lib/utils';
import { encryptString, pack } from '@/utils/crypto';

// Provider management functions
export async function getProviders() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const userProviders = await db.query.providers.findMany({
    where: eq(providers.userId, session.user.id as string),
    orderBy: (providers, { desc }) => [desc(providers.createdAt)],
  });
  return userProviders;
}

export async function getProviderById(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  const provider = await db.query.providers.findFirst({
    where: eq(providers.id, id),
  });
  if (!provider || provider.userId !== (session.user.id as string)) {
    return null;
  }
  return provider;
}

// Provider creation and management
export const createProvider = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'yandex' | 'openai';
  const apiKey = formData.get('apiKey') as string;
  const folderId = formData.get('folderId') as string;

  const providerSchema = z
    .object({
      name: z.string().nonempty('Название провайдера не может быть пустым'),
      type: z.enum(['yandex', 'openai']),
      apiKey: z.string().nonempty('API ключ не может быть пустым'),
      folderId: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.type === 'yandex' && !data.folderId) {
          return false;
        }
        return true;
      },
      {
        message: 'Для Яндекс провайдера необходимо указать ID каталога',
      }
    );

  const parsed = providerSchema.safeParse({
    name,
    type,
    apiKey,
    folderId: folderId || undefined,
  });

  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Encrypt API key and folder ID
  const aad = process.env.ENCRYPTION_KEY || '';
  const apiKeyEnc = pack(encryptString(apiKey, aad));
  const folderIdEnc = folderId ? pack(encryptString(folderId, aad)) : undefined;

  await db.insert(providers).values({
    name: parsed.data.name,
    type: parsed.data.type,
    apiKeyEnc,
    folderIdEnc,
    userId: session.user.id as string,
  });

  redirect('/providers');
};

export const updateProvider = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'yandex' | 'openai';
  const apiKey = formData.get('apiKey') as string;
  const folderId = formData.get('folderId') as string;

  const providerSchema = z
    .object({
      id: z.string().min(1),
      name: z.string().nonempty('Название провайдера не может быть пустым'),
      type: z.enum(['yandex', 'openai']),
      apiKey: z.string().optional(),
      folderId: z.string().optional(),
    })
    .refine(
      (data) => {
        // Only validate if user is trying to update API keys (non-empty values)
        if (data.type === 'yandex' && (data.apiKey || data.folderId)) {
          return data.apiKey && data.folderId;
        }
        return true;
      },
      {
        message:
          'Для Яндекс провайдера необходимо указать оба поля: ключ и ID каталога',
      }
    );

  const parsed = providerSchema.safeParse({
    id,
    name,
    type,
    apiKey: apiKey || undefined,
    folderId: folderId || undefined,
  });

  if (!parsed.success) {
    return formError(parsed.error.issues);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const provider = await db.query.providers.findFirst({
    where: eq(providers.id, id),
  });
  if (!provider || provider.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  // Prepare update data
  const updateData: {
    name: string;
    type: 'yandex' | 'openai';
    apiKeyEnc?: string;
    folderIdEnc?: string;
  } = {
    name: parsed.data.name,
    type: parsed.data.type,
  };

  // Update API key and folder ID only if provided
  const aad = process.env.ENCRYPTION_KEY || '';
  if (apiKey) {
    updateData.apiKeyEnc = pack(encryptString(apiKey, aad));
  }

  if (folderId) {
    updateData.folderIdEnc = pack(encryptString(folderId, aad));
  }

  await db.update(providers).set(updateData).where(eq(providers.id, id));

  redirect('/providers');
};

export const deleteProvider = async (
  _: FormResult,
  formData: FormData
): Promise<FormResult> => {
  const id = (formData.get('id') as string) ?? '';

  if (!id) {
    return formError([
      {
        code: 'custom',
        message: 'ID провайдера не указан',
        path: ['id'],
      },
    ]);
  }

  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const provider = await db.query.providers.findFirst({
    where: eq(providers.id, id),
  });
  if (!provider || provider.userId !== (session.user.id as string)) {
    throw new Error('Forbidden');
  }

  // Check if provider is used by any organisation
  const organisationsUsingProvider = await db.query.organisations.findMany({
    where: eq(organisations.providerId, id),
  });

  if (organisationsUsingProvider.length > 0) {
    return formError([
      {
        code: 'custom',
        message:
          'Нельзя удалить провайдера, который используется в организациях',
        path: ['id'],
      },
    ]);
  }

  await db.delete(providers).where(eq(providers.id, id));

  redirect('/providers');
};
