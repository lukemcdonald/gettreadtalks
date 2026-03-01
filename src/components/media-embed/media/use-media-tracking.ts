'use client';

import type { RefObject } from 'react';
import type { MediaTrackingContext } from '../types';

import { useRef } from 'react';

import { useAnalytics } from '@/lib/analytics';

interface UseMediaTrackingOptions {
  mediaRef: RefObject<HTMLAudioElement | HTMLVideoElement | null>;
  mediaType: 'audio' | 'video';
  trackingContext?: MediaTrackingContext;
}

export function useMediaTracking({
  mediaRef,
  mediaType,
  trackingContext,
}: UseMediaTrackingOptions) {
  const { track } = useAnalytics();
  const hasPlayed = useRef(false);

  function handlePlay() {
    if (!trackingContext || hasPlayed.current) {
      return;
    }
    hasPlayed.current = true;

    if (trackingContext.entityType === 'talk') {
      track('talk_played', {
        media_type: mediaType,
        speaker_slug: trackingContext.speakerSlug ?? '',
        talk_id: trackingContext.entityId,
      });
    } else {
      track('clip_played', {
        clip_id: trackingContext.entityId,
        clip_slug: trackingContext.entitySlug,
      });
    }
  }

  function handlePause() {
    if (!(trackingContext && mediaRef.current)) {
      return;
    }

    const el = mediaRef.current;
    const progress_pct = Math.round((el.currentTime / el.duration) * 100);

    if (trackingContext.entityType === 'talk') {
      track('talk_paused', {
        progress_pct,
        speaker_slug: trackingContext.speakerSlug ?? '',
        talk_id: trackingContext.entityId,
      });
    } else {
      track('clip_paused', {
        clip_id: trackingContext.entityId,
        clip_slug: trackingContext.entitySlug,
        progress_pct,
      });
    }
  }

  function handleEnded() {
    if (!trackingContext) {
      return;
    }

    if (trackingContext.entityType === 'talk') {
      track('talk_completed', {
        speaker_slug: trackingContext.speakerSlug ?? '',
        talk_id: trackingContext.entityId,
      });
    } else {
      track('clip_completed', {
        clip_id: trackingContext.entityId,
        clip_slug: trackingContext.entitySlug,
      });
    }
  }

  return { handleEnded, handlePause, handlePlay };
}
