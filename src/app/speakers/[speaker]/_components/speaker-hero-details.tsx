import type { Speaker } from '@/features/speakers/types';

import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getSpeakerInitials, getSpeakerName } from '@/features/speakers/utils';

interface SpeakerHeroDetailsProps {
  speaker: Speaker;
}

export function SpeakerHeroDetails({ speaker }: SpeakerHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);
  const initials = getSpeakerInitials(speaker);

  return (
    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-6 md:text-left">
      <div className="relative shrink-0">
        {speaker.imageUrl ? (
          <div className="relative size-24 overflow-hidden rounded-full shadow-xl ring-4 ring-white/20 md:size-28">
            <Image
              alt={speakerName}
              className="object-cover"
              fill
              priority
              sizes="112px"
              src={speaker.imageUrl}
            />
          </div>
        ) : (
          <div className="flex size-24 items-center justify-center rounded-full bg-white/10 font-bold text-2xl text-white/70 md:size-28">
            {initials}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div>
          {speaker.role && (
            <p className="mb-1 font-semibold text-primary text-xs uppercase tracking-widest">
              {speaker.role}
            </p>
          )}
          <h1 className="font-bold text-3xl text-white tracking-tight sm:text-4xl">
            {speakerName}
          </h1>
          {speaker.ministry && <p className="mt-1 text-white/70">{speaker.ministry}</p>}
        </div>

        {speaker.description && (
          <p className="max-w-xl text-sm text-white/60">{speaker.description}</p>
        )}

        {speaker.websiteUrl && (
          <Link
            className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
            href={speaker.websiteUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Website
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
