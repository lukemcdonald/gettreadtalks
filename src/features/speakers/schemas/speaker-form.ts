import { z } from 'zod';

import { speakerRoles } from '@/convex/model/speakers/validators';

const baseSpeakerSchema = z.object({
  description: z.string().optional(),
  firstName: z.string().trim().min(1, 'First name is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  lastName: z.string().trim().min(1, 'Last name is required'),
  ministry: z.string().optional(),
  role: z.enum(speakerRoles).or(z.literal('')).optional(),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const createSpeakerSchema = baseSpeakerSchema;

export const updateSpeakerSchema = baseSpeakerSchema.extend({
  featured: z.boolean().optional(),
});

export type CreateSpeakerFormData = z.infer<typeof createSpeakerSchema>;
export type UpdateSpeakerFormData = z.infer<typeof updateSpeakerSchema>;
