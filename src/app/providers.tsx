'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { StoreHydration } from '@/lib/store/hydration';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StoreHydration>{children}</StoreHydration>
    </ThemeProvider>
  );
}
