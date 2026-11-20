'use client';

import { archiveTalkAction } from '@/features/talks/actions/archive-talk';

export function useArchiveTalk() {
  return {
    archiveTalk: archiveTalkAction,
  };
}
