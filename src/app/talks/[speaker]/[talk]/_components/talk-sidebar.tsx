import type { Clip } from '@/features/clips/types';
import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { Topic } from '@/features/topics/types';
import type { User } from '@/services/auth/types';

import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { Button } from '@/components/ui';
import { FavoriteTalkButton } from '@/features/users/components';
import { EditTalkLink } from '@/lib/sheets';
import { isAdmin } from '@/services/auth/utils';

interface TalkSidebarProps {
  talk: Talk;
  speaker?: Speaker | null;
  collection?: Collection | null;
  clips?: Clip[];
  topics?: Topic[];
  user: User;
}

export function TalkSidebar({ clips, collection, speaker, talk, topics, user }: TalkSidebarProps) {
  const userIsAdmin = isAdmin(user);

  return (
    <>
      <SidebarContent title="Actions">
        <div className="flex flex-col gap-2">
          {!!userIsAdmin && (
            <Button render={<EditTalkLink talkId={talk._id} />} variant="outline">
              Edit
            </Button>
          )}
          <FavoriteTalkButton talkId={talk._id} />
        </div>
      </SidebarContent>

      {!!speaker && (
        <SidebarContent title="Speaker">
          <div className="space-y-2">
            <p className="font-semibold">
              {speaker.firstName} {speaker.lastName}
            </p>
            {!!speaker.role && <p className="text-muted-foreground text-sm">{speaker.role}</p>}
            {!!speaker.ministry && (
              <p className="text-muted-foreground text-sm">{speaker.ministry}</p>
            )}
            {!!speaker.description && (
              <p className="text-muted-foreground text-sm">{speaker.description}</p>
            )}
            <Link
              className="text-primary text-sm hover:underline"
              href={`/speakers/${speaker.slug}`}
            >
              View all talks →
            </Link>
          </div>
        </SidebarContent>
      )}

      {topics && topics.length > 0 && (
        <SidebarContent title="Topics">
          <ul className="space-y-1">
            {topics.map((topic) => (
              <li key={topic._id}>
                <Link
                  className="text-muted-foreground text-sm transition-colors hover:text-foreground"
                  href={`/topics/${topic.slug}`}
                >
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </SidebarContent>
      )}

      {!!collection && (
        <SidebarContent title="Collection">
          <div className="space-y-2">
            <p className="font-semibold">{collection.title}</p>
            {!!collection.description && (
              <p className="text-muted-foreground text-sm">{collection.description}</p>
            )}
            <Link
              className="text-primary text-sm hover:underline"
              href={`/collections/${collection.slug}`}
            >
              View collection →
            </Link>
          </div>
        </SidebarContent>
      )}

      {clips && clips.length > 0 && (
        <SidebarContent title="Clips">
          <ul className="space-y-1">
            {clips.map((clip) => (
              <li key={clip._id}>
                <Link href={`/clips/${clip.slug}`}>{clip.title}</Link>
              </li>
            ))}
          </ul>
        </SidebarContent>
      )}

      <SidebarContent title="Details">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Status:</span>{' '}
            <span className="text-muted-foreground capitalize">{talk.status}</span>
          </div>
          {!!talk.publishedAt && (
            <div>
              <span className="font-semibold">Published:</span>{' '}
              <span className="text-muted-foreground">
                {new Date(talk.publishedAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {!!talk.featured && (
            <div>
              <span className="font-semibold text-primary">Featured Talk</span>
            </div>
          )}
        </div>
      </SidebarContent>
    </>
  );
}
