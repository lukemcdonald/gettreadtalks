import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SidebarContent, SidebarLayout } from '@/components/layouts';
import { MediaEmbed } from '@/components/media';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTalkBySlug } from '@/lib/features/talks';
import { getCurrentUser } from '@/lib/services/auth/server';
import { ClipsList } from './_components/clips-list';
import { FavoriteTalkButton } from './_components/favorite-talk-button';

type TalkPageProps = {
  params: Promise<{ talk: string }>;
};

export default async function TalkPage({ params }: TalkPageProps) {
  const { talk: slug } = await params;
  const [talkData, user] = await Promise.all([getTalkBySlug(slug), getCurrentUser()]);

  if (!talkData) {
    notFound();
  }

  const { talk, speaker, collection, clips, topics } = talkData;

  return (
    <SidebarLayout
      main={
        <>
          <PageHeader
            breadcrumbs={[
              { href: '/', label: 'Home' },
              { href: '/talks/', label: 'Talks' },
              { href: `/talks/${slug}`, label: talk.title },
            ]}
            title={talk.title}
          />

          {talk.mediaUrl && (
            <div className="space-y-4">
              <MediaEmbed mediaUrl={talk.mediaUrl} />
            </div>
          )}

          {talk.description && (
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Description</h2>
              <p className="text-muted-foreground">{talk.description}</p>
            </div>
          )}

          {talk.scripture && (
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Scripture</h2>
              <p className="text-muted-foreground">{talk.scripture}</p>
            </div>
          )}

          {clips.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <ClipsList clips={clips} />
            </div>
          )}
        </>
      }
      sidebar={
        <>
          <SidebarContent title="Actions">
            <div className="flex flex-col gap-2">
              {user && (
                <Button render={<Link href={`/talks/${slug}/edit`} />} variant="outline">
                  Edit
                </Button>
              )}
              <FavoriteTalkButton talkId={talk._id} />
            </div>
          </SidebarContent>

          {speaker && (
            <SidebarContent title="Speaker">
              <div className="space-y-2">
                <p className="font-medium">
                  {speaker.firstName} {speaker.lastName}
                </p>
                {speaker.role && <p className="text-muted-foreground text-sm">{speaker.role}</p>}
                {speaker.ministry && (
                  <p className="text-muted-foreground text-sm">{speaker.ministry}</p>
                )}
                {speaker.description && (
                  <p className="text-muted-foreground text-sm">{speaker.description}</p>
                )}
                <Link
                  className="text-primary text-sm hover:underline"
                  href={`/speakers/${speaker.slug}`}
                >
                  View all talks →
                </Link>
              </div>
            </SidebarContent>
          )}

          {topics.length > 0 && (
            <SidebarContent title="Topics">
              <ul className="space-y-1">
                {topics.map((topic) => (
                  <li key={topic._id}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                      href={`/topics/${topic.slug}`}
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarContent>
          )}

          {collection && (
            <SidebarContent title="Collection">
              <div className="space-y-2">
                <p className="font-medium">{collection.title}</p>
                {collection.description && (
                  <p className="text-muted-foreground text-sm">{collection.description}</p>
                )}
                <Link
                  className="text-primary text-sm hover:underline"
                  href={`/collections/${collection.slug}`}
                >
                  View collection →
                </Link>
              </div>
            </SidebarContent>
          )}

          <SidebarContent title="Details">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-muted-foreground capitalize">{talk.status}</span>
              </div>
              {talk.publishedAt && (
                <div>
                  <span className="font-medium">Published:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(talk.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {talk.featured && (
                <div>
                  <span className="font-medium text-primary">Featured Talk</span>
                </div>
              )}
            </div>
          </SidebarContent>
        </>
      }
    />
  );
}
