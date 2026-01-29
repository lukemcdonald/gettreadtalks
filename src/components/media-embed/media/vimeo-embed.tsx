'use client';

import { useState } from 'react';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';

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

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/90 transition-colors group-hover:bg-primary">
          <PlayIcon className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
        </div>
      </div>
    </button>
  );
}
