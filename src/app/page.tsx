import { FeaturedGrid } from '@/components/featured-grid';
import { HeroSection } from '@/components/hero';
import { JsonLd } from '@/components/json-ld';
import { Container, Section } from '@/components/ui';
import { site } from '@/configs/site';
import { buildSearchPath } from '@/features/search/utils';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';
import { loadFeaturedSpeakers } from '@/features/speakers/queries/load-featured-speakers';
import { buildSpeakersPath } from '@/features/speakers/utils';
import { TalkCard } from '@/features/talks/components/talk-card';
import { loadFeaturedTalks } from '@/features/talks/queries/load-featured-talks';
import { buildTalksPath } from '@/features/talks/utils';
import { buildAbsoluteUrl } from '@/lib/entities/paths';

function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: site.description,
    name: site.name,
    potentialAction: {
      '@type': 'SearchAction',
      'query-input': 'required name=search_term_string',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildAbsoluteUrl(
          `${buildSearchPath()}?search={search_term_string}`
        ),
      },
    },
    url: site.url,
  };
}

export default async function HomePage() {
  const [featuredTalksResult, featuredSpeakersResult] = await Promise.all([
    loadFeaturedTalks(6),
    loadFeaturedSpeakers(6),
  ]);

  const featuredTalks = featuredTalksResult.talks;
  const featuredSpeakers = featuredSpeakersResult.speakers;

  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      <Section spacing="xl">
        <Container>
          <HeroSection
            description={site.description}
            imageAlt="Billy Graham preaching"
            imageSrc="/billy-graham-preaching-header.jpg"
            primaryAction={{ href: buildTalksPath(), label: 'Browse Talks' }}
            secondaryAction={{
              href: buildSpeakersPath(),
              label: 'Explore Speakers',
            }}
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
                <strong>Don&apos;t know what to listen to?</strong> Try starting
                with one of these favorites.
              </>
            }
            quickLinks={[
              { href: buildTalksPath(), label: 'All Talks' },
              {
                href: buildTalksPath({ query: { featured: true } }),
                label: 'Featured Talks',
              },
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
              { href: buildSpeakersPath(), label: 'All Speakers' },
              {
                href: buildSpeakersPath({ query: { sort: 'featured' } }),
                label: 'Featured Speakers',
              },
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
    </>
  );
}
