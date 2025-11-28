import type { Clip } from '@/features/clips/types';

import { MediaEmbed } from '@/components/media-embed';

type ClipContentProps = {
  clip: Clip;
};

export function ClipContent({ clip }: ClipContentProps) {
  return (
    <>
      {clip.mediaUrl && (
        <div className="space-y-4">
          <MediaEmbed mediaUrl={clip.mediaUrl} />
        </div>
      )}

      {clip.description && (
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Description</h2>
          <p className="text-muted-foreground">{clip.description}</p>
        </div>
      )}
    </>
  );
}
