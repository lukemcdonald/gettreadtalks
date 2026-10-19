import { notFound } from 'next/navigation';

import { loadTalkBySlug } from '@/features/talks/queries/load-talk-by-slug';
import { loadTalkBySlugAdmin } from '@/features/talks/queries/load-talk-by-slug-admin';
import { buildTalkPath } from '@/features/talks/utils';
import { redirectPublicEdit } from '@/lib/entities/redirect-public-edit';

interface PageProps {
  params: Promise<{
    speakerSlug: string;
    talkSlug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { speakerSlug, talkSlug } = await params;
  const talkResult =
    (await loadTalkBySlug(speakerSlug, talkSlug)) ??
    (await loadTalkBySlugAdmin(speakerSlug, talkSlug));

  if (!talkResult) {
    notFound();
  }

  await redirectPublicEdit({
    entity: 'talks',
    id: talkResult.talk._id,
    publicPath: buildTalkPath(speakerSlug, talkSlug),
  });
}
