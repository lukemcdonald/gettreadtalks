'use client';

import { useRouter } from 'next/navigation';

export function useSheetRoute(closeHref?: string) {
  const router = useRouter();

  return {
    handleOpenChange: (open: boolean) => {
      if (!open) {
        if (closeHref) {
          router.replace(closeHref);
        } else {
          router.back();
        }
      }
    },
    handleSuccess: () => {
      router.refresh();
    },
  };
}
