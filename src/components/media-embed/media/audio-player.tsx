'use client';

import type { MediaTrackingContext } from '../types';

import { useRef } from 'react';

import { useAnalytics } from '@/lib/analytics';

interface AudioPlayerProps {
  trackingContext?: MediaTrackingContext;
  src: string;
}

export function AudioPlayer({ trackingContext, src }: AudioPlayerProps) {
  const { track } = useAnalytics();
  const hasPlayed = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = () => {
    if (!trackingContext || hasPlayed.current) return;
    hasPlayed.current = true;

    if (trackingContext.entityType === 'talk') {
      track('talk_played', {
        media_type: 'audio',
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
    if (!(trackingContext && audioRef.current)) return;
    const el = audioRef.current;
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
    if (!trackingContext) return;

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
    <div className="rounded-lg border bg-muted/50 p-4">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <audio
        className="w-full"
        controls
        onEnded={handleEnded}
        onPause={handlePause}
        onPlay={handlePlay}
        preload="metadata"
        ref={audioRef}
        src={src}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
