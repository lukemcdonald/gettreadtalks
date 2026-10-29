import { notFound } from 'next/navigation';

import { ClipContent } from '@/app/clips/[clipSlug]/_components/clip-content';
import { ClipHero } from '@/app/clips/[clipSlug]/_components/clip-hero';
import { buildClipJsonLd } from '@/app/clips/[clipSlug]/_components/clip-json-ld';
import { JsonLd } from '@/components/json-ld';
import { EditorialProfileLayout } from '@/components/layouts';
import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { buildClipPath, buildClipsPath } from '@/features/clips/utils';
import { buildBreadcrumbJsonLd } from '@/lib/json-ld';

type ClipBySlug = NonNullable<Awaited<ReturnType<typeof loadClipBySlug>>>;

interface ClipPageContentProps {
  params: Promise<{ clipSlug: string }>;
}

function hasClipBody({ clip, speaker, talk }: ClipBySlug) {
  return Boolean(clip.description?.trim() || speaker || talk);
}

function ClipDetail({ data }: { data: ClipBySlug }) {
  const { clip, speaker, talk } = data;
  const segments = [
    { href: buildClipsPath(), label: 'Clips' },
    { href: buildClipPath(clip), label: clip.title },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(segments)} />
      <JsonLd data={buildClipJsonLd({ clip, speaker, talk })} />
      <EditorialProfileLayout
        content={
          hasClipBody(data) ? (
            <ClipContent clip={clip} speaker={speaker} talk={talk} />
          ) : undefined
        }
        hero={<ClipHero clip={clip} speaker={speaker} />}
      />
    </>
  );
}

export async function ClipPageContent({ params }: ClipPageContentProps) {
  const { clipSlug } = await params;
  const data = await loadClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  return <ClipDetail data={data} />;
}
