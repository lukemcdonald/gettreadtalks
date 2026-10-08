import type { ClipId } from '@/features/clips/types';

import { redirect } from 'next/navigation';

import { EditClipSheetRoute } from '@/app/@sheet/_components/edit-clip-sheet-route';
import { getFormOptions } from '@/app/@sheet/_queries/get-form-options';
import { getClip } from '@/features/clips/queries/get-clip';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';
import { parseStatusPrefill } from '@/lib/entities/status-prefill';

interface EditClipSheetPageProps {
  closeHref?: string;
  params: Promise<{ clipId: ClipId }>;
  searchParams?: Promise<{ status?: string | string[] }>;
}

export async function EditClipSheetPage({
  closeHref,
  params,
  searchParams,
}: EditClipSheetPageProps) {
  const { clipId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const status = resolvedSearchParams?.status;

  const [clip, { speakers, talks }] = await Promise.all([
    getClip(clipId),
    getFormOptions(),
  ]);

  if (!clip) {
    redirect(ADMIN_LIST_PATHS.clips);
  }

  return (
    <EditClipSheetRoute
      clip={clip}
      closeHref={closeHref}
      speakers={speakers}
      statusPrefill={parseStatusPrefill(status)}
      talks={talks}
    />
  );
}
