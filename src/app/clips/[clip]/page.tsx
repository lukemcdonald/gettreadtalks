import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SidebarContent } from '@/components/layouts/sidebar-content';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';
import { MediaEmbed } from '@/components/media-embed';
import { PageHeader } from '@/components/page-header';
import { getClipBySlug } from '@/lib/features/clips';

type ClipPageProps = {
  params: Promise<{
    clip: string;
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
          <PageHeader title={clip.title} />

          {speaker && (
            <SidebarContent title="Speaker">
              <div className="space-y-2">
                <p className="font-semibold">{speakerName}</p>
                {speaker.role && <p className="text-muted-foreground text-sm">{speaker.role}</p>}
                {speaker.ministry && (
                  <p className="text-muted-foreground text-sm">{speaker.ministry}</p>
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

          {talk && (
            <SidebarContent title="Related Talk">
              <div className="space-y-2">
                <p className="font-semibold">{talk.title}</p>
                {talk.description && (
                  <p className="line-clamp-2 text-muted-foreground text-sm">{talk.description}</p>
                )}
                <Link className="text-primary text-sm hover:underline" href={`/talks/${talk.slug}`}>
                  View talk →
                </Link>
              </div>
            </SidebarContent>
          )}
        </>
      }
    />
  );
}
