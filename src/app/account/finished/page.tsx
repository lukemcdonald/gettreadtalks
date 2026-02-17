import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Separator,
} from '@/components/ui';
import { getUserFinishedTalks } from '@/features/users/queries/get-user-finished-talks';
import { AccountTable } from '../_components/account-table';
import { TalkTableRow } from '../_components/talk-table-row';
import { UnfinishTalkButton } from './_components/unfinish-talk-button';

export default async function FinishedPage() {
  const { talks } = await getUserFinishedTalks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finished Talks</CardTitle>
        {talks.length > 0 && <CardDescription>{talks.length} talks</CardDescription>}
      </CardHeader>

      <Separator />

      {talks.length === 0 ? (
        <div className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No finished talks yet</EmptyTitle>
              <EmptyDescription>Mark talks as finished as you go!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <AccountTable label="Talk">
          {talks.map((talk) => (
            <TalkTableRow
              action={<UnfinishTalkButton talkId={talk._id} />}
              href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
              key={talk._id}
              speaker={talk.speaker}
              title={talk.title}
            />
          ))}
        </AccountTable>
      )}
    </Card>
  );
}
