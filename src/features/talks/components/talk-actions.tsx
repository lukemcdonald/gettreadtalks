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
  const actionSpeaker = speaker
    ? { _id: speaker._id, slug: speaker.slug }
    : null;
  const actionTalk = { _id: talk._id, slug: talk.slug, title: talk.title };

  return (
    <div className="flex flex-wrap gap-2">
      <ShareTalkButton speaker={actionSpeaker} talk={actionTalk} />
      <FavoriteTalkButton speaker={actionSpeaker} talk={actionTalk} />
      <FinishTalkButton speaker={actionSpeaker} talk={actionTalk} />
      <FeatureTalkButton speaker={actionSpeaker} talk={actionTalk} />
    </div>
  );
}
