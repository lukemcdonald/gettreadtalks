import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { ShareTalkButton } from '@/features/talks/components/share-talk-button';
import { FavoriteTalkButton } from '@/features/users/components/favorite-talk-button';
import { FinishTalkButton } from '@/features/users/components/finish-talk-button';

interface TalkMetadataSidebarProps {
  talk: Talk;
  topics: Topic[];
}

export function TalkMetadataSidebar({ talk, topics }: TalkMetadataSidebarProps) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 lg:flex-col lg:gap-8">
      {/* About */}
      {talk.description && (
        <div className="space-y-4 sm:basis-full lg:basis-auto">
          <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            About
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{talk.description}</p>
        </div>
      )}

      {/* Topics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <Link
                className="inline-block rounded-full bg-muted px-3 py-1.5 text-foreground text-sm transition-colors hover:bg-muted/80"
                href={`/topics/${topic.slug}`}
                key={topic._id}
              >
                {topic.title}
              </Link>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No topics</span>
          )}
        </div>
      </div>

      {/* Scripture */}
      {talk.scripture && (
        <div className="space-y-4">
          <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            Scripture
          </h3>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-foreground text-sm transition-colors hover:bg-muted/80"
            href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(talk.scripture)}&version=ESV`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {talk.scripture}
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <ShareTalkButton talkId={talk._id} talkTitle={talk.title} />
          <FavoriteTalkButton talkId={talk._id} />
          <FinishTalkButton talkId={talk._id} />
          <FeatureTalkButton featured={talk.featured ?? false} talkId={talk._id} />
        </div>
      </div>
    </div>
  );
}
