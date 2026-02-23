'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';

interface OptimisticRowProps {
  children: (callbacks: { onError: () => void; onMutate: () => void }) => ReactNode;
}

export function OptimisticRow({ children }: OptimisticRowProps) {
  const [removed, setRemoved] = useState(false);

  if (removed) {
    return null;
  }

  return children({
    onError: () => setRemoved(false),
    onMutate: () => setRemoved(true),
  });
}
