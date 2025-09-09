import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  console.log('session', session);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = {
    userId: session.user.id,
    email: session.user.email,
    type: 'api_access',
    iat: Math.floor(Date.now() / 1000),
  };

  const apiKey = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET || '32bytes'));

  return NextResponse.json({ apiKey });
}
