import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { TalkActionsMenu } from '@/app/account/talks/_components/talk-actions-menu';
import { StatusWithDetails } from '@/components/content-table';
import {
  Empty,
  EmptyDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { TalkTitleCell } from './talk-title-cell';

type AdminTalksTableProps = {
  talks: TalkWithSpeakerAndTopics[];
};

export function AdminTalksTable({ talks }: AdminTalksTableProps) {
  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <span className="sr-only">Status</span>
            </TableHead>
            <TableHead>
              <span className="sr-only">Content</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talks.map((talk) => {
            const talkUrl = talk.speaker
              ? `/talks/${talk.speaker.slug}/${talk.slug}`
              : `/talks/${talk.slug}`;

            return (
              <TableRow key={talk._id}>
                <TableCell className="w-[40px]">
                  <StatusWithDetails content={talk} status={talk.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between gap-4">
                    <TalkTitleCell talk={talk} talkUrl={talkUrl} />
                    <TalkActionsMenu talk={talk} talkUrl={talkUrl} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
