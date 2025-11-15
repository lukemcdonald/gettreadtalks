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
            description="Don't know what to listen to? Try starting with one of these favorites."
            featuredHref="/talks?featured=true"
            itemCount={featuredTalks.length}
            title="Featured Talks"
          >
            {featuredTalks.map((talk) => (
              <TalkCard
                // featured={talk.featured}
                key={talk._id}
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
                  _id: talk._id,
                  description: talk.description,
                  slug: talk.slug,
                  title: talk.title,
                }}
              />
            ))}
          </FeaturedGrid>

          <Separator className="my-8" />

          <FeaturedGrid
            allHref="/speakers"
            description="Have you listened to one of these faithful ministers of the Gospel?"
            featuredHref="/speakers?sort=featured"
            itemCount={featuredSpeakers.length}
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
