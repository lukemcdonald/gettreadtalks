import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { MediaEmbed } from '@/components/media-embed';
import { Card } from '@/components/ui';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({ speaker, talk }: SpeakerHeroFeaturedTalkProps) {
  return (
    <Card className="overflow-clip shadow-2xl">
      <MediaEmbed mediaUrl={talk.mediaUrl} title={talk.title} />

      <Link
        className="flex items-center justify-between gap-4 px-4 py-3 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href={getTalkUrl(speaker.slug, talk.slug)}
      >
        <h2>{talk.title}</h2>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          View details <ArrowRightIcon className="size-3.5" />
        </span>
      </Link>
    </Card>
  );
}
