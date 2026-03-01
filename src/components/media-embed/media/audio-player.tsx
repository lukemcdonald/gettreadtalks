'use client';

import type { MediaTrackingContext } from '../types';

import { useRef } from 'react';

import { cn } from '@/utils';
import { useMediaTracking } from './use-media-tracking';

interface AudioPlayerProps {
  className?: string;
  src: string;
  trackingContext?: MediaTrackingContext;
}

export function AudioPlayer({ className, src, trackingContext }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { handleEnded, handlePause, handlePlay } = useMediaTracking({
    mediaRef: audioRef,
    mediaType: 'audio',
    trackingContext,
  });

  return (
    <>
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <audio
        className={cn('scheme-dark w-full', className)}
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
    </>
  );
}
