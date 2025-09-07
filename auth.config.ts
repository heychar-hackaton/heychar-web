import type { JWT } from '@auth/core/jwt';
import type { NextAuthConfig } from 'next-auth';

const DAYS = 30;

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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith('/auth');
      const isOnApply = nextUrl.pathname.startsWith('/apply');
      const isOnCancel = nextUrl.pathname.startsWith('/cancel');

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
    session(props) {
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
