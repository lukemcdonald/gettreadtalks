'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  FieldRequired,
  Input,
  TextField,
} from '@/components/ui';
import { createSpeakerAction } from '@/features/speakers/actions';

const createSpeakerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

type CreateSpeakerFormData = z.infer<typeof createSpeakerSchema>;

type CreateSpeakerDialogProps = {
  onSpeakerCreated: (speakerId: SpeakerId) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateSpeakerDialog({
  onSpeakerCreated,
  onOpenChange,
  open,
}: CreateSpeakerDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateSpeakerFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(createSpeakerSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await createSpeakerAction(data);

      if (!result.success) {
        // Map errors to form errors
        Object.entries(result.errors).forEach(([field, message]) => {
          form.setError(field as keyof CreateSpeakerFormData, {
            message,
            type: 'server',
          });
        });
        setError('Failed to create speaker. Please check the errors below.');
        return;
      }

      // Success - close dialog, reset form, and notify parent
      form.reset();
      onOpenChange(false);
      onSpeakerCreated(result.data.speakerId);
    });
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Add New Speaker</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogPanel>
            {error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <TextField
                control={form.control}
                label="First Name"
                name="firstName"
                placeholder="John"
                required
              />

              <TextField
                control={form.control}
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                required
              />
            </div>
          </DialogPanel>

          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? 'Creating...' : 'Create Speaker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
