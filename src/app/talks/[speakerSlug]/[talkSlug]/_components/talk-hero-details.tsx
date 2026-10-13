import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { AdminEditButton } from '@/components/admin-edit-button';
import { HeroTitle } from '@/components/hero';
import { Link } from '@/components/ui/link';
import { getSpeakerName } from '@/features/speakers/utils';

interface TalkHeroDetailsProps {
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'title'>;
}

export function TalkHeroDetails({ speaker, talk }: TalkHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="space-y-2 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <HeroTitle className="text-foreground min-w-0" size="sm">
          {talk.title}
        </HeroTitle>
        <AdminEditButton entity="talks" id={talk._id} />
      </div>
      {speaker && (
        <p className="text-muted-foreground text-lg">
          by{' '}
          <Link className="hover:underline" href={`/speakers/${speaker.slug}`}>
            {speakerName}
          </Link>
        </p>
      )}
    </div>
  );
}
