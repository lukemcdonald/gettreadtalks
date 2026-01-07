'use client';

import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import {
  ArchiveIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';

type TalkActionsMenuProps = {
  talk: TalkWithSpeakerAndTopics;
  talkUrl: string;
};

export function TalkActionsMenu({ talk, talkUrl }: TalkActionsMenuProps) {
  const router = useRouter();
  const editUrl = `${talkUrl}/edit`;

  const handleEdit = () => {
    router.push(editUrl);
  };

  const handleView = () => {
    router.push(talkUrl);
  };

  const handleArchive = () => {
    // TODO: Implement archive mutation
    console.log('Archive talk:', talk._id);
  };

  const handleDelete = () => {
    // TODO: Implement delete mutation with confirmation
    console.log('Delete talk:', talk._id);
  };

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={handleEdit} size="sm" variant="outline">
        <PencilIcon className="size-4" />
        Edit
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          <MoreVerticalIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <ExternalLinkIcon className="mr-2 size-4" />
            View Talk
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <PencilIcon className="mr-2 size-4" />
            Edit Talk
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive}>
            <ArchiveIcon className="mr-2 size-4" />
            {talk.status === 'archived' ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            <TrashIcon className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
