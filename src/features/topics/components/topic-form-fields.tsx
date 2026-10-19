import type { TopicFormData } from '../schemas/topic-form';
import type { Control } from 'react-hook-form';

import { TextField, TextareaField } from '@/components/ui';

interface TopicFormFieldsProps {
  control: Control<TopicFormData>;
}

export function TopicFormFields({ control }: TopicFormFieldsProps) {
  return (
    <div className="space-y-4">
      <TextField
        control={control}
        description="A short, descriptive name for this topic"
        label="Title"
        name="title"
        placeholder="Faith"
        required
      />

      <TextareaField
        control={control}
        description="Brief description of this topic"
        label="Description"
        name="description"
        placeholder="Talks on living by faith rather than sight..."
        rows={3}
      />
    </div>
  );
}
