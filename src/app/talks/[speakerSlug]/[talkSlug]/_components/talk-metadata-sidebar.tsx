import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';

import { ExternalLinkIcon } from 'lucide-react';

import { TalkAdminActions } from '@/app/talks/[speakerSlug]/[talkSlug]/_components/talk-admin-actions';
import { MetadataGroup } from '@/components/metadata-group';
import { Link } from '@/components/ui/link';
import { TalkActions } from '@/features/talks/components/talk-actions';
import { formatTalkFormat } from '@/features/talks/utils';
import { TopicLinks } from '@/features/topics/components/topic-links';
import { cn } from '@/utils';

function TalkFormatGroup({ format }: { format: Talk['format'] }) {
  if (!format) {
    return null;
  }

  return (
    <MetadataGroup label="Format">
      <p className="text-sm">{formatTalkFormat(format)}</p>
    </MetadataGroup>
  );
}

interface TalkMetadataSidebarProps {
  className?: string;
  speaker: Speaker | null;
  talk: Talk;
  topics: Topic[];
}

export function TalkMetadataSidebar({
  className,
  speaker,
  talk,
  topics,
}: TalkMetadataSidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-12',
        className
      )}
    >
      <MetadataGroup label="Actions">
        <TalkActions speaker={speaker} talk={talk} />
      </MetadataGroup>

      {talk.scripture && (
        <MetadataGroup label="Scripture">
          <Link
            className="bg-muted text-foreground hover:bg-muted/80 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
            href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(talk.scripture)}&version=ESV`}
            target="_blank"
          >
            {talk.scripture}
            <ExternalLinkIcon className="size-3.5" />
          </Link>
        </MetadataGroup>
      )}

      {topics.length > 0 && (
        <MetadataGroup label="Topics">
          <TopicLinks topics={topics} />
        </MetadataGroup>
      )}

      <TalkFormatGroup format={talk.format} />

      <TalkAdminActions speaker={speaker} talk={talk} />
    </div>
  );
}
