import type { Talk } from '@/features/talks/types';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerTalkCardProps {
  speakerSlug: string;
  talk: Pick<Talk, 'description' | 'scripture' | 'slug' | 'title'>;
}

export function SpeakerTalkCard({ speakerSlug, talk }: SpeakerTalkCardProps) {
  return (
    <Card className="card-interactive group relative">
      <Link className="absolute inset-0 z-10" href={getTalkUrl(speakerSlug, talk.slug)}>
        <span className="sr-only">{talk.title}</span>
      </Link>
      <CardContent className="space-y-2 p-5">
        <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
          {talk.title}
        </h3>
        {talk.scripture && <p className="font-medium text-primary/80 text-sm">{talk.scripture}</p>}
        {talk.description && (
          <p className="line-clamp-2 text-muted-foreground text-sm">{talk.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
