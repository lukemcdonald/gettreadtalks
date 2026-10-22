import type { ReactNode } from 'react';

import { ArrowRightIcon } from 'lucide-react';

import { FeaturedVideoThumbnail } from '@/components/featured-video-thumbnail';
import { VideoFrame, VideoFrameSkeleton } from '@/components/media-embed';
import { Skeleton } from '@/components/ui';
import { IntentLink } from '@/components/ui/link';
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
          {!!subtitle && (
            <p className="text-muted-foreground min-w-0">{subtitle}</p>
          )}
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
  return (
    <IntentLink
      className={cn(
        'group text-muted-foreground hover:text-foreground transition-colors',
        shellClassName
      )}
      href={href}
    >
      <VideoFrame className="rounded-none shadow-none">
        <FeaturedVideoThumbnail
          href={href}
          sizes={sizes}
          thumbnail={thumbnail}
          title={title}
        />
      </VideoFrame>

      <Caption actionLabel={actionLabel} subtitle={subtitle} title={title} />
    </IntentLink>
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
