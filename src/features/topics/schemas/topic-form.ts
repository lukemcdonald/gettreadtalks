import { z } from 'zod';

export const topicFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export type TopicFormData = z.infer<typeof topicFormSchema>;
