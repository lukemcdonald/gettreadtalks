import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ShareTalkButton } from '@/features/talks/components/share-talk-button';
import { TalkUserActionsIsland } from '@/features/talks/components/talk-user-actions-island';

interface TalkActionsProps {
  speaker: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug' | 'title'>;
}

export function TalkActions({ speaker, talk }: TalkActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ShareTalkButton speaker={speaker} talk={talk} />
      <TalkUserActionsIsland speaker={speaker} talk={talk} />
    </div>
  );
}
