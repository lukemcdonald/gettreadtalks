'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

type SpeakerCardProps = {
  favorited?: boolean;
  speaker: {
    _id: string;
    featured?: boolean;
    firstName: string;
    imageUrl?: string;
    lastName: string;
    role?: string;
    slug: string;
  };
};

export function SpeakerCard({ favorited, speaker }: SpeakerCardProps) {
  const speakerName = `${speaker.firstName} ${speaker.lastName}`;
  const speakerInitials = `${speaker.firstName[0]}${speaker.lastName[0]}`;

  return (
    <Card
      className="group min-w-0 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      render={<Link href={`/speakers/${speaker.slug}`} />}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            {speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
            <AvatarFallback className="text-base">{speakerInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="group-hover:text-primary">{speakerName}</CardTitle>
              <div className="flex flex-col gap-1">
                {speaker.featured && (
                  <Badge className="bg-primary/10 text-primary text-xs" variant="secondary">
                    Featured
                  </Badge>
                )}
                {favorited && (
                  <Badge
                    className="bg-yellow-500/10 text-xs text-yellow-600 dark:text-yellow-400"
                    variant="secondary"
                  >
                    ★
                  </Badge>
                )}
              </div>
            </div>
            {speaker.role && <p className="mt-1 text-muted-foreground text-sm">{speaker.role}</p>}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
