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
import { FinishedTalkRow } from './_components/finished-talk-row';

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
            <FinishedTalkRow
              href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
              key={talk._id}
              speaker={talk.speaker}
              talkId={talk._id}
              title={talk.title}
            />
          ))}
        </AccountTable>
      )}
    </Card>
  );
}
