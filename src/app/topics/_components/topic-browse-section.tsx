import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { GridList } from '@/components/grid-list';
import { SectionHeading } from '@/components/section-heading';
import { TalkCard } from '@/features/talks/components/talk-card';

interface TopicBrowseSectionProps {
  talkCount: number;
  talks: TalkWithSpeaker[];
  topic: Pick<Topic, 'slug' | 'title'>;
}

export function TopicBrowseSection({ talkCount, talks, topic }: TopicBrowseSectionProps) {
  const hasMoreTalks = talkCount > talks.length;
  const countLabel = `${talkCount} ${talkCount === 1 ? 'talk' : 'talks'}`;

  return (
    <section id={`topic-${topic.slug}`}>
      <SectionHeading
        className="mb-6"
        heading={
          <Link className="hover:underline" href={`/topics/${topic.slug}`}>
            {topic.title}
          </Link>
        }
        meta={
          hasMoreTalks ? (
            <Link
              className="inline-flex items-center gap-1 hover:text-foreground"
              href={`/topics/${topic.slug}`}
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
            <TalkCard key={talk._id} speaker={talk.speaker} talk={talk} />
          ))}
        </GridList>
      )}
    </section>
  );
}
