'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { TalkId, TalkListItem } from '@/features/talks/types';
import type { StatusType } from '@/lib/entities/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { zid } from 'convex-helpers/server/zod4';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Field,
  FieldLabel,
  FormError,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { updateClipAction } from '@/features/clips/actions/update-clip';
import { getSpeakerName } from '@/features/speakers/utils';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const updateClipSchema = z.object({
  description: z.string().optional(),
  mediaUrl: z.string().trim().url('Please enter a valid URL'),
  speakerId: zid('speakers').optional(),
  status: z.enum(['approved', 'archived', 'backlog', 'published']).default('backlog'),
  talkId: zid('talks').optional(),
  title: z.string().trim().min(1, 'Title is required'),
});

type UpdateClipFormData = z.infer<typeof updateClipSchema>;

interface ClipData {
  _id: ClipId;
  description?: string;
  mediaUrl: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  talkId?: TalkId;
  title: string;
}

interface EditClipSheetProps {
  clip: ClipData | null;
  onClipUpdated: (clipId: ClipId) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

// TODO: Simplify and DRY this up with create-clip-sheet where possible. This file is too big.

export function EditClipSheet({
  clip,
  onClipUpdated,
  onOpenChange,
  open,
  speakers,
  talks,
}: EditClipSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateClipFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for Zod 4 compatibility with zodResolver
    resolver: zodResolver(updateClipSchema as any),
    mode: 'onBlur',
    defaultValues: {
      description: clip?.description ?? '',
      mediaUrl: clip?.mediaUrl ?? '',
      speakerId: clip?.speakerId,
      status: clip?.status ?? 'backlog',
      talkId: clip?.talkId,
      title: clip?.title ?? '',
    },
  });

  useEffect(() => {
    if (open && clip) {
      form.reset({
        description: clip.description ?? '',
        mediaUrl: clip.mediaUrl,
        speakerId: clip.speakerId,
        status: clip.status ?? 'backlog',
        talkId: clip.talkId,
        title: clip.title,
      });
      setError(null);
    }
  }, [form, open, clip]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!clip) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateClipAction(data, clip._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to update clip. Please check the errors below.');
        return;
      }

      onClipUpdated(clip._id);
      onOpenChange(false);
    });
  });

  const sortedSpeakers = [...speakers].sort((a, b) => {
    const nameA = getSpeakerName(a).toLowerCase();
    const nameB = getSpeakerName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const sortedTalks = [...talks].sort((a, b) => a.title.localeCompare(b.title));

  if (!clip) {
    return null;
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Clip</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <FormError error={form.formState.errors.root} />

            <div className="space-y-4">
              <TextField
                control={form.control}
                label="Title"
                name="title"
                placeholder="Grace in Action"
                required
              />

              <UrlField
                control={form.control}
                label="Media URL"
                name="mediaUrl"
                placeholder="https://example.com/clip.mp4"
                required
              />

              <TextareaField
                control={form.control}
                description="Brief description of this clip"
                label="Description"
                name="description"
                placeholder="A powerful moment from..."
                rows={3}
              />

              <Controller
                control={form.control}
                name="speakerId"
                render={({ field }) => (
                  <Field name="speakerId">
                    <FieldLabel htmlFor="speakerId">Speaker (Optional)</FieldLabel>
                    <Select
                      items={[
                        { label: 'None', value: '' },
                        ...sortedSpeakers.map((s) => ({
                          label: getSpeakerName(s),
                          value: s._id,
                        })),
                      ]}
                      name="speakerId"
                      onValueChange={(v) => field.onChange(v === '' ? undefined : (v as SpeakerId))}
                      value={field.value || ''}
                    >
                      <SelectTrigger id="speakerId">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        <SelectItem value="">None</SelectItem>
                        {sortedSpeakers.map((speaker) => (
                          <SelectItem key={speaker._id} value={speaker._id}>
                            {getSpeakerName(speaker)}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="talkId"
                render={({ field }) => (
                  <Field name="talkId">
                    <FieldLabel htmlFor="talkId">From Talk (Optional)</FieldLabel>
                    <Select
                      items={[
                        { label: 'None', value: '' },
                        ...sortedTalks.map((t) => ({
                          label: t.title,
                          value: t._id,
                        })),
                      ]}
                      name="talkId"
                      onValueChange={(v) => field.onChange(v === '' ? undefined : (v as TalkId))}
                      value={field.value || ''}
                    >
                      <SelectTrigger id="talkId">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectPopup>
                        <SelectItem value="">None</SelectItem>
                        {sortedTalks.map((talk) => (
                          <SelectItem key={talk._id} value={talk._id}>
                            {talk.title}
                          </SelectItem>
                        ))}
                      </SelectPopup>
                    </Select>
                  </Field>
                )}
              />

              <StatusField control={form.control} name="status" />
            </div>
          </SheetPanel>

          <SheetFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
