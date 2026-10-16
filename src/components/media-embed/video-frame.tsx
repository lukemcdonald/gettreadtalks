import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui';
import { cn } from '@/utils';

interface VideoFrameProps {
  children: ReactNode;
  className?: string;
}

export function VideoFrame({ children, className }: VideoFrameProps) {
  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl',
        className
      )}
    >
      {children}
    </div>
  );
}

export function VideoFrameSkeleton({ className }: { className?: string }) {
  return (
    <VideoFrame className={className}>
      <Skeleton className="size-full rounded-none" />
    </VideoFrame>
  );
}
