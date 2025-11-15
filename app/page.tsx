import Link from 'next/link';

import { SpeakerCard, TalkCard } from '@/components/cards';
import { FeaturedGrid } from '@/components/grid';
import { HeroSection, PageLayout, SectionContainer } from '@/components/layouts';
import { Separator } from '@/components/ui/separator';
import { getFeaturedSpeakers } from '@/lib/features/speakers';
import { getFeaturedTalks } from '@/lib/features/talks';

export default async function HomePage() {
  const [featuredTalks, featuredSpeakers] = await Promise.all([
    getFeaturedTalks(5),
    getFeaturedSpeakers(6),
  ]);

  return (
    <PageLayout>
      <SectionContainer>
        <div className="space-y-20">
          <HeroSection
            description="Christ centered sermons to elevate your spiritual heartbeat."
            imageAlt="Billy Graham preaching"
            imageSrc="/billy-graham-preaching-header.jpg"
            primaryAction={{ href: '/talks', label: 'Browse Talks' }}
            secondaryAction={{ href: '/speakers', label: 'Explore Speakers' }}
            title="Workout your salvation."
          />

          <FeaturedGrid
            allHref="/talks"
            columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            description="Don't know what to listen to? Try starting with one of these favorites."
            featuredHref="/talks?featured=true"
            sidebar={
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Quick Links
                </h3>
                <nav className="flex flex-col gap-2">
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/talks"
                  >
                    All Talks
                  </Link>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/talks?featured=true"
                  >
                    Featured Talks
                  </Link>
                </nav>
              </div>
            }
            title="Featured Talks"
          >
            {featuredTalks.map((talk) => (
              <TalkCard key={talk._id} speaker={talk.speaker ?? undefined} talk={talk} />
            ))}
          </FeaturedGrid>

          <Separator className="my-8" />

          <FeaturedGrid
            allHref="/speakers"
            columns={{ default: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
            description="Have you listened to one of these faithful ministers of the Gospel?"
            featuredHref="/speakers?sort=featured"
            sidebar={
              <div className="space-y-3">
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  Quick Links
                </h3>
                <nav className="flex flex-col gap-2">
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/speakers"
                  >
                    All Speakers
                  </Link>
                  <Link
                    className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/speakers?sort=featured"
                  >
                    Featured Speakers
                  </Link>
                </nav>
              </div>
            }
            title="Featured Speakers"
          >
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker._id}
                speaker={{
                  _id: speaker._id,
                  // featured: speaker.featured,
                  firstName: speaker.firstName,
                  imageUrl: speaker.imageUrl,
                  lastName: speaker.lastName,
                  role: speaker.role,
                  slug: speaker.slug,
                }}
              />
            ))}
          </FeaturedGrid>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}
