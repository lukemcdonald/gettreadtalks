'use client';

import Image from 'next/image';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { useState } from 'react';
import { ExternalLinkIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/utils';

interface MediaEmbedProps {
  className?: string;
  mediaUrl: string;
  title?: string;
}

type MediaType =
  | { type: 'youtube'; id: string }
  | { type: 'vimeo'; id: string }
  | { type: 'audio'; src: string }
  | { type: 'video'; src: string }
  | { type: 'unknown'; href: string };

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
];

const VIMEO_PATTERNS = [/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/];
const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?|$)/i;
const AUDIO_EXTENSION_PATTERN = /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i;

function parseYouTubeUrl(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function parseVimeoUrl(url: string): string | null {
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function detectMediaType(url: string): MediaType {
  const youtubeId = parseYouTubeUrl(url);
  if (youtubeId) {
    return { type: 'youtube', id: youtubeId };
  }

  const vimeoId = parseVimeoUrl(url);
  if (vimeoId) {
    return { type: 'vimeo', id: vimeoId };
  }

  if (VIDEO_EXTENSION_PATTERN.test(url)) {
    return { type: 'video', src: url };
  }
  if (AUDIO_EXTENSION_PATTERN.test(url)) {
    return { type: 'audio', src: url };
  }

  return { type: 'unknown', href: url };
}

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="[&_.lty-playbtn]:rounded-xl [&_.lty-playbtn]:bg-primary/90 [&_.lty-playbtn]:transition-colors hover:[&_.lty-playbtn]:bg-primary">
      <LiteYouTubeEmbed
        id={id}
        poster="hqdefault"
        title={title}
        wrapperClass="yt-lite rounded-lg overflow-hidden"
      />
    </div>
  );
}

function VimeoEmbed({ id, title }: { id: string; title: string }) {
  const [isActivated, setIsActivated] = useState(false);
  const thumbnailUrl = `https://vumbnail.com/${id}.jpg`;

  if (isActivated) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={`https://player.vimeo.com/video/${id}?autoplay=1`}
          title={title}
        />
      </div>
    );
  }

  return (
    <button
      aria-label={`Play ${title}`}
      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
      onClick={() => setIsActivated(true)}
      type="button"
    >
      <Image
        alt=""
        className="object-cover transition-transform group-hover:scale-105"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={thumbnailUrl}
        unoptimized
      />

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/90 transition-colors group-hover:bg-primary">
          <PlayIcon className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
        </div>
      </div>
    </button>
  );
}

function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <audio className="w-full" controls preload="metadata" src={src}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <video className="h-full w-full" controls preload="metadata" src={src}>
        Your browser does not support the video element.
      </video>
    </div>
  );
}

function ExternalLinkButton({ href }: { href: string }) {
  return (
    <div className="rounded-lg border bg-muted/50 p-6 text-center">
      <a
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLinkIcon className="h-4 w-4" />
        Open Media
      </a>
    </div>
  );
}

export function MediaEmbed({ className, mediaUrl, title = 'Media player' }: MediaEmbedProps) {
  const media = detectMediaType(mediaUrl);

  return (
    <div className={cn(className)}>
      {media.type === 'youtube' && <YouTubeEmbed id={media.id} title={title} />}
      {media.type === 'vimeo' && <VimeoEmbed id={media.id} title={title} />}
      {media.type === 'audio' && <AudioPlayer src={media.src} />}
      {media.type === 'video' && <VideoPlayer src={media.src} />}
      {media.type === 'unknown' && <ExternalLinkButton href={media.href} />}
    </div>
  );
}
