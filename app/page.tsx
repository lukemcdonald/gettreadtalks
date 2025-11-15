import { SpeakerCard, TalkCard } from '@/components/cards';
import { FeaturedGrid } from '@/components/grid';
import { PageLayout, SectionContainer } from '@/components/layouts';
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
        <div className="space-y-12">
          <section className="space-y-6">
            <div>
              <h1 className="font-bold text-4xl tracking-tight">Workout your salvation.</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Christ centered sermons to elevate your spiritual heartbeat.
              </p>
            </div>
          </section>

          <FeaturedGrid title="Featured Talks" viewAllHref="/talks/featured/">
            {featuredTalks.map((talk) => (
              <TalkCard
                featured={talk.featured}
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

          <FeaturedGrid title="Featured Speakers" viewAllHref="/speakers/featured/">
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard
                featured={speaker.featured}
                key={speaker._id}
                speaker={{
                  _id: speaker._id,
                  featured: speaker.featured,
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
