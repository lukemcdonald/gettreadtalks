import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import Image from 'next/image';
import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { getSpeakerName } from '@/features/speakers';

type SpeakerLeftSidebarProps = {
  clips: Clip[];
  collections: Collection[];
  speaker: Speaker;
  talks: Talk[];
};

export function SpeakerLeftSidebar({
  clips,
  collections,
  speaker,
  talks,
}: SpeakerLeftSidebarProps) {
  return (
    <>
      {speaker.imageUrl && (
        <SidebarContent>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              alt={getSpeakerName(speaker)}
              className="object-cover"
              fill
              src={speaker.imageUrl}
            />
          </div>
        </SidebarContent>
      )}

      <SidebarContent title="About">
        <dl>
          {speaker.role && (
            <>
              <dt className="font-semibold">Role:</dt>
              <dd>{speaker.role}</dd>
            </>
          )}
          {speaker.ministry && (
            <>
              <dt className="font-semibold">Ministry:</dt>
              <dd>{speaker.ministry}</dd>
            </>
          )}
        </dl>
      </SidebarContent>

      <SidebarContent title="Content">
        <nav className="flex flex-col gap-2">
          <Link href={`/speakers/${speaker.slug}#talks`}>
            {talks.length} {talks.length === 1 ? 'Talk' : 'Talks'} →
          </Link>
          {collections.length > 0 && (
            <Link href={`/speakers/${speaker.slug}#collections`}>
              {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'} →
            </Link>
          )}
          {clips.length > 0 && (
            <Link href={`/speakers/${speaker.slug}#clips`}>
              {clips.length} {clips.length === 1 ? 'Clip' : 'Clips'} →
            </Link>
          )}
        </nav>
      </SidebarContent>
    </>
  );
}
