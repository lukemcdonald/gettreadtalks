import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MediaEmbed } from '@/components/media';
import { SidebarContent, SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
import { getClipBySlug } from '@/lib/features/clips';

type ClipPageProps = {
  params: Promise<{
    clip: string;
    speaker: string;
  }>;
};

export default async function ClipPage({ params }: ClipPageProps) {
  const { clip: slug } = await params;
  const data = await getClipBySlug(slug);

  if (!data) {
    notFound();
  }

  const { clip, speaker, talk } = data;
  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : null;

  return (
    <SidebarLayout
      main={
        <>
          <PageHeader
            breadcrumbs={[
              { href: '/', label: 'Home' },
              { href: '/clips/', label: 'Clips' },
              ...(speaker
                ? [{ href: `/speakers/${speaker.slug}`, label: speakerName || 'Speaker' }]
                : []),
              { href: `/clips/${slug}`, label: clip.title },
            ]}
            title={clip.title}
          />

          {clip.mediaUrl && (
            <div className="space-y-4">
              <MediaEmbed mediaUrl={clip.mediaUrl} />
            </div>
          )}

          {clip.description && (
            <div className="space-y-2">
              <h2 className="font-semibold text-lg">Description</h2>
              <p className="text-muted-foreground">{clip.description}</p>
            </div>
          )}
        </>
      }
      sidebar={
        <>
          {speaker && (
            <SidebarContent title="Speaker">
              <div className="space-y-2">
                <p className="font-medium">{speakerName}</p>
                {speaker.role && <p className="text-muted-foreground text-sm">{speaker.role}</p>}
                {speaker.ministry && (
                  <p className="text-muted-foreground text-sm">{speaker.ministry}</p>
                )}
                <Link
                  className="text-primary hover:underline text-sm"
                  href={`/speakers/${speaker.slug}`}
                >
                  View all talks →
                </Link>
              </div>
            </SidebarContent>
          )}

          {talk && (
            <SidebarContent title="Related Talk">
              <div className="space-y-2">
                <p className="font-medium">{talk.title}</p>
                {talk.description && (
                  <p className="line-clamp-2 text-muted-foreground text-sm">{talk.description}</p>
                )}
                <Link
                  className="text-primary hover:underline text-sm"
                  href={`/talks/${talk.slug}`}
                >
                  View talk →
                </Link>
              </div>
            </SidebarContent>
          )}

          <SidebarContent title="Details">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-muted-foreground capitalize">{clip.status}</span>
              </div>
              {clip.publishedAt && (
                <div>
                  <span className="font-medium">Published:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(clip.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </SidebarContent>
        </>
      }
    />
  );
}
