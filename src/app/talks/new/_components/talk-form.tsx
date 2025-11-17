'use client';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { Collection, CollectionId } from '@/lib/features/collections/types';
import type { Speaker, SpeakerId } from '@/lib/features/speakers/types';
import type { TalkId } from '@/lib/features/talks';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { slugify } from '@/convex/lib/utils';
import { useArchiveTalk, useCreateTalk, useUpdateTalk } from '@/lib/features/talks/hooks';
import { CollectionSelectField } from './collection-select-field';
import { SpeakerSelectField } from './speaker-select-field';
import { StatusSelectField } from './status-select-field';

type TalkFormProps = {
  collections: Pick<Collection, '_id' | 'slug' | 'title'>[];
  initialData?: {
    collectionId?: CollectionId | null;
    collectionOrder?: number | null;
    description?: string | null;
    featured?: boolean | null;
    mediaUrl: string;
    scripture?: string | null;
    speakerId: SpeakerId;
    status?: StatusType | null;
    title: string;
  };
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>[];
  talkId?: TalkId;
  talkSlug?: string;
};

export function TalkForm({ collections, initialData, speakers, talkId, talkSlug }: TalkFormProps) {
  const router = useRouter();
  const createTalk = useCreateTalk();
  const updateTalk = useUpdateTalk();
  const archiveTalk = useArchiveTalk();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<StatusType>(initialData?.status || 'backlog');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const title = formData.get('title') as string;
    const speakerId = formData.get('speakerId') as SpeakerId;
    const mediaUrl = formData.get('mediaUrl') as string;
    const collectionId = formData.get('collectionId') as string;
    const collectionOrder = formData.get('collectionOrder') as string;
    const description = formData.get('description') as string;
    const scripture = formData.get('scripture') as string;
    const formStatus = formData.get('status') as StatusType;
    const featured = formData.get('featured') === 'on';

    const data = {
      collectionId: collectionId ? (collectionId as CollectionId) : undefined,
      collectionOrder: collectionOrder ? Number.parseInt(collectionOrder, 10) : undefined,
      description: description || undefined,
      featured,
      mediaUrl: mediaUrl.trim(),
      scripture: scripture || undefined,
      speakerId,
      status: formStatus,
      title: title.trim(),
    };

    try {
      if (talkId) {
        await updateTalk.mutate({ ...data, id: talkId });

        const newSlug = slugify(title);
        const slug = newSlug === slugify(initialData?.title) ? (talkSlug ?? newSlug) : newSlug;
        router.push(`/talks/${slug}`);
      } else {
        await createTalk.mutate(data);

        const slug = slugify(title);
        router.push(`/talks/${slug}`);
      }
    } catch (error) {
      console.error('Failed to save talk:', error);
    }
  };

  const handleArchiveToggle = async () => {
    if (!talkId) {
      return;
    }

    const isArchived = status === 'archived';
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmMessage = isArchived
      ? 'Are you sure you want to unarchive this talk?'
      : 'Are you sure you want to archive this talk?';

    // biome-ignore lint/suspicious/noAlert: confirm dialog
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      if (isArchived) {
        await updateTalk.mutate({ id: talkId, status: 'backlog' });
        setStatus('backlog');
      } else {
        await archiveTalk.mutate({ id: talkId });
        setStatus('archived');
      }
      router.push('/talks');
    } catch (error) {
      console.error(`Failed to ${action} talk:`, error);
      setIsDeleting(false);
    }
  };

  const isLoading = createTalk.isLoading || updateTalk.isLoading;

  const getSubmitButtonText = () => {
    if (isLoading) {
      return 'Saving...';
    }

    if (talkId) {
      return 'Update Talk';
    }

    return 'Create Talk';
  };

  const getArchiveButtonText = () => {
    if (isDeleting) {
      return status === 'archived' ? 'Unarchiving...' : 'Archiving...';
    }

    return status === 'archived' ? 'Unarchive Talk' : 'Archive Talk';
  };

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
          defaultValue={initialData?.status ?? 'backlog'}
          onChange={setStatus}
          value={status}
        />

        <div className="flex items-center gap-2">
          <Checkbox defaultChecked={initialData?.featured ?? false} id="featured" name="featured" />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button disabled={isLoading} type="submit">
          {getSubmitButtonText()}
        </Button>

        {talkId && (
          <Button
            disabled={isDeleting || isLoading}
            onClick={handleArchiveToggle}
            type="button"
            variant={status === 'archived' ? 'outline' : 'destructive'}
          >
            {getArchiveButtonText()}
          </Button>
        )}
      </div>
    </form>
  );
}
