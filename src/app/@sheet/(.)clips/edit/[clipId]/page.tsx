import type { ClipId } from '@/features/clips/types';

import { EditClipSheetPage } from '@/app/@sheet/_components/edit-clip-sheet-page';

interface PageProps {
  params: Promise<{ clipId: ClipId }>;
  searchParams: Promise<{ status?: string | string[] }>;
}

export default function Page({ params, searchParams }: PageProps) {
  return <EditClipSheetPage params={params} searchParams={searchParams} />;
}
