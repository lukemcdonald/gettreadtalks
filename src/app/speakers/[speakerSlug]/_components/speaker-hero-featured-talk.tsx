import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getVideoThumbnail } from '@/components/media-embed';
import { Card } from '@/components/ui';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroFeaturedTalkProps {
  speaker: Speaker;
  talk: Talk;
}

export function SpeakerHeroFeaturedTalk({ speaker, talk }: SpeakerHeroFeaturedTalkProps) {
  const talkUrl = getTalkUrl(speaker.slug, talk.slug);
  const thumbnail = getVideoThumbnail(talk.mediaUrl);

  return (
    <Card
      className="group overflow-clip shadow-2xl"
      render={
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href={talkUrl}
        />
      }
    >
      <div className="relative">
        {thumbnail ? (
          <div className="relative aspect-video">
            <Image
              alt={talk.title}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={thumbnail}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted" />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-opacity group-hover:opacity-90">
            <PlayIcon className="ml-0.5 size-5" fill="currentColor" />
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <h2>{talk.title}</h2>

        <span className="inline-flex shrink-0 items-center gap-1.5">
          View details <ArrowRightIcon className="size-3.5" />
        </span>
      </div>
    </Card>
  );
}
