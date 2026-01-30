import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { SpeakerHeroBackground } from '@/app/speakers/[speaker]/_components/speaker-hero-background';
import { SpeakerHeroDetails } from '@/app/speakers/[speaker]/_components/speaker-hero-details';
import { SpeakerHeroFeaturedTalk } from '@/app/speakers/[speaker]/_components/speaker-hero-featured';
import { getVideoThumbnail } from '@/components/media-embed';

interface SpeakerHeroProps {
  featuredTalk?: Talk;
  speaker: Speaker;
}

export function SpeakerHero({ featuredTalk, speaker }: SpeakerHeroProps) {
  const imageSrc = getVideoThumbnail(featuredTalk?.mediaUrl);

  return (
    <div className="relative overflow-hidden">
      <SpeakerHeroBackground imageSrc={imageSrc} />

      <div className="container relative py-8 md:py-10 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="lg:flex-[2]">
            <SpeakerHeroDetails speaker={speaker} />
          </div>

          {featuredTalk?.mediaUrl && (
            <div className="lg:flex-[3]">
              <SpeakerHeroFeaturedTalk speaker={speaker} talk={featuredTalk} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
