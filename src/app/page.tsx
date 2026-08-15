import { FeaturedGrid } from '@/components/featured-grid';
import { HeroSection } from '@/components/hero';
import { JsonLd } from '@/components/json-ld';
import { Main } from '@/components/main';
import { Container, Section } from '@/components/ui';
import { site } from '@/configs/site';
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: site.description,
    name: site.name,
    potentialAction: {
      '@type': 'SearchAction',
      'query-input': 'required name=search_term_string',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/talks?search={search_term_string}`,
      },
    },
    url: site.url,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Main>
        <Section spacing="xl">
          <Container>
            <HeroSection
              description={site.description}
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
              columns={{ default: 1, lg: 2, md: 2, sm: 1, xl: 2 }}
              description={
                <>
                  <strong>Don&apos;t know what to listen to?</strong> Try
                  starting with one of these favorites.
                </>
              }
              quickLinks={[
                { href: '/talks', label: 'All Talks' },
                { href: '/talks?featured=true', label: 'Featured Talks' },
              ]}
              title="Featured Talks"
            >
              {featuredTalks.map((talk) => (
                <TalkCard key={talk._id} speaker={talk.speaker} talk={talk} />
              ))}
            </FeaturedGrid>
          </Container>
        </Section>

        <Section spacing="xl">
          <Container>
            <FeaturedGrid
              columns={{ default: 1, lg: 3, md: 3, sm: 2, xl: 3 }}
              description="Have you listened to one of these faithful ministers of the Gospel?"
              quickLinks={[
                { href: '/speakers', label: 'All Speakers' },
                { href: '/speakers?sort=featured', label: 'Featured Speakers' },
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
    </>
  );
}
