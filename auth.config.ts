import type { JWT } from '@auth/core/jwt';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import type { NextAuthConfig } from 'next-auth';

const DAYS = 30;

async function verifyApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET || '32bytes')
    );

    if (decoded.payload.type === 'api_access') {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production',
  session: {
    strategy: 'jwt',
    maxAge: DAYS * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth',
    //verifyRequest: "/auth/verify",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    async authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      const isOnApply = nextUrl.pathname.startsWith('/apply');
      const isOnCancel = nextUrl.pathname.startsWith('/cancel');
      const isOnApi =
        nextUrl.pathname.startsWith('/api') &&
        !nextUrl.pathname.startsWith('/api/auth');

      if (isOnApi) {
        if (await verifyApiKey(request)) {
          return true;
        }
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (isOnApply || isOnCancel) {
        return true;
      }

      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/', nextUrl));
      }

      if (!(isLoggedIn || isOnAuth)) {
        return Response.redirect(new URL('/auth', nextUrl));
      }

      return true;
    },
    jwt(props) {
      if (props.trigger === 'update') {
        props.token = { ...props.token, ...props.session };
      }

      return props.token;
    },
    async session(props) {
      const { token } = props as { token: JWT };

      if (props.session.user && token.sub) {
        props.session.user.id = token.sub;
        if (token.image) {
          props.session.user.image = token.image as string;
        } else {
          props.session.user.image = token.picture;
        }
      }
      return props.session;
    },
  },
};
