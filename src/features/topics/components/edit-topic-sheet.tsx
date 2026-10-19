'use client';

import type { TopicFormData } from '../schemas/topic-form';
import type { Topic, TopicId } from '@/features/topics/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { FormSheet } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateTopicAction } from '@/features/topics/actions/update-topic';
import { setServerErrors } from '@/lib/forms/react-hook-form';

import { topicFormSchema } from '../schemas/topic-form';
import { TopicFormFields } from './topic-form-fields';

interface EditTopicSheetProps {
  onOpenChange: (open: boolean) => void;
  onTopicUpdated: (topicId: TopicId) => void;
  open: boolean;
  topic: Pick<Topic, '_id' | 'description' | 'title'>;
}

export function EditTopicSheet({
  onOpenChange,
  onTopicUpdated,
  open,
  topic,
}: EditTopicSheetProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TopicFormData>({
    mode: 'onBlur',
    resolver: zodResolver(topicFormSchema),
    values: {
      description: topic.description ?? '',
      title: topic.title,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateTopicAction(data, topic._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        return;
      }

      toastManager.add({ title: 'Topic updated', type: 'success' });
      onTopicUpdated(topic._id);
      onOpenChange(false);
    });
  });

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
      <TopicFormFields control={form.control} />
    </FormSheet>
  );
}
