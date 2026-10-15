'use client';

import type { SpeakerUserActionsProps } from '@/features/users/components/speaker-user-actions';

import dynamic from 'next/dynamic';

const SpeakerUserActions = dynamic(
  () =>
    import('@/features/users/components/speaker-user-actions').then(
      (mod) => mod.SpeakerUserActions
    ),
  { ssr: false }
);

export function SpeakerUserActionsIsland(props: SpeakerUserActionsProps) {
  return <SpeakerUserActions {...props} />;
}
