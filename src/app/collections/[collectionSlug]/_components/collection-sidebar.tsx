import type { Speaker } from '@/features/speakers/types';

import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';

interface CollectionSidebarProps {
  speakers: Speaker[];
}

export function CollectionSidebar({ speakers }: CollectionSidebarProps) {
  if (speakers.length === 0) {
    return null;
  }

  return (
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
  );
}
