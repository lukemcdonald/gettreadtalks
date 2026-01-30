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
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-white/50 text-xs uppercase tracking-widest">
          Featured Talk
        </span>
        <Link
          className="inline-flex items-center gap-1.5 font-medium text-white/60 text-xs transition-colors hover:text-white"
          href={getTalkUrl(speaker.slug, talk.slug)}
        >
          View Details <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
      {/* Video with dramatic drop shadow for depth */}
      <div className="overflow-hidden rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        <MediaEmbed mediaUrl={talk.mediaUrl} title={talk.title} />
      </div>
      <div className="mt-2.5 space-y-0.5">
        <h2 className="font-semibold text-sm text-white">{talk.title}</h2>
        {talk.scripture && <p className="text-primary text-xs">{talk.scripture}</p>}
      </div>
    </div>
  );
}
