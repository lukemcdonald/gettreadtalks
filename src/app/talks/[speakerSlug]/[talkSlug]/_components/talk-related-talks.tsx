import type { Speaker } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { loadRandomTalksBySpeaker } from '@/features/talks/queries/load-random-talks-by-speaker';
import { loadTalksByTopics } from '@/features/talks/queries/load-talks-by-topics';

import { SpeakerRelatedTalks } from './speaker-related-talks';
import { TopicRelatedTalks } from './topic-related-talks';

interface TalkRelatedTalksProps {
  excludeTalkId: TalkId;
  speaker: Speaker | null;
  topics: Topic[];
}

export async function TalkRelatedTalks({
  excludeTalkId,
  speaker,
  topics,
}: TalkRelatedTalksProps) {
  const speakerTalks = speaker
    ? await loadRandomTalksBySpeaker(speaker._id, excludeTalkId, 5)
    : [];
  const topicTalks = await loadTalksByTopics(
    topics.map((topic) => topic._id),
    [excludeTalkId, ...speakerTalks.map((talk) => talk._id)]
  );

  return (
    <>
      {speaker ? (
        <SpeakerRelatedTalks speaker={speaker} talks={speakerTalks} />
      ) : null}
      <TopicRelatedTalks talks={topicTalks} topics={topics} />
    </>
  );
}
