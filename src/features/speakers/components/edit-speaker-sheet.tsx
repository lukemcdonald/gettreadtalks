'use client';

import type { UpdateSpeakerFormData } from '@/features/speakers/schemas/speaker-form';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { useEffect, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  FeaturedField,
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
import { updateSpeakerAction } from '@/features/speakers/actions';
import { updateSpeakerSchema } from '@/features/speakers/schemas/speaker-form';
import { setServerErrors } from '@/lib/forms/react-hook-form';

const roleOptions = [
  { label: 'Select a role', value: '' },
  ...speakerRoles.map((role) => ({ label: role, value: role })),
];

interface EditSpeakerSheetProps {
  onOpenChange: (open: boolean) => void;
  onSpeakerUpdated: (speakerId: SpeakerId) => void;
  open: boolean;
  speaker: Speaker | null;
}

export function EditSpeakerSheet({
  onOpenChange,
  onSpeakerUpdated,
  open,
  speaker,
}: EditSpeakerSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateSpeakerFormData>({
    defaultValues: {
      description: speaker?.description ?? '',
      featured: speaker?.featured ?? false,
      firstName: speaker?.firstName ?? '',
      imageUrl: speaker?.imageUrl ?? '',
      lastName: speaker?.lastName ?? '',
      ministry: speaker?.ministry ?? '',
      role: speaker?.role ?? '',
      websiteUrl: speaker?.websiteUrl ?? '',
    },
    resolver: zodResolver(updateSpeakerSchema),
  });

  useEffect(() => {
    if (open && speaker) {
      form.reset({
        description: speaker.description ?? '',
        featured: speaker.featured ?? false,
        firstName: speaker.firstName,
        imageUrl: speaker.imageUrl ?? '',
        lastName: speaker.lastName,
        ministry: speaker.ministry ?? '',
        role: speaker.role ?? '',
        websiteUrl: speaker.websiteUrl ?? '',
      });
      setError(null);
    }
  }, [form, open, speaker]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!speaker) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await updateSpeakerAction(data, speaker._id);

      if (!result.success) {
        setServerErrors(form.setError, result.errors);
        setError('Failed to update speaker. Please check the errors below.');
        return;
      }

      onSpeakerUpdated(speaker._id);
      onOpenChange(false);
    });
  });

  if (!speaker) {
    return null;
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetPopup side="right">
        <SheetHeader>
          <SheetTitle>Edit Speaker</SheetTitle>
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

              <FeaturedField control={form.control} name="featured" />
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetPopup>
    </Sheet>
  );
}
