'use client';

import { useState } from 'react';

interface UseOptimisticToggleOptions {
  data: boolean | undefined;
  onToggle: (next: boolean) => void;
}

export function useOptimisticToggle({ data, onToggle }: UseOptimisticToggleOptions) {
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  const isActive = optimisticState ?? data ?? false;
  const isLoading = optimisticState === null && data === undefined;

  const clearOptimistic = () => setOptimisticState(null);

  const toggle = () => {
    const next = !isActive;
    setOptimisticState(next);
    onToggle(next);
  };

  return { clearOptimistic, isActive, isLoading, toggle };
}
