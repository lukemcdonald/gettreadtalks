'use client';

import type { ReactNode } from 'react';

import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { VideoFrame, VideoFrameSkeleton } from '@/components/media-embed';
import { Skeleton } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { captureMessage } from '@/services/errors';
import { cn } from '@/utils';

interface FeaturedVideoCardProps {
  actionLabel?: string;
  href: string;
  sizes?: string;
  subtitle?: ReactNode;
  thumbnail: string | null;
  title: string;
}

const shellClassName =
  'bg-muted/72 flex flex-col overflow-hidden rounded-2xl shadow-2xl';

function CaptionCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card relative z-10 -mt-3 rounded-t-xl rounded-b-2xl border-t p-4 shadow-xs/5">
      {children}
    </div>
  );
}

function Caption({
  actionLabel,
  subtitle,
  title,
}: {
  actionLabel: string;
  subtitle?: ReactNode;
  title: string;
}) {
  return (
    <CaptionCard>
      <div className="flex items-start justify-between gap-4 text-sm">
        <div className="min-w-0">
          <h2 className="text-foreground font-medium text-pretty">{title}</h2>
          {!!subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          {actionLabel} <ArrowRightIcon className="size-3.5" />
        </span>
      </div>
    </CaptionCard>
  );
}

export function FeaturedVideoCard({
  actionLabel = 'View details',
  href,
  sizes = '(max-width: 1024px) 100vw, 50vw',
  subtitle,
  thumbnail,
  title,
}: FeaturedVideoCardProps) {
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
      className={cn(
        'group text-muted-foreground hover:text-foreground transition-colors',
        shellClassName
      )}
      href={href}
    >
      <VideoFrame className="rounded-none shadow-none">
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

      <Caption actionLabel={actionLabel} subtitle={subtitle} title={title} />
    </Link>
  );
}

export function FeaturedVideoCardSkeleton() {
  return (
    <div className={shellClassName}>
      <VideoFrameSkeleton className="rounded-none shadow-none" />
      <CaptionCard>
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>
      </CaptionCard>
    </div>
  );
}
