'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui';
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
      level: 'warning',
      tags: { feature: 'media' },
      context: { href, thumbnail, title },
      fingerprint: ['media', thumbnail ?? 'unknown'],
    });
  }

  return (
    <Card
      className="group overflow-clip shadow-2xl"
      render={
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href={href}
        />
      }
    >
      <div className="relative">
        {showThumbnail ? (
          <div className="relative aspect-video">
            <Image
              alt={title}
              className="object-cover"
              fill
              onError={handleThumbnailError}
              sizes={sizes}
              src={thumbnail}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted" />
        )}

        {!!showThumbnail && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-opacity group-hover:opacity-90">
              <PlayIcon className="ml-0.5 size-5" fill="currentColor" />
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
        <div>
          <h2 className="font-medium text-foreground">{title}</h2>
          {!!subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          {actionLabel} <ArrowRightIcon className="size-3.5" />
        </span>
      </div>
    </Card>
  );
}
