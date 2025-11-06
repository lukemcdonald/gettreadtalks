'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useArchiveTalk, useCreateTalk, useUpdateTalk } from '@/lib/features/talks';

import { CollectionSelectField } from './collection-select-field';
import { SpeakerSelectField } from './speaker-select-field';
import { StatusSelectField } from './status-select-field';

interface TalkFormProps {
  collections: Array<{ _id: Id<'collections'>; slug: string; title: string }>;
  initialData?: {
    collectionId?: Id<'collections'> | null;
    collectionOrder?: number | null;
    description?: string | null;
    featured?: boolean | null;
    mediaUrl: string;
    scripture?: string | null;
    speakerId: Id<'speakers'>;
    status?: 'backlog' | 'published' | 'archived' | null;
    title: string;
  };
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string; slug: string }>;
  talkId?: Id<'talks'>;
  talkSlug?: string;
}

export function TalkForm({ collections, initialData, speakers, talkId, talkSlug }: TalkFormProps) {
  const router = useRouter();
  const createTalk = useCreateTalk();
  const updateTalk = useUpdateTalk();
  const archiveTalk = useArchiveTalk();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Extract form values
    const title = formData.get('title') as string;
    const speakerId = formData.get('speakerId') as Id<'speakers'>;
    const mediaUrl = formData.get('mediaUrl') as string;
    const collectionId = formData.get('collectionId') as string;
    const collectionOrder = formData.get('collectionOrder') as string;
    const description = formData.get('description') as string;
    const scripture = formData.get('scripture') as string;
    const status = formData.get('status') as 'backlog' | 'published' | 'archived';
    const featured = formData.get('featured') === 'on';

    // Build mutation data
    const data = {
      collectionId: collectionId ? (collectionId as Id<'collections'>) : undefined,
      collectionOrder: collectionOrder ? Number.parseInt(collectionOrder, 10) : undefined,
      description: description || undefined,
      featured,
      mediaUrl: mediaUrl.trim(),
      scripture: scripture || undefined,
      speakerId,
      status,
      title: title.trim(),
    };

    try {
      if (talkId) {
        await updateTalk.mutate({ ...data, id: talkId });

        // For edit, use the updated title to generate slug (or existing slug if title unchanged)
        const newSlug = normalizeSlug(title);
        const slug = newSlug === normalizeSlug(initialData?.title ?? '') ? talkSlug : newSlug;
        router.push(`/talks/${slug || newSlug}`);
      } else {
        await createTalk.mutate(data);

        // Generate slug from title for redirect
        const slug = normalizeSlug(title);
        router.push(`/talks/${slug}`);
      }
    } catch (error) {
      console.error('Failed to save talk:', error);
    }
  };

  const handleDelete = async () => {
    if (!talkId) {
      return;
    }

    if (!confirm('Are you sure you want to archive this talk?')) {
      return;
    }

    setIsDeleting(true);

    try {
      await archiveTalk.mutate({ id: talkId });
      router.push('/talks');
    } catch (error) {
      console.error('Failed to archive talk:', error);
      setIsDeleting(false);
    }
  };

  const normalizeSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const isLoading = createTalk.isLoading || updateTalk.isLoading;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input defaultValue={initialData?.title} id="title" name="title" required type="text" />
        </div>

        <SpeakerSelectField
          defaultValue={initialData?.speakerId}
          error={errors.speakerId}
          speakers={speakers}
        />

        <div>
          <Label htmlFor="mediaUrl">
            Media URL <span className="text-destructive">*</span>
          </Label>
          <Input
            defaultValue={initialData?.mediaUrl}
            id="mediaUrl"
            name="mediaUrl"
            required
            type="url"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            defaultValue={initialData?.description ?? ''}
            id="description"
            name="description"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="scripture">Scripture</Label>
          <Input
            defaultValue={initialData?.scripture ?? ''}
            id="scripture"
            name="scripture"
            type="text"
          />
        </div>

        <CollectionSelectField collections={collections} defaultValue={initialData?.collectionId} />

        <div>
          <Label htmlFor="collectionOrder">Collection Order</Label>
          <Input
            defaultValue={initialData?.collectionOrder ?? undefined}
            id="collectionOrder"
            name="collectionOrder"
            type="number"
          />
        </div>

        <StatusSelectField
          defaultValue={(initialData?.status as 'backlog' | 'published' | 'archived') ?? 'backlog'}
        />

        <div className="flex items-center gap-2">
          <Checkbox defaultChecked={initialData?.featured ?? false} id="featured" name="featured" />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Saving...' : talkId ? 'Update Talk' : 'Create Talk'}
        </Button>

        {talkId && (
          <Button
            disabled={isDeleting || isLoading}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            {isDeleting ? 'Archiving...' : 'Archive Talk'}
          </Button>
        )}
      </div>
    </form>
  );
}
