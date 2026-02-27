import { FeaturedGrid } from '@/components/featured-grid';
import { HeroSection } from '@/components/hero-section';
import { Main } from '@/components/main';
import { Container, Section } from '@/components/ui';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';
import { getFeaturedSpeakers } from '@/features/speakers/queries/get-featured-speakers';
import { TalkCard } from '@/features/talks/components/talk-card';
import { getFeaturedTalks } from '@/features/talks/queries/get-featured-talks';

export default async function HomePage() {
  const [featuredTalksResult, featuredSpeakersResult] = await Promise.all([
    getFeaturedTalks(6),
    getFeaturedSpeakers(6),
  ]);

  const featuredTalks = featuredTalksResult.talks;
  const featuredSpeakers = featuredSpeakersResult.speakers;

  return (
    <Main>
      <Section spacing="xl">
        <Container>
          <HeroSection
            description="Christ centered sermons to elevate your spiritual heartbeat."
            imageAlt="Billy Graham preaching"
            imageSrc="/billy-graham-preaching-header.jpg"
            primaryAction={{ href: '/talks', label: 'Browse Talks' }}
            secondaryAction={{ href: '/speakers', label: 'Explore Speakers' }}
            title="Workout your salvation."
          />
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <FeaturedGrid
            columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            // TODO: How can I make text bold, "Don't know what to listen to?"
            description="Don't know what to listen to? Try starting with one of these favorites."
            quickLinks={[
              { label: 'All Talks', href: '/talks' },
              { label: 'Featured Talks', href: '/talks?featured=true' },
            ]}
            title="Featured Talks"
          >
            {featuredTalks.map((talk) => (
              <TalkCard key={talk._id} speaker={talk.speaker ?? undefined} talk={talk} />
            ))}
          </FeaturedGrid>
        </Container>
      </Section>

      <Section spacing="xl">
        <Container>
          <FeaturedGrid
            columns={{ default: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
            description="Have you listened to one of these faithful ministers of the Gospel?"
            quickLinks={[
              { label: 'All Speakers', href: '/speakers' },
              { label: 'Featured Speakers', href: '/speakers?sort=featured' },
            ]}
            title="Featured Speakers"
          >
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker._id}
                speaker={{
                  firstName: speaker.firstName,
                  imageUrl: speaker.imageUrl,
                  lastName: speaker.lastName,
                  role: speaker.role,
                  slug: speaker.slug,
                }}
              />
            ))}
          </FeaturedGrid>
        </Container>
      </Section>
    </Main>
  );
}
