import { notFound } from 'next/navigation';

import { loadClipBySlug } from '@/features/clips/queries/load-clip-by-slug';
import { buildClipPath } from '@/features/clips/utils';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ clipSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { clipSlug } = await params;
  const data = await loadClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'clips',
    id: data.clip._id,
    publicPath: buildClipPath(data.clip),
  });
}
