import { z } from 'zod';

export const passwordFormSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(8, 'Must be at least eight characters long.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordFormSchema>;
