import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

interface ClipSidebarProps {
  speaker: Speaker | null;
  talk: Talk | null;
}

export function ClipSidebar({ speaker, talk }: ClipSidebarProps) {
  return (
    <>
      {!!speaker && (
        <SidebarContent title="Speaker">
          <div className="space-y-2">
            <p className="font-semibold">{getSpeakerName(speaker)}</p>
            {!!speaker.role && <p className="text-muted-foreground text-sm">{speaker.role}</p>}
            {!!speaker.ministry && (
              <p className="text-muted-foreground text-sm">{speaker.ministry}</p>
            )}
            <Link
              className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
              href={`/speakers/${speaker.slug}`}
            >
              View all talks
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </SidebarContent>
      )}

      {!!talk && !!speaker && (
        <SidebarContent title="Related Talk">
          <div className="space-y-2">
            <p className="font-semibold">{talk.title}</p>
            {!!talk.description && (
              <p className="line-clamp-2 text-muted-foreground text-sm">{talk.description}</p>
            )}
            <Link
              className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
              href={getTalkUrl(speaker.slug, talk.slug)}
            >
              View talk
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </SidebarContent>
      )}
    </>
  );
}
