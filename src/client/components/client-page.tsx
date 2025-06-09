'use client';

import React, { useEffect, useState } from 'react';

export default function ClientPageRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return null;
}