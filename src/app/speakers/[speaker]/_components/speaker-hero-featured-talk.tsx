import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { MediaEmbed } from '@/components/media-embed';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({ speaker, talk }: SpeakerHeroFeaturedTalkProps) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        <MediaEmbed mediaUrl={talk.mediaUrl} title={talk.title} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <h2 className="font-medium text-muted-foreground text-sm">{talk.title}</h2>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
          href={getTalkUrl(speaker.slug, talk.slug)}
        >
          View details <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
