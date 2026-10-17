'use client';

import type { TopicFormData } from '@/features/topics/schemas/topic-form';
import type { TopicId } from '@/features/topics/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { createTopicAction } from '@/features/topics/actions/create-topic';
import { topicFormSchema } from '@/features/topics/schemas/topic-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

interface CreateTopicSheetProps {
  onOpenChange: (open: boolean) => void;
  onTopicCreated: (topicId: TopicId) => void;
  open: boolean;
}

export function CreateTopicSheet({
  onOpenChange,
  onTopicCreated,
  open,
}: CreateTopicSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TopicFormData>({
    defaultValues: {
      title: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(topicFormSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createTopicAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      toastManager.add({ title: 'Topic created', type: 'success' });
      onTopicCreated(result.data.topicId);
      onOpenChange(false);
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      open={open}
      submitLabel="Create Topic"
      title="Add New Topic"
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
