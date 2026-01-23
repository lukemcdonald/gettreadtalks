'use client';

import { useRouter } from 'next/navigation';

export function useSheetRoute() {
  const router = useRouter();

  return {
    handleOpenChange: (open: boolean) => {
      if (!open) {
        router.back();
      }
    },
    handleSuccess: () => {
      router.back();
      router.refresh();
    },
  };
}
