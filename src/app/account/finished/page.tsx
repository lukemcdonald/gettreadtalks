import { PageHeader } from '@/components/page-header';
import {
  Card,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui';
import { getUserFinishedTalks } from '@/features/users/queries/get-user-finished-talks';

import { AccountTable } from '../_components/account-table';
import { FinishedTalkRow } from './_components/finished-talk-row';

export default async function FinishedPage() {
  const { talks } = await getUserFinishedTalks();

  return (
    <>
      <PageHeader
        description="Talks you've marked as finished."
        title="Finished"
      />
      <Card>
        {talks.length === 0 ? (
          <div className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No finished talks yet</EmptyTitle>
                <EmptyDescription>
                  Mark talks as finished as you go!
                </EmptyDescription>
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
    </>
  );
}
