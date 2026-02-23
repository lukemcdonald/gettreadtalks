import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Link } from '@/components/ui/link';
import { getSpeakerName } from '@/features/speakers/utils';

interface TalkHeroDetailsProps {
  speaker: Speaker | null;
  talk: Talk;
}

export function TalkHeroDetails({ speaker, talk }: TalkHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker ?? undefined);

  return (
    <div className="space-y-2 text-center">
      <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl lg:text-4xl">
        {talk.title}
      </h1>
      {speaker && (
        <p className="text-lg text-muted-foreground">
          by{' '}
          <Link className="hover:underline" href={`/speakers/${speaker.slug}`}>
            {speakerName}
          </Link>
        </p>
      )}
    </div>
  );
}
