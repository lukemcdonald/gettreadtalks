'use client';

import { Suspense } from 'react';

import { SheetRouter } from './sheet-router';

export function SheetManager() {
  return (
    <Suspense fallback={null}>
      <SheetRouter />
    </Suspense>
  );
}
