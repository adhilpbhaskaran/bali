'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { StoreHydration } from '@/lib/store/hydration';

export default function AdminDashboardProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <StoreHydration>{children}</StoreHydration>
    </SessionProvider>
  );
}