import type { StatusType } from '@/lib/entities/types';

import { AdminTalksClient } from '@/app/account/talks/_components/admin-talks-client';
import { AdminTalksContent } from '@/app/account/talks/_components/talks-content';
import { PageHeader } from '@/components/page-header';
import { getAllCollections } from '@/features/collections/queries';
import { getAllSpeakers } from '@/features/speakers/queries';

export interface AdminTalksSearchParams {
  cursor?: string;
  search?: string;
  status?: StatusType | 'all';
}

interface AdminTalksPageProps {
  searchParams: Promise<AdminTalksSearchParams>;
}

export default async function AdminTalksPage({ searchParams }: AdminTalksPageProps) {
  const params = await searchParams;

  const [speakersResult, collectionsResult] = await Promise.all([
    getAllSpeakers(),
    getAllCollections(),
  ]);

  const speakers = speakersResult.speakers.map((s) => ({
    _id: s._id,
    firstName: s.firstName,
    imageUrl: s.imageUrl,
    lastName: s.lastName,
    role: s.role,
  }));

  const collections = collectionsResult.collections.map((c) => ({
    _id: c.collection._id,
    slug: c.collection.slug,
    title: c.collection.title,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all talks across all statuses" title="Manage Talks" />
        <AdminTalksClient collections={collections} speakers={speakers} />
      </div>
      <AdminTalksContent searchParams={params} />
    </div>
  );
}
