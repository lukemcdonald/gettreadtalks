import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ExternalLinkIcon } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { ShareTalkButton } from '@/features/talks/components/share-talk-button';
import { FavoriteTalkButton } from '@/features/users/components/favorite-talk-button';
import { FinishTalkButton } from '@/features/users/components/finish-talk-button';

interface TalkMetadataSidebarProps {
  speakerSlug: string;
  talk: Talk;
  talkSlug: string;
  topics: Topic[];
}

export function TalkMetadataSidebar({
  speakerSlug,
  talk,
  talkSlug,
  topics,
}: TalkMetadataSidebarProps) {
  const talkUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gettreadtalks.com'}/talks/${speakerSlug}/${talkSlug}`;

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12 xl:flex-col xl:gap-8">
      {/* Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <FeatureTalkButton featured={talk.featured ?? false} talkId={talk._id} />
          <FavoriteTalkButton talkId={talk._id} />
          <FinishTalkButton talkId={talk._id} />
          <ShareTalkButton talkId={talk._id} title={talk.title} url={talkUrl} />
        </div>
      </div>

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
    </div>
  );
}
