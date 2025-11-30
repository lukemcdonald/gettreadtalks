import type { Clip } from '@/features/clips/types';
import type { Talk } from '@/features/talks/types';

import { ClipsList } from '@/app/clips/_components/clips-list';
import { MediaEmbed } from '@/components/media-embed';
import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';

type TalkContentProps = {
  clips: Clip[];
  talk: Talk;
};

export function TalkContent({ clips, talk }: TalkContentProps) {
  return (
    <>
      <PageHeader title={talk.title} />

      {talk.mediaUrl && (
        <div className="space-y-4">
          <MediaEmbed mediaUrl={talk.mediaUrl} />
        </div>
      )}

      {talk.description && (
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Description</h2>
          <p className="text-muted-foreground">{talk.description}</p>
        </div>
      )}

      {talk.scripture && (
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Scripture</h2>
          <p className="text-muted-foreground">{talk.scripture}</p>
        </div>
      )}

      {clips.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <ClipsList clips={clips} />
        </div>
      )}
    </>
  );
}
