'use client';

import type { MediaTrackingContext } from '../types';
import type { RefObject } from 'react';

import { useRef } from 'react';

import { track } from '@/lib/analytics';

interface UseMediaTrackingOptions {
  mediaRef: RefObject<HTMLAudioElement | HTMLVideoElement | null>;
  mediaType: 'audio' | 'video';
  trackingContext?: MediaTrackingContext;
}

function playbackProgress(media: HTMLMediaElement) {
  const finite = [media.currentTime, media.duration].every(Number.isFinite);
  if (media.ended || media.duration <= 0 || !finite) {
    return null;
  }
  return Math.min(
    100,
    Math.max(0, Math.round((media.currentTime / media.duration) * 100))
  );
}

function talkPlaybackProps(
  context: Extract<MediaTrackingContext, { entityType: 'talk' }>
) {
  return {
    ...(context.speakerId ? { speaker_id: context.speakerId } : {}),
    ...(context.speakerSlug ? { speaker_slug: context.speakerSlug } : {}),
    talk_id: context.entityId,
    talk_slug: context.entitySlug,
    talk_title: context.entityTitle,
  };
}

export function useMediaTracking({
  mediaRef,
  mediaType,
  trackingContext,
}: UseMediaTrackingOptions) {
  const hasPlayed = useRef(false);

  function handlePlay() {
    if (!trackingContext || hasPlayed.current) {
      return;
    }
    hasPlayed.current = true;

    if (trackingContext.entityType === 'talk') {
      track('talk_played', {
        media_type: mediaType,
        ...talkPlaybackProps(trackingContext),
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

    const progress_pct = playbackProgress(mediaRef.current);
    if (progress_pct === null) {
      return;
    }

    if (trackingContext.entityType === 'talk') {
      track('talk_paused', {
        progress_pct,
        ...talkPlaybackProps(trackingContext),
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
        ...talkPlaybackProps(trackingContext),
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
