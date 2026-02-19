'use client';

import type { TopicFormData } from '@/features/topics/schemas/topic-form';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { FormSheet, TextField } from '@/components/ui';
import { createTopicAction } from '@/features/topics/actions/create-topic';
import { topicFormSchema } from '@/features/topics/schemas/topic-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

export function CreateTopicSheet() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();
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

      handleSuccess();
    });
  });

  return (
    <FormSheet
      error={form.formState.errors.root}
      isPending={isPending}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      open
      pendingLabel="Creating..."
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
