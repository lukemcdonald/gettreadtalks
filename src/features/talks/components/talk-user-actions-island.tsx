'use client';

import type { TalkUserActionsProps } from '@/features/talks/components/talk-user-actions';

import dynamic from 'next/dynamic';

const TalkUserActions = dynamic(
  () =>
    import('@/features/talks/components/talk-user-actions').then(
      (mod) => mod.TalkUserActions
    ),
  { ssr: false }
);

export function TalkUserActionsIsland(props: TalkUserActionsProps) {
  return <TalkUserActions {...props} />;
}
