import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

// Type extensions
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Get credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@balimalayali.com';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        const userEmail = process.env.USER_EMAIL || 'user@example.com';
        const userPasswordHash = process.env.USER_PASSWORD_HASH;
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // Import bcrypt for password verification
        const bcrypt = require('bcryptjs');
        
        try {
          // Check admin credentials
          if (credentials.email === adminEmail && adminPasswordHash) {
            const isValidAdmin = await bcrypt.compare(credentials.password, adminPasswordHash);
            if (isValidAdmin) {
              return {
                id: '1',
                name: 'Admin',
                email: adminEmail,
                role: 'admin'
              };
            }
          }
          
          // Check user credentials
          if (credentials.email === userEmail && userPasswordHash) {
            const isValidUser = await bcrypt.compare(credentials.password, userPasswordHash);
            if (isValidUser) {
              return {
                id: '2',
                name: 'User',
                email: userEmail,
                role: 'user'
              };
            }
          }
          
          // Development fallback (only in development mode)
          if (process.env.NODE_ENV === 'development' && 
              credentials.email === adminEmail && 
              adminPasswordHash && await bcrypt.compare(credentials.password, adminPasswordHash)) {
            return {
              id: '1',
              name: 'Admin (Dev)',
              email: adminEmail,
              role: 'admin'
            };
          }
        } catch (error) {
          console.error('Authentication error:', error);
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
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXTAUTH_SECRET environment variable is required in production');
    }
    return 'development-only-secret-change-in-production';
  })(),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };