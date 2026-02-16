'use client';

import type { MediaTrackingContext } from '../types';

import { useRef } from 'react';

import { useAnalytics } from '@/lib/analytics';

interface VideoPlayerProps {
  src: string;
  trackingContext?: MediaTrackingContext;
}

export function VideoPlayer({ src, trackingContext }: VideoPlayerProps) {
  const { track } = useAnalytics();
  const hasPlayed = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!trackingContext || hasPlayed.current) {
      return;
    }
    hasPlayed.current = true;

    if (trackingContext.entityType === 'talk') {
      track('talk_played', {
        media_type: 'video',
        speaker_slug: trackingContext.speakerSlug ?? '',
        talk_id: trackingContext.entityId,
      });
    } else {
      track('clip_played', {
        clip_id: trackingContext.entityId,
        clip_slug: trackingContext.entitySlug,
      });
    }
  };

  const handlePause = () => {
    if (!(trackingContext && videoRef.current)) {
      return;
    }
    const el = videoRef.current;
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
  };

  const handleEnded = () => {
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
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <video
        className="h-full w-full"
        controls
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
        preload="metadata"
        ref={videoRef}
        src={src}
      >
        Your browser does not support the video element.
      </video>
    </div>
  );
}
