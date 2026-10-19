'use client';

import type { MediaCheckId } from '../types';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { ignoreMediaCheckAction } from '@/features/media-health/actions/ignore-media-check';
import { formatErrorMessage } from '@/services/errors';

interface IgnoreMediaCheckButtonProps {
  mediaCheckId: MediaCheckId;
}

export function IgnoreMediaCheckButton({
  mediaCheckId,
}: IgnoreMediaCheckButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onIgnore() {
    startTransition(async () => {
      try {
        const result = await ignoreMediaCheckAction(mediaCheckId);

        if (!result.success) {
          toastManager.add({
            description: result.errors._form ?? 'Could not ignore this item.',
            title: 'Ignore failed',
            type: 'error',
          });
          return;
        }

        toastManager.add({ title: 'Ignored', type: 'success' });
        router.refresh();
      } catch (error) {
        toastManager.add({
          description: formatErrorMessage(error),
          title: 'Ignore failed',
          type: 'error',
        });
      }
    });
  }

  return (
    <Button loading={isPending} onClick={onIgnore} size="sm" variant="outline">
      Ignore
    </Button>
  );
}
