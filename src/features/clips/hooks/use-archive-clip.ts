'use client';

import { archiveClipAction } from '@/features/clips/actions/archive-clip';

export function useArchiveClip() {
  return {
    archiveClip: archiveClipAction,
  };
}
