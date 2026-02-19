'use client';

import type { TopicFormData } from '@/features/topics/schemas/topic-form';
import type { Topic, TopicId } from '@/features/topics/types';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet, TextField } from '@/components/ui';
import { updateTopicAction } from '@/features/topics/actions/update-topic';
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

  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicFormSchema),
    mode: 'onBlur',
    values: {
      title: topic?.title ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!topic) {
      return;
    }

    startTransition(async () => {
      const result = await updateTopicAction(data, topic._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
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
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Save Changes"
      title="Edit Topic"
    >
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
    </FormSheet>
  );
}
