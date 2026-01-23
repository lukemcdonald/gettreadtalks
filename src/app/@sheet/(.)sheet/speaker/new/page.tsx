'use client';

import { useRouter } from 'next/navigation';

import { CreateSpeakerSheet } from '@/features/speakers/components';

export default function CreateSpeakerSheetRoute() {
  const router = useRouter();

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back();
    }
  }

  function handleSpeakerCreated() {
    router.back();
    router.refresh();
  }

  return (
    <CreateSpeakerSheet
      onOpenChange={handleOpenChange}
      onSpeakerCreated={handleSpeakerCreated}
      open
    />
  );
}
