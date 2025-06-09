'use client';

import { useState, useEffect, ReactNode } from 'react';

interface StoreHydrationProps {
  children: ReactNode;
}

/**
 * StoreHydration component prevents hydration errors with Zustand in Next.js
 * by only rendering children after hydration is complete.
 * 
 * This helps avoid mismatches between server-rendered and client-rendered state
 * which is particularly important with React 19 and Next.js 15.
 */
export function StoreHydration({ children }: StoreHydrationProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait until after client-side hydration to show children
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? <>{children}</> : null;
}