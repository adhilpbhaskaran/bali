import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

// This is a simple example of how you might set up NextAuth
// In a real application, you would validate credentials against your database
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // In a real application, you would validate the credentials against your database
        // This is just a simple example for demonstration purposes
        if (credentials?.email === 'admin@balimalayali.com' && credentials?.password === 'admin123') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@balimalayali.com',
            role: 'admin'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin-dashboard/login',
    error: '/admin-dashboard/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development-only',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
