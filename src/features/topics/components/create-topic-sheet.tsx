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
import { createTopicAction } from '@/features/topics/actions/create-topic';
import { topicFormSchema } from '@/features/topics/schemas/topic-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

type NewTopic = Pick<Topic, '_id' | 'title' | 'slug'>;

interface CreateTopicSheetProps {
  onOpenChange: (open: boolean) => void;
  onTopicCreated: (topicId: TopicId, topic: NewTopic) => void;
  open: boolean;
}

export function CreateTopicSheet({ onOpenChange, onTopicCreated, open }: CreateTopicSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TopicFormData>({
    defaultValues: {
      title: '',
    },
    resolver: zodResolver(topicFormSchema),
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      form.clearErrors();
      setError(null);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await createTopicAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to create topic. Please check the errors below.');
        return;
      }

      const newTopic: NewTopic = {
        _id: result.data.topicId,
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      };

      onTopicCreated(result.data.topicId, newTopic);
      onOpenChange(false);
    });
  });

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Add New Topic</SheetTitle>
        </SheetHeader>

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
          <SheetPanel>
            {error ? (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            ) : null}

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
              {isPending ? 'Creating...' : 'Create Topic'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
