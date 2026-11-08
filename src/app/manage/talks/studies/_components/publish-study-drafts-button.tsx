'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { ActionResult } from '@/lib/forms/types';

import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  toastManager,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { publishStudyDraftsAction } from '@/features/talks/actions/publish-study-drafts';
import { reportUnexpectedError } from '@/services/errors';

function formatStudyDraftCount(count: number) {
  return count === 1 ? '1 study draft' : `${count} study drafts`;
}

function getPublishedTitle(published: number) {
  if (published === 0) {
    return 'No study drafts published';
  }

  if (published === 1) {
    return 'Published 1 study';
  }

  return `Published ${published} studies`;
}

export function PublishStudyDraftsConfirm({
  featureIds,
  onPublish = publishStudyDraftsAction,
}: {
  featureIds: Id<'talkFeatures'>[];
  onPublish?: (
    featureIds: Id<'talkFeatures'>[]
  ) => Promise<ActionResult<{ published: number; skipped: number }>>;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [snapshotIds, setSnapshotIds] = useState<Id<'talkFeatures'>[] | null>(
    null
  );

  if (featureIds.length === 0) {
    return null;
  }

  const confirmCount = snapshotIds?.length ?? 0;

  async function handleConfirm() {
    if (!snapshotIds || isPending) {
      return;
    }

    setIsPending(true);

    try {
      const result = await onPublish(snapshotIds);

      if (!result.success) {
        toastManager.add({
          description: result.errors._form,
          title: 'Could not publish study drafts',
          type: 'error',
        });
        setIsPending(false);
        return;
      }

      const { published, skipped } = result.data;

      toastManager.add({
        description:
          skipped > 0
            ? `${skipped} ${skipped === 1 ? 'study was' : 'studies were'} skipped.`
            : undefined,
        title: getPublishedTitle(published),
        type: 'success',
      });
      setSnapshotIds(null);
      setIsPending(false);
      router.refresh();
    } catch (error) {
      toastManager.add({
        description: reportUnexpectedError(error, {
          fingerprint: ['error', 'publishStudyDrafts'],
          tags: { operation: 'publishStudyDrafts' },
        }),
        title: 'Could not publish study drafts',
        type: 'error',
      });
      setIsPending(false);
    }
  }

  return (
    <>
      <Button
        data-testid="publish-study-drafts"
        disabled={isPending}
        onClick={() => setSnapshotIds(featureIds)}
        size="sm"
        type="button"
        variant="outline"
      >
        Publish all study drafts ({featureIds.length})
      </Button>
      <AlertDialog
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setSnapshotIds(null);
          }
        }}
        open={snapshotIds !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Publish {formatStudyDraftCount(confirmCount)}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This publishes existing nonempty study drafts. Published studies
              stay as they are. Cancel makes no changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose
              disabled={isPending}
              render={<Button variant="outline" />}
            >
              Cancel
            </AlertDialogClose>
            <Button
              data-testid="publish-study-drafts-confirm"
              loading={isPending}
              onClick={handleConfirm}
            >
              Publish
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function PublishStudyDraftsButton() {
  const result = useQuery(api.talkFeatures.listEligibleStudyDrafts);

  if (!result) {
    return null;
  }

  return <PublishStudyDraftsConfirm featureIds={result.featureIds} />;
}
