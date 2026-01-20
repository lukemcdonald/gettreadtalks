import type { CollectionData } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { SidebarContent } from '@/components/sidebar-content';

interface CollectionSidebarProps {
  collection: CollectionData['collection'];
  speakers: Speaker[];
}

export function CollectionSidebar({ collection, speakers }: CollectionSidebarProps) {
  return (
    <>
      <PageHeader description={collection.description} title={collection.title} />

      {speakers.length > 0 && (
        <SidebarContent title="Speakers">
          <ul className="space-y-1">
            {speakers.map((speaker) => (
              <li key={speaker._id}>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={`/speakers/${speaker.slug}`}
                >
                  {speaker.firstName} {speaker.lastName}
                </Link>
              </li>
            ))}
          </ul>
        </SidebarContent>
      )}
    </>
  );
}
