import type { Speaker } from '@/features/speakers/types';

import { SpeakerMinistryLink } from '@/app/speakers/[speaker]/_components/speaker-ministry-link';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';

interface SpeakerHeroDetailsProps {
  speaker: Speaker;
}

export function SpeakerHeroDetails({ speaker }: SpeakerHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-start md:gap-6 md:text-left">
      {/* Avatar sized to match role + title + ministry height (~96-110px) */}
      <SpeakerAvatar
        className="size-20 shadow-xl ring-2 ring-white/20 md:size-24"
        rounded="full"
        speaker={speaker}
      />

      <div className="flex-1 space-y-3">
        <div>
          {speaker.role && (
            <p className="mb-1 font-semibold text-primary text-xs uppercase tracking-widest">
              {speaker.role}
            </p>
          )}
          <h1 className="font-bold text-4xl text-white tracking-tight sm:text-5xl lg:text-6xl">
            {speakerName}
          </h1>
          <SpeakerMinistryLink
            className="mt-1.5 text-white/70"
            ministry={speaker.ministry}
            websiteUrl={speaker.websiteUrl}
          />
        </div>

        {speaker.description && (
          <p className="max-w-xl text-white/60 leading-relaxed">{speaker.description}</p>
        )}
      </div>
    </div>
  );
}
