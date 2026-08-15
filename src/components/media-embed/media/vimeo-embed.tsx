'use client';

import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface VimeoEmbedProps {
  id: string;
  title: string;
}

export function VimeoEmbed({ id, title }: VimeoEmbedProps) {
  const [isActivated, setIsActivated] = useState(false);
  const thumbnailUrl = `https://vumbnail.com/${id}.jpg`;

  if (isActivated) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {/* oxlint-disable react/iframe-missing-sandbox -- Vimeo player needs scripts and same-origin together */}
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          sandbox="allow-popups allow-same-origin allow-scripts"
          src={`https://player.vimeo.com/video/${id}?autoplay=1`}
          title={title}
        />
        {/* oxlint-enable react/iframe-missing-sandbox */}
      </div>
    );
  }

  return (
    <button
      aria-label={`Play ${title}`}
      className="group bg-muted relative block aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
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

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-primary/90 group-hover:bg-primary flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
          <PlayIcon className="fill-primary-foreground text-primary-foreground h-8 w-8" />
        </div>
      </div>
    </button>
  );
}
