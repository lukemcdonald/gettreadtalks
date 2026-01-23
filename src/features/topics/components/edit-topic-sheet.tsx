'use client';

import type { TopicFormData } from '@/features/topics/schemas/topic-form';
import type { Topic, TopicId } from '@/features/topics/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  TextField,
} from '@/components/ui';
import { updateTopicAction } from '@/features/topics/actions';
import { topicFormSchema } from '@/features/topics/schemas/topic-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface EditTopicSheetProps {
  onOpenChange: (open: boolean) => void;
  onTopicUpdated: (topicId: TopicId) => void;
  open: boolean;
  topic: Pick<Topic, '_id' | 'title'> | null;
}

export function EditTopicSheet({ onOpenChange, onTopicUpdated, open, topic }: EditTopicSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TopicFormData>({
    defaultValues: {
      title: topic?.title ?? '',
    },
    resolver: zodResolver(topicFormSchema),
  });

  useEffect(() => {
    if (open && topic) {
      form.reset({
        title: topic.title,
      });
      setError(null);
    }
  }, [form, open, topic]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!topic) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateTopicAction(data, topic._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to update topic. Please check the errors below.');
        return;
      }

      onTopicUpdated(topic._id);
      onOpenChange(false);
    });
  });

  if (!topic) {
    return null;
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Topic</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <TextField
                control={form.control}
                description="A short, descriptive name for this topic"
                label="Title"
                name="title"
                placeholder="Faith"
                required
              />
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
