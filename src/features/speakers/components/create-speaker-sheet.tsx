'use client';

import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { createSpeakerAction } from '@/features/speakers/actions';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const createSpeakerSchema = z.object({
  description: z.string().optional(),
  firstName: z.string().trim().min(1, 'First name is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  lastName: z.string().trim().min(1, 'Last name is required'),
  ministry: z.string().optional(),
  role: z.string().optional(),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CreateSpeakerFormData = z.infer<typeof createSpeakerSchema>;

type NewSpeaker = Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;

interface CreateSpeakerSheetProps {
  onOpenChange: (open: boolean) => void;
  onSpeakerCreated: (speakerId: SpeakerId, speaker: NewSpeaker) => void;
  open: boolean;
}

export function CreateSpeakerSheet({
  onOpenChange,
  onSpeakerCreated,
  open,
}: CreateSpeakerSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateSpeakerFormData>({
    defaultValues: {
      description: '',
      firstName: '',
      imageUrl: '',
      lastName: '',
      ministry: '',
      role: '',
      websiteUrl: '',
    },
    resolver: zodResolver(createSpeakerSchema),
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      form.clearErrors();
      setError(null);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await createSpeakerAction(data);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to create speaker. Please check the errors below.');
        return;
      }

      const newSpeaker: NewSpeaker = {
        _id: result.data.speakerId,
        firstName: data.firstName,
        imageUrl: data.imageUrl || undefined,
        lastName: data.lastName,
        role: data.role || undefined,
      };

      onSpeakerCreated(result.data.speakerId, newSpeaker);
      onOpenChange(false);
    });
  });

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Add New Speaker</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit}>
          <SheetPanel>
            {!!error && (
              <div className="mb-4 rounded-md bg-destructive/15 p-3 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <TextField
                control={form.control}
                description="e.g., Pastor, Author, Evangelist"
                label="Role"
                name="role"
                placeholder="Pastor"
              />

              <TextField
                control={form.control}
                description="Church or organization affiliation"
                label="Ministry"
                name="ministry"
                placeholder="Grace Community Church"
              />

              <TextareaField
                control={form.control}
                label="Description"
                name="description"
                placeholder="Brief biography..."
                rows={3}
              />

              <UrlField
                control={form.control}
                label="Profile Image URL"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
              />

              <UrlField
                control={form.control}
                label="Website URL"
                name="websiteUrl"
                placeholder="https://example.com"
              />
            </div>
          </SheetPanel>

          <SheetFooter>
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
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
