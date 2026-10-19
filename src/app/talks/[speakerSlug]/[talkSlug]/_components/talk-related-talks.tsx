import type { Speaker } from '@/features/speakers/types';
import type { Talk, TalkId, TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { buildSpeakerUrl, getSpeakerName } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';
import { loadRandomTalksBySpeaker } from '@/features/talks/queries/load-random-talks-by-speaker';
import { loadTalksByTopics } from '@/features/talks/queries/load-talks-by-topics';
import { buildTopicUrl } from '@/features/topics/utils';

interface TalkRelatedTalksProps {
  excludeTalkId: TalkId;
  speaker: Speaker | null;
  topics: Topic[];
}

function SpeakerRelatedTalks({
  speaker,
  talks,
}: {
  speaker: Speaker;
  talks: Talk[];
}) {
  if (talks.length === 0) {
    return null;
  }

  return (
    <FeaturedGrid
      columns={{ default: 1 }}
      description={`Enjoy more talks by ${getSpeakerName(speaker)}.`}
      quickLinks={[
        {
          href: buildSpeakerUrl(speaker.slug),
          label: 'View all talks',
        },
      ]}
      sticky
      title="More Talks"
    >
      {talks.map((talk) => (
        <TalkCard key={talk._id} speaker={speaker} talk={talk} />
      ))}
    </FeaturedGrid>
  );
}

function getRelatedTopicSection(topic?: Topic) {
  if (!topic) {
    return {
      description: 'Enjoy more talks on related topics.',
      title: 'Related Talks',
    };
  }

  return {
    description: `Enjoy more talks on ${topic.title}.`,
    quickLinks: [
      {
        href: buildTopicUrl(topic.slug),
        label: 'View topic',
      },
    ],
    title: `More on ${topic.title}`,
  };
}

function TopicRelatedTalks({
  talks,
  topics,
}: {
  talks: TalkWithSpeaker[];
  topics: Topic[];
}) {
  if (talks.length === 0) {
    return null;
  }

  const section = getRelatedTopicSection(
    topics.length === 1 ? topics[0] : undefined
  );

  return (
    <FeaturedGrid
      columns={{ default: 1 }}
      description={section.description}
      quickLinks={section.quickLinks}
      sticky
      title={section.title}
    >
      {talks.map((talk) => (
        <TalkCard key={talk._id} speaker={talk.speaker} talk={talk} />
      ))}
    </FeaturedGrid>
  );
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
