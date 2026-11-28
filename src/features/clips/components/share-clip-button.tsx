'use client';

import type { Clip } from '@/features/clips/types';

import { ShareButton } from '@/components/share-button';
import { track } from '@/services/analytics';

interface ShareClipButtonProps {
  clip: Pick<Clip, '_id' | 'slug' | 'title'>;
}

export function ShareClipButton({ clip }: ShareClipButtonProps) {
  return (
    <ShareButton
      onShare={(method) =>
        track('clip_shared', {
          clip_id: clip._id,
          clip_slug: clip.slug,
          method,
        })
      }
      title={clip.title}
    />
  );
}
