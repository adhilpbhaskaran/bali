'use client';

import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

// Client-side only component wrapper to prevent hydration errors
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientOnly>{children}</ClientOnly>
    </SessionProvider>
  );
}
