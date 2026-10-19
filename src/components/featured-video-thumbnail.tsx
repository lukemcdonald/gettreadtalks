'use client';

import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { captureMessage } from '@/services/errors';

interface FeaturedVideoThumbnailProps {
  href: string;
  sizes: string;
  thumbnail: string | null;
  title: string;
}

export function FeaturedVideoThumbnail({
  href,
  sizes,
  thumbnail,
  title,
}: FeaturedVideoThumbnailProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = thumbnail && !thumbnailFailed;

  function handleThumbnailError() {
    setThumbnailFailed(true);
    captureMessage('Media thumbnail failed to load', {
      context: { href, thumbnail, title },
      fingerprint: ['media', thumbnail ?? 'unknown'],
      level: 'warning',
      tags: { feature: 'media' },
    });
  }

  if (!showThumbnail) {
    return <div className="bg-muted size-full" />;
  }

  return (
    <>
      <Image
        alt={title}
        className="object-cover"
        fill
        onError={handleThumbnailError}
        sizes={sizes}
        src={thumbnail}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-primary text-primary-foreground flex h-12 w-16 items-center justify-center rounded-2xl shadow-lg transition-opacity group-hover:opacity-90">
          <PlayIcon className="ml-0.5 size-5" fill="currentColor" />
        </span>
      </div>
    </>
  );
}
