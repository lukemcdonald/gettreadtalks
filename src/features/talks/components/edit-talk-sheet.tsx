'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkFormData } from '@/features/talks/schemas/talk-form';
import type { TalkStudy, TalkWithTopicIds } from '@/features/talks/types';
import type { EditTalkTab } from '@/features/talks/utils';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import {
  Button,
  FormError,
  FormSheetBody,
  FormSheetShell,
} from '@/components/ui';
import { updateTalkAction } from '@/features/talks/actions/update-talk';
import {
  getTalkFormValues,
  getUrlChangeForTalk,
} from '@/features/talks/components/edit-talk-sheet-utils';
import { EditTalkStudyPanel } from '@/features/talks/components/edit-talk-study-panel';
import { EditTalkTabs } from '@/features/talks/components/edit-talk-tabs';
import { TalkFormFields } from '@/features/talks/components/talk-form-fields';
import { UrlChangeDialog } from '@/features/talks/components/url-change-dialog';
import { talkFormSchema } from '@/features/talks/schemas/talk-form';
import { buildTalkEditPath, getEditTalkTab } from '@/features/talks/utils';
import { buildEntityEditPath } from '@/lib/entities/paths';
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
    handleSuccess,
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

function useEditTalkTab(talkId: TalkWithTopicIds['_id']) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(() => getEditTalkTab(pathname));

  function handleTabChange(next: EditTalkTab) {
    if (next === tab) {
      return;
    }

    const status = searchParams.get('status');
    const href =
      next === 'study'
        ? buildTalkEditPath(talkId, 'study')
        : buildEntityEditPath(
            'talks',
            talkId,
            status === 'archived' ? { status: 'archived' } : undefined
          );

    setTab(next);
    window.history.replaceState(window.history.state, '', href);
  }

  return { handleTabChange, tab };
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
    handleSuccess,
    handleSubmit,
    isPending,
    pendingUpdate,
    setPendingUpdate,
  } = useEditTalkSheet({ closeHref, statusPrefill, talk });
  const { handleTabChange, tab } = useEditTalkTab(talk._id);

  return (
    <>
      <FormSheetShell
        header={
          <EditTalkTabs
            onValueChange={handleTabChange}
            studyStatus={studyStatus}
            value={tab}
          />
        }
        onOpenChange={handleOpenChange}
        open
        testId="edit-talk-drawer"
        title="Edit Talk"
      >
        {tab === 'content' ? (
          <form className="contents" onSubmit={handleSubmit}>
            <FormSheetBody
              footer={
                <>
                  <Button
                    disabled={isPending}
                    onClick={() => {
                      handleOpenChange(false);
                    }}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button loading={isPending} type="submit">
                    Save Changes
                  </Button>
                </>
              }
            >
              <FormError error={form.formState.errors.root} />
              <TalkFormFields
                collections={collections}
                control={form.control}
                mode="edit"
                setValue={form.setValue}
                speakers={speakers}
                topics={topics}
              />
            </FormSheetBody>
          </form>
        ) : (
          <EditTalkStudyPanel
            onClose={() => {
              handleOpenChange(false);
            }}
            onSaved={() => {
              handleSuccess();
              handleOpenChange(false);
            }}
            talkId={talk._id}
          />
        )}
      </FormSheetShell>
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
