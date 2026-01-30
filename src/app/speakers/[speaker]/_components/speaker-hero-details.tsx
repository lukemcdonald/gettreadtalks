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
    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left">
      <SpeakerAvatar
        className="size-24 animate-fade-in-up shadow-xl ring-2 ring-white/20 md:size-28"
        rounded="full"
        speaker={speaker}
      />

      <div className="flex-1 space-y-4">
        <div className="animate-fade-in-up [animation-delay:100ms]">
          {speaker.role && (
            <p className="mb-2 font-semibold text-white/40 text-xs uppercase tracking-widest">
              {speaker.role}
            </p>
          )}
          <h1 className="font-bold text-4xl text-white tracking-tight sm:text-5xl lg:text-6xl">
            {speakerName}
          </h1>
          <SpeakerMinistryLink
            className="mt-2 text-white/60"
            ministry={speaker.ministry}
            websiteUrl={speaker.websiteUrl}
          />
        </div>

        {speaker.description && (
          <p className="max-w-lg animate-fade-in-up text-base text-white/50 leading-relaxed [animation-delay:200ms]">
            {speaker.description}
          </p>
        )}
      </div>
    </div>
  );
}
