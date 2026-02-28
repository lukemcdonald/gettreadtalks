import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { HeroTitle } from '@/components/hero-title';
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
      <HeroTitle className="text-foreground" size="sm">
        {talk.title}
      </HeroTitle>
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
