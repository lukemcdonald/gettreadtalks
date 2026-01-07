import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { StarIcon } from 'lucide-react';
import Link from 'next/link';

import { TalkActionsMenu } from '@/app/account/talks/_components/talk-actions-menu';
import {
  Badge,
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { getSpeakerName } from '@/features/speakers';
import { cn } from '@/utils';

type AdminTalksTableProps = {
  talks: TalkWithSpeakerAndTopics[];
};

function getStatusVariant(status: string) {
  switch (status) {
    case 'published':
      return 'success';
    case 'approved':
      return 'info';
    case 'backlog':
      return 'warning';
    case 'archived':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function formatDate(timestamp?: number) {
  if (!timestamp) {
    return 'N/A';
  }
  return new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AdminTalksTable({ talks }: AdminTalksTableProps) {
  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Title & Speaker</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talks.map((talk) => {
            const talkUrl = talk.speaker
              ? `/talks/${talk.speaker.slug}/${talk.slug}`
              : `/talks/${talk.slug}`;

            return (
              <TableRow key={talk._id}>
                <TableCell className="font-medium">
                  <div className="flex items-start gap-2">
                    {!!talk.featured && (
                      <StarIcon className="mt-0.5 size-4 shrink-0 fill-yellow-400 text-yellow-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        className="block truncate hover:underline"
                        href={talkUrl}
                        title={talk.title}
                      >
                        {talk.title}
                      </Link>
                      {!!talk.speaker && (
                        <p className="text-muted-foreground text-sm">
                          by {getSpeakerName(talk.speaker)}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge size="sm" variant={getStatusVariant(talk.status)}>
                    {talk.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDate(talk.publishedAt)}</TableCell>
                <TableCell className="text-right">
                  <TalkActionsMenu talk={talk} talkUrl={talkUrl} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
