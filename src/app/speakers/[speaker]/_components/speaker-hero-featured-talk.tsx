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
    <div className="flex animate-fade-in-up flex-col [animation-delay:150ms]">
      {/* Video with dramatic drop shadow */}
      <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/50 transition-shadow duration-300 hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.7)]">
        <MediaEmbed mediaUrl={talk.mediaUrl} title={talk.title} />
      </div>

      {/* Title inline with "View details" link */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <h2 className="font-medium text-lg text-white">{talk.title}</h2>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 font-medium text-sm text-white/50 transition-colors hover:text-white"
          href={getTalkUrl(speaker.slug, talk.slug)}
        >
          View details <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
