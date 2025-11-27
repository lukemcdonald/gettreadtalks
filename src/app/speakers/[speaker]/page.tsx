import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClipCard } from '@/components/clip-card';
import { CollectionCard } from '@/components/collection-card';
import { GridList } from '@/components/grid-list';
import { PageHeader } from '@/components/page-header';
import { PageLayout } from '@/components/page-layout';
import { SidebarContent } from '@/components/sidebar-content';
import { TalkCard } from '@/components/talk-card';
import { Separator } from '@/components/ui/separator';
import { getSpeakerBySlug } from '@/features/speakers';

type SpeakerPageProps = {
  params: Promise<{
    speaker: string;
  }>;
};

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { speaker: slug } = await params;
  const data = await getSpeakerBySlug(slug);

  if (!data) {
    notFound();
  }

  const { clips, collections, speaker, talks } = data;
  const speakerName = `${speaker.firstName} ${speaker.lastName}`;

  // Create custom speaker header that displays a larger image to left of speaker name with role and ministry below in larger font. Or consider showing meta in left sidebar and content states in right sidebar. Add talks, collections, and clips to content states, linking to filtered archive when more than 5.
  return (
    <PageLayout>
      <PageLayout.Header render={<PageHeader title={speakerName} />} />

      <PageLayout.Sidebar>
        {speaker.imageUrl && (
          <SidebarContent>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image alt={speakerName} className="object-cover" fill src={speaker.imageUrl} />
            </div>
          </SidebarContent>
        )}

        <SidebarContent title="About">
          <dl>
            {speaker.role && (
              <>
                <dt className="font-semibold">Role:</dt>
                <dd>{speaker.role}</dd>
              </>
            )}
            {speaker.ministry && (
              <>
                <dt className="font-semibold">Ministry:</dt>
                <dd>{speaker.ministry}</dd>
              </>
            )}
          </dl>
        </SidebarContent>

        <SidebarContent title="Content">
          <nav className="flex flex-col gap-2">
            <Link href={`/speakers/${slug}#talks`}>
              {talks.length} {talks.length === 1 ? 'Talk' : 'Talks'} →
            </Link>
            {collections.length > 0 && (
              <Link href={`/speakers/${slug}#collections`}>
                {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'} →
              </Link>
            )}
            {clips.length > 0 && (
              <Link href={`/speakers/${slug}#clips`}>
                {clips.length} {clips.length === 1 ? 'Clip' : 'Clips'} →
              </Link>
            )}
          </nav>
        </SidebarContent>
      </PageLayout.Sidebar>

      <PageLayout.Content>
        {speaker.description && (
          <div className="space-y-4">
            <p className="text-muted-foreground">{speaker.description}</p>
          </div>
        )}

        <Separator />

        <div className="space-y-12">
          {talks.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-semibold text-2xl">Talks</h2>
              <p className="text-muted-foreground">Enjoy more talks by {speakerName}.</p>
              <GridList>
                {talks.map((talk) => (
                  <TalkCard
                    featured={talk.featured}
                    key={talk._id}
                    speaker={{
                      firstName: speaker.firstName,
                      imageUrl: speaker.imageUrl,
                      lastName: speaker.lastName,
                      slug: speaker.slug,
                    }}
                    talk={{
                      description: talk.description,
                      slug: talk.slug,
                      title: talk.title,
                    }}
                  />
                ))}
              </GridList>
            </section>
          )}

          {collections.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-semibold text-2xl">Collections</h2>
              <GridList>
                {collections.map((collection) => (
                  <CollectionCard
                    collection={{
                      description: collection.description,
                      slug: collection.slug,
                      title: collection.title,
                    }}
                    key={collection._id}
                  />
                ))}
              </GridList>
            </section>
          )}

          {clips.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-semibold text-2xl">Clips</h2>
              <p className="text-muted-foreground">
                Be encouraged by {clips.length === 1 ? 'this short' : 'these short'} Christ centered{' '}
                {clips.length === 1 ? 'clip' : 'clips'}.
              </p>
              <GridList>
                {clips.map((clip) => (
                  <ClipCard
                    clip={{
                      description: clip.description,
                      slug: clip.slug,
                      title: clip.title,
                    }}
                    key={clip._id}
                    speaker={{
                      firstName: speaker.firstName,
                      imageUrl: speaker.imageUrl,
                      lastName: speaker.lastName,
                      slug: speaker.slug,
                    }}
                  />
                ))}
              </GridList>
            </section>
          )}
        </div>
      </PageLayout.Content>

      <PageLayout.Sidebar>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </PageLayout.Sidebar>
    </PageLayout>
  );
}
