import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      tutorStatus?: string | null;
      studyYear?: number | null;
      fullName: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    tutorStatus?: string | null;
    studyYear?: number | null;
    fullName: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    tutorStatus?: string | null;
    studyYear?: number | null;
    fullName: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const isEmail = String(credentials.identifier).includes('@');
        
        const user = await prisma.user.findFirst({
          where: isEmail
            ? { email: String(credentials.identifier) }
            : { phone: String(credentials.identifier) }
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email first');
        }

        if (!user.isActive) {
          throw new Error('Your account is deactivated');
        }

        return {
          id: user.id,
          role: user.role,
          tutorStatus: user.tutorStatus,
          studyYear: user.studyYear,
          fullName: user.fullName,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tutorStatus = user.tutorStatus;
        token.studyYear = user.studyYear;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tutorStatus = token.tutorStatus;
        session.user.studyYear = token.studyYear;
        session.user.fullName = token.fullName;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});
