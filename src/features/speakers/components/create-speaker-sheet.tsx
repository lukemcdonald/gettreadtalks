'use client';

import type { CreateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  SelectField,
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
import { speakerRoles } from '@/convex/model/speakers/validators';
import { createSpeakerAction } from '@/features/speakers/actions/create-speaker';
import { createSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const roleOptions = [
  { label: 'Select a role', value: '' },
  ...speakerRoles.map((role) => ({ label: role, value: role })),
];

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

        <form className="grid min-h-0 flex-1 grid-rows-[1fr_auto]" onSubmit={handleSubmit}>
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

              <SelectField control={form.control} label="Role" name="role" options={roleOptions} />

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
