import { notFound } from 'next/navigation';

import { DetailPageLayout, SectionContainer } from '@/components/layouts';
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
    <DetailPageLayout>
      <SectionContainer>
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

        {clip.description && (
          <p className="text-lg text-muted-foreground">{clip.description}</p>
        )}

        {speaker && (
          <>
            <Separator />
            <div className="space-y-4">
              <h2 className="font-bold text-xl">Speaker</h2>
              <p>
                <a className="text-primary hover:underline" href={`/speakers/${speaker.slug}`}>
                  {speakerName}
                </a>
              </p>
            </div>
          </>
        )}

        {talk && (
          <>
            <Separator />
            <div className="space-y-4">
              <h2 className="font-bold text-xl">Related Talk</h2>
              <p>
                <a className="text-primary hover:underline" href={`/talks/${talk.slug}`}>
                  {talk.title}
                </a>
              </p>
            </div>
          </>
        )}
      </SectionContainer>
    </DetailPageLayout>
  );
}
