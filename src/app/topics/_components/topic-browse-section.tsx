import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ChevronRightIcon } from 'lucide-react';

import { GridList } from '@/components/grid-list';
import { SectionHeading } from '@/components/section-heading';
import { Link } from '@/components/ui/link';
import { TalkCard } from '@/features/talks/components/talk-card';
import { buildTopicPath } from '@/features/topics/utils';
import { pluralize } from '@/utils';

interface TopicBrowseSectionProps {
  talkCount: number;
  talks: TalkWithSpeaker[];
  topic: Pick<Topic, 'slug' | 'title'>;
}

export function TopicBrowseSection({
  talkCount,
  talks,
  topic,
}: TopicBrowseSectionProps) {
  const hasMoreTalks = talkCount > talks.length;
  const countLabel = `${talkCount} ${pluralize(talkCount, 'talk', 'talks')}`;

  return (
    <section id={`topic-${topic.slug}`}>
      <SectionHeading
        className="mb-6"
        heading={
          <Link
            className="hover:underline"
            data-testid="topic-link"
            href={buildTopicPath(topic)}
          >
            {topic.title}
          </Link>
        }
        meta={
          hasMoreTalks ? (
            <Link
              className="hover:text-foreground inline-flex items-center gap-1"
              href={buildTopicPath(topic)}
            >
              {countLabel}
              <ChevronRightIcon className="size-3.5" />
            </Link>
          ) : (
            countLabel
          )
        }
      />

      {talks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No talks yet</p>
      ) : (
        <GridList columns={{ default: 1, md: 2 }}>
          {talks.map((talk) => (
            <TalkCard
              headingLevel={3}
              key={talk._id}
              speaker={talk.speaker}
              talk={talk}
            />
          ))}
        </GridList>
      )}
    </section>
  );
}
