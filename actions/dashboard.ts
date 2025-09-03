'use server';

import { auth } from '@/auth';

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
}
