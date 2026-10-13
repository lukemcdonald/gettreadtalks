import { notFound } from 'next/navigation';

import { getClipBySlug } from '@/features/clips/queries/get-clip-by-slug';
import { getClipUrl } from '@/features/clips/utils';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{ clipSlug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { clipSlug } = await params;
  const data = await getClipBySlug(clipSlug);

  if (!data) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'clips',
    id: data.clip._id,
    publicPath: getClipUrl(clipSlug),
  });
}
