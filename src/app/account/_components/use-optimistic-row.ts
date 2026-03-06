'use client';

import { useState } from 'react';

export function useOptimisticRow() {
  const [removed, setRemoved] = useState(false);

  return {
    onError: () => setRemoved(false),
    onMutate: () => setRemoved(true),
    removed,
  };
}
