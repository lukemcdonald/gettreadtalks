import { z } from 'zod';

export const collectionFormSchema = z.object({
  description: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type CollectionFormData = z.infer<typeof collectionFormSchema>;
