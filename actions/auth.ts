'use server';

import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn as signInAuth, signOut as signOutAuth } from '@/auth';

const SIGNIN_ERROR_URL = '/error';

export const signIn = async () => {
  try {
    await signInAuth('yandex');
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    // В NextAuth v5 signOut выполняет редирект сам. Возвращаем его и передаём цель.
    return signOutAuth({ redirectTo: '/auth' });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }
    throw error;
  }
};
