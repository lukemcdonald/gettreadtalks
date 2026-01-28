import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import Link from 'next/link';

import { getSpeakerName } from '@/features/speakers/utils';

interface TalkTitleCellProps {
  talk: TalkWithSpeakerAndTopics;
  talkUrl: string;
}

export function TalkTitleCell({ talk, talkUrl }: TalkTitleCellProps) {
  return (
    <div className="min-w-0 flex-1">
      <Link className="line-clamp-2 block hover:underline" href={talkUrl}>
        {talk.title}
      </Link>
      {!!talk.speaker && (
        <p className="truncate text-muted-foreground text-sm">by {getSpeakerName(talk.speaker)}</p>
      )}
    </div>
  );
}
