import type { TalkWithSpeaker } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import Link from 'next/link';

import { ScrollArea } from '@/components/ui';
import { TalkCard } from '@/features/talks/components/talk-card';
import { TopicViewAllCard } from './topic-view-all-card';

interface TopicBrowseSectionProps {
  talkCount: number;
  talks: TalkWithSpeaker[];
  topic: Pick<Topic, 'slug' | 'title'>;
}

/**
 * Single topic section with left column info and horizontal scrolling talks.
 * Uses same 3:9 column ratio as SidebarLayout for consistency.
 */
export function TopicBrowseSection({ talkCount, talks, topic }: TopicBrowseSectionProps) {
  const hasMoreTalks = talkCount > talks.length;

  return (
    <div className="grid grid-cols-12 items-stretch gap-12">
      {/* Left column - Topic info (3 of 12 columns, matches sidebar width) */}
      <div className="col-span-3 space-y-1 pt-2">
        <h2 className="font-semibold text-lg leading-tight">{topic.title}</h2>
        <p className="text-muted-foreground text-sm">
          {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
        </p>
        {hasMoreTalks && (
          <Link className="text-primary text-sm hover:underline" href={`/topics/${topic.slug}`}>
            View all
          </Link>
        )}
      </div>

      {/* Right column - Horizontal scrolling talks (9 of 12 columns) */}
      <div className="col-span-9">
        <ScrollArea allowPageScroll className="w-full" scrollFade>
          <div className="flex items-stretch gap-4 pb-2">
            {talks.length === 0 ? (
              <div className="py-8 text-muted-foreground text-sm">No talks available</div>
            ) : (
              <>
                {talks.map((talk) => (
                  <div className="h-full w-[calc(50%-0.5rem)] shrink-0" key={talk._id}>
                    <TalkCard speaker={talk.speaker} talk={talk} />
                  </div>
                ))}
                {hasMoreTalks && (
                  <div className="h-full w-48 shrink-0">
                    <TopicViewAllCard slug={topic.slug} talkCount={talkCount} title={topic.title} />
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
