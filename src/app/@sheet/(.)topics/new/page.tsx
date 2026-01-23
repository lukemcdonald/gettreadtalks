'use client';

import { CreateTopicSheet } from '@/features/topics/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return <CreateTopicSheet onOpenChange={handleOpenChange} onTopicCreated={handleSuccess} open />;
}
