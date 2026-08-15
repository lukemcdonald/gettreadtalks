import type { CollectionData } from '@/features/collections/types';
import type { TalkWithSpeaker } from '@/features/talks/types';

import { TalkCard } from '@/features/talks/components/talk-card';

interface CollectionTalkListProps {
  talks: CollectionData['talks'];
}

export function CollectionTalkList({ talks }: CollectionTalkListProps) {
  return (
    <ol className="relative flex flex-col gap-3">
      {talks.length > 1 && (
        <div className="bg-border absolute top-6 bottom-6 left-4 w-px -translate-x-1/2" />
      )}

      {talks.map((talk: TalkWithSpeaker, index) => (
        <li className="flex items-center gap-4" key={talk._id}>
          <div className="border-border bg-card text-muted-foreground relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold tabular-nums">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <TalkCard
              speaker={
                talk.speaker
                  ? {
                      firstName: talk.speaker.firstName,
                      imageUrl: talk.speaker.imageUrl,
                      lastName: talk.speaker.lastName,
                      slug: talk.speaker.slug,
                    }
                  : undefined
              }
              talk={{
                description: talk.description,
                scripture: talk.scripture,
                slug: talk.slug,
                title: talk.title,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
