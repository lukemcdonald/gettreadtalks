'use client';

import type { TopicFormData } from '@/features/topics/schemas/topic-form';
import type { TopicId } from '@/features/topics/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { createTopicAction } from '@/features/topics/actions/create-topic';
import { TopicFormFields } from '@/features/topics/components/topic-form-fields';
import { topicFormSchema } from '@/features/topics/schemas/topic-form';
import { useCreateFormSheet } from '@/lib/forms/use-create-form-sheet';

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
  const form = useForm<TopicFormData>({
    defaultValues: {
      description: '',
      title: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(topicFormSchema),
  });

  const { handleSubmit, isPending } = useCreateFormSheet({
    form,
    onOpenChange,
    onSuccess: (data) => {
      toastManager.add({ title: 'Topic created', type: 'success' });
      onTopicCreated(data.topicId);
    },
    open,
    submit: createTopicAction,
  });

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
      <TopicFormFields control={form.control} />
    </FormSheet>
  );
}
