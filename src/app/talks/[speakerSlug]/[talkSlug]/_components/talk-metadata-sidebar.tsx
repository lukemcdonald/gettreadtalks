import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { TalkActions } from '@/features/talks/components/talk-actions';
import { TopicLinks } from '@/features/topics/components/topic-links';

interface TalkMetadataSidebarProps {
  speaker: Speaker | null;
  talk: Talk;
  topics: Topic[];
}

export function TalkMetadataSidebar({
  speaker,
  talk,
  topics,
}: TalkMetadataSidebarProps) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 lg:flex-col lg:gap-8">
      {/* About */}
      {talk.description && (
        <div className="space-y-4 sm:basis-full lg:basis-auto">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            About
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {talk.description}
          </p>
        </div>
      )}

      {/* Topics */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Topics
        </h3>
        {topics.length > 0 ? (
          <TopicLinks topics={topics} />
        ) : (
          <span className="text-muted-foreground text-sm">No topics</span>
        )}
      </div>

      {/* Scripture */}
      {talk.scripture && (
        <div className="space-y-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            Scripture
          </h3>
          <Link
            className="bg-muted text-foreground hover:bg-muted/80 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
            href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(talk.scripture)}&version=ESV`}
            target="_blank"
          >
            {talk.scripture}
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Actions
        </h3>
        <TalkActions speaker={speaker} talk={talk} />
      </div>
    </div>
  );
}
