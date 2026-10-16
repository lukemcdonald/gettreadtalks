'use client';

import type { ReactNode } from 'react';

import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { VideoFrame } from '@/components/media-embed';
import { Link } from '@/components/ui/link';
import { captureMessage } from '@/services/errors';

interface MediaThumbnailCardProps {
  actionLabel?: string;
  href: string;
  sizes?: string;
  subtitle?: ReactNode;
  thumbnail: string | null;
  title: string;
}

export function MediaThumbnailCard({
  actionLabel = 'View details',
  href,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  subtitle,
  thumbnail,
  title,
}: MediaThumbnailCardProps) {
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

  return (
    <Link
      className="group text-muted-foreground hover:text-foreground flex flex-col gap-3 transition-colors"
      href={href}
    >
      <VideoFrame>
        {showThumbnail ? (
          <Image
            alt={title}
            className="object-cover"
            fill
            onError={handleThumbnailError}
            sizes={sizes}
            src={thumbnail}
          />
        ) : (
          <div className="bg-muted size-full" />
        )}

        {!!showThumbnail && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-primary text-primary-foreground flex h-12 w-16 items-center justify-center rounded-2xl shadow-lg transition-opacity group-hover:opacity-90">
              <PlayIcon className="ml-0.5 size-5" fill="currentColor" />
            </span>
          </div>
        )}
      </VideoFrame>

      <div className="flex items-start justify-between gap-4 text-sm">
        <div>
          <h2 className="text-foreground font-medium text-pretty">{title}</h2>
          {!!subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          {actionLabel} <ArrowRightIcon className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
