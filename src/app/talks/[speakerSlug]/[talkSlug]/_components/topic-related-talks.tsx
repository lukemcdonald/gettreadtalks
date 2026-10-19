import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { FeaturedGrid } from '@/components/featured-grid';
import { TalkCard } from '@/features/talks/components/talk-card';
import { buildTopicPath } from '@/features/topics/utils';

interface TopicRelatedTalksProps {
  talks: TalkWithSpeaker[];
  topics: Topic[];
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
        href: buildTopicPath(topic),
        label: 'View topic',
      },
    ],
    title: `More on ${topic.title}`,
  };
}

export function TopicRelatedTalks({ talks, topics }: TopicRelatedTalksProps) {
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
