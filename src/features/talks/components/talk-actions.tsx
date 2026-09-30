import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { ShareTalkButton } from '@/features/talks/components/share-talk-button';
import { FavoriteTalkButton } from '@/features/users/components/favorite-talk-button';
import { FinishTalkButton } from '@/features/users/components/finish-talk-button';

interface TalkActionsProps {
  speaker: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug' | 'title'>;
}

export function TalkActions({ speaker, talk }: TalkActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ShareTalkButton speaker={speaker} talk={talk} />
      <FavoriteTalkButton speaker={speaker} talk={talk} />
      <FinishTalkButton speaker={speaker} talk={talk} />
      <FeatureTalkButton speaker={speaker} talk={talk} />
    </div>
  );
}
