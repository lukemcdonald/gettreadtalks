import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { AdminEditButton } from '@/components/admin-edit-button';
import { ArchiveBackLink } from '@/components/archive-back-link';
import { HeroTitle } from '@/components/hero';
import { Link } from '@/components/ui/link';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';
import { buildTalksPath } from '@/features/talks/utils';

interface TalkHeroDetailsProps {
  speaker: Pick<Speaker, 'firstName' | 'lastName' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'title'>;
}

export function TalkHeroDetails({ speaker, talk }: TalkHeroDetailsProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <div className="space-y-2 text-center">
      <div>
        <ArchiveBackLink href={buildTalksPath()} label="Talks" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <HeroTitle className="text-foreground min-w-0" size="sm">
            {talk.title}
          </HeroTitle>
          <AdminEditButton entity="talks" id={talk._id} />
        </div>
      </div>
      {speaker && (
        <p className="text-muted-foreground text-lg">
          by{' '}
          <Link className="hover:underline" href={buildSpeakerPath(speaker)}>
            {speakerName}
          </Link>
        </p>
      )}
    </div>
  );
}
