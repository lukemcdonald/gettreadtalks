import type { ComponentProps, ReactNode } from 'react';

import { Card, CardDescription } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { cn } from '@/utils';

import { MediaCardTitle } from './media-card-title';

type MediaCardProps = {
  ariaLabel?: string;
  'data-testid'?: string;
  href: string;
  media?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
} & ComponentProps<typeof Card>;

export function MediaCard({
  ariaLabel,
  className,
  'data-testid': testId,
  href,
  media,
  subtitle,
  title,
  ...delegated
}: MediaCardProps) {
  return (
    <Card
      className={cn(
        'group card-interactive relative flex-row items-center gap-3.5 border-0 p-4 [contain-intrinsic-size:auto_80px] [content-visibility:auto]',
        className
      )}
      {...delegated}
    >
      {media}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <MediaCardTitle>
          <FauxLink aria-label={ariaLabel} data-testid={testId} href={href}>
            {title}
          </FauxLink>
        </MediaCardTitle>
        {!!subtitle && (
          <CardDescription className="min-w-0 text-pretty">
            {subtitle}
          </CardDescription>
        )}
      </div>
    </Card>
  );
}
