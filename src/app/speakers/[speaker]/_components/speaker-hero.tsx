import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ExternalLinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { SpeakerHeroBackground } from '@/app/speakers/[speaker]/_components/speaker-hero-background';
import { SpeakerHeroDetails } from '@/app/speakers/[speaker]/_components/speaker-hero-details';
import { SpeakerHeroFeaturedTalk } from '@/app/speakers/[speaker]/_components/speaker-hero-featured';
import { MediaEmbed, getVideoThumbnail } from '@/components/media-embed';
import { Badge } from '@/components/ui';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers/utils';
import { getTalkUrl } from '@/features/talks/utils';

interface SpeakerHeroProps {
  featuredTalk?: Talk;
  speaker: Speaker;
}

export function SpeakerHero({ featuredTalk, speaker }: SpeakerHeroProps) {
  const imageSrc = getVideoThumbnail(featuredTalk?.mediaUrl);

  return (
    <div className="relative overflow-hidden">
      <SpeakerHeroBackground imageSrc={imageSrc} />

      <div className="container relative py-10 md:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr,minmax(0,480px)] lg:gap-12 xl:gap-16">
          <SpeakerHeroDetails speaker={speaker} />

          {featuredTalk?.mediaUrl && (
            <SpeakerHeroFeaturedTalk speaker={speaker} talk={featuredTalk} />
          )}
        </div>
      </div>
    </div>
  );
}
