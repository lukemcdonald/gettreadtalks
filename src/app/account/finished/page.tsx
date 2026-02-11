import {
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Link,
  Separator,
} from '@/components/ui';
import { getUserFinishedTalks } from '@/features/users/queries/get-user-finished-talks';
import { UnfinishTalkButton } from './_components/unfinish-talk-button';

export default async function FinishedPage() {
  const { talks } = await getUserFinishedTalks();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-3xl text-card-foreground">Finished Talks</h1>
          {talks.length > 0 && (
            <span className="text-muted-foreground text-sm">{talks.length} talks</span>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-6 py-8">
        {talks.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No finished talks yet</EmptyTitle>
              <EmptyDescription>Mark talks as finished as you go!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="divide-y divide-border rounded-lg border">
            {talks.map((talk) => (
              <li className="flex items-center justify-between gap-4 px-4 py-3" key={talk._id}>
                <div className="min-w-0">
                  <Link
                    className="truncate font-medium text-card-foreground text-sm hover:text-primary"
                    href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
                  >
                    {talk.title}
                  </Link>
                  {talk.speaker && (
                    <p className="truncate text-muted-foreground text-sm">
                      {talk.speaker.firstName} {talk.speaker.lastName}
                    </p>
                  )}
                </div>
                <UnfinishTalkButton talkId={talk._id} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
