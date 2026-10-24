'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkStudy, TalkWithTopicIds } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet } from '@/components/ui';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import { EditTalkFields } from '@/features/talks/components/edit-talk-fields';
import {
  getTalkFormValues,
  getUrlChangeForTalk,
} from '@/features/talks/components/edit-talk-sheet-utils';
import { UrlChangeDialog } from '@/features/talks/components/url-change-dialog';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTalkSheetProps {
  closeHref?: string;
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  studyStatus?: TalkStudy['studyStatus'] | null;
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
}

interface PendingTalkUpdate {
  data: TalkFormData;
  urlChange: { newUrl: string; oldUrl: string };
}

function useEditTalkSheet({
  closeHref,
  statusPrefill,
  talk,
}: Pick<EditTalkSheetProps, 'closeHref' | 'statusPrefill' | 'talk'>) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);
  const [isPending, startTransition] = useTransition();
  const [pendingUpdate, setPendingUpdate] = useState<PendingTalkUpdate | null>(
    null
  );
  const form = useForm<TalkFormData>({
    mode: 'onBlur',
    // oxlint-disable-next-line typescript/no-explicit-any -- Zod 4 compatibility with zodResolver
    resolver: zodResolver(talkFormSchema as any),
    values: getTalkFormValues(talk, statusPrefill),
  });

  function submitData(data: TalkFormData) {
    startTransition(async () => {
      const result = await updateTalkAction(data, talk._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      handleSuccess();
      handleOpenChange(false);
    });
  }

  function confirmPendingUpdate() {
    if (!pendingUpdate) {
      return;
    }

    const { data } = pendingUpdate;
    setPendingUpdate(null);
    submitData(data);
  }

  return {
    confirmPendingUpdate,
    form,
    handleOpenChange,
    handleSubmit: form.handleSubmit((data) => {
      const urlChange = getUrlChangeForTalk(talk, data);

      if (urlChange) {
        setPendingUpdate({ data, urlChange });
        return;
      }

      submitData(data);
    }),
    isPending,
    pendingUpdate,
    setPendingUpdate,
  };
}

export function EditTalkSheet({
  closeHref,
  collections,
  speakers,
  statusPrefill,
  studyStatus,
  talk,
  topics,
}: EditTalkSheetProps) {
  const {
    confirmPendingUpdate,
    form,
    handleOpenChange,
    handleSubmit,
    isPending,
    pendingUpdate,
    setPendingUpdate,
  } = useEditTalkSheet({ closeHref, statusPrefill, talk });

  return (
    <>
      <FormSheet
        error={form.formState.errors.root}
        isPending={isPending}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        open
        submitLabel="Save Changes"
        title="Edit Talk"
      >
        <EditTalkFields
          collections={collections}
          form={form}
          speakers={speakers}
          studyStatus={studyStatus}
          talkId={talk._id}
          topics={topics}
        />
      </FormSheet>
      <UrlChangeDialog
        newUrl={pendingUpdate?.urlChange.newUrl ?? ''}
        oldUrl={pendingUpdate?.urlChange.oldUrl ?? ''}
        onConfirm={confirmPendingUpdate}
        onOpenChange={(open) => {
          if (!open) {
            setPendingUpdate(null);
          }
        }}
        open={pendingUpdate !== null}
      />
    </>
  );
}
