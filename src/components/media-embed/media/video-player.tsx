'use client';

import type { MediaTrackingContext } from '../types';

import { useRef } from 'react';

import { useMediaTracking } from './use-media-tracking';

interface VideoPlayerProps {
  src: string;
  trackingContext?: MediaTrackingContext;
}

export function VideoPlayer({ src, trackingContext }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { handleEnded, handlePause, handlePlay } = useMediaTracking({
    mediaRef: videoRef,
    mediaType: 'video',
    trackingContext,
  });

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
