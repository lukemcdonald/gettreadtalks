import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Link,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { getUserFinishedTalks } from '@/features/users/queries/get-user-finished-talks';
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

      <div className="p-6">
        {talks.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No finished talks yet</EmptyTitle>
              <EmptyDescription>Mark talks as finished as you go!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <span className="sr-only">Talk</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talks.map((talk) => (
                  <TableRow key={talk._id}>
                    <TableCell>
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <Link
                            className="line-clamp-2 block hover:underline"
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}
