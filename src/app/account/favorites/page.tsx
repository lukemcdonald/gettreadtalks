import {
  Badge,
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
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';
import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
  UnfavoriteTalkButton,
} from './_components/unfavorite-buttons';

export default async function FavoritesPage() {
  const favorites = await getUserFavorites();

  const talks = favorites?.talks ?? [];
  const speakers = favorites?.speakers ?? [];
  const clips = favorites?.clips ?? [];
  const total = talks.length + speakers.length + clips.length;

  const defaultTab = talks.length > 0 ? 'talks' : speakers.length > 0 ? 'speakers' : 'clips';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorites</CardTitle>
        {total > 0 && (
          <CardDescription>
            {talks.length} talks · {speakers.length} speakers · {clips.length} clips
          </CardDescription>
        )}
      </CardHeader>

      <Separator />

      {total === 0 ? (
        <div className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No favorites yet</EmptyTitle>
              <EmptyDescription>Start exploring to build your collection!</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <Tabs defaultValue={defaultTab}>
          <div className="border-b px-6">
            <TabsList variant="underline">
              {talks.length > 0 && (
                <TabsTab value="talks">
                  Talks
                  <Badge className="not-in-data-active:text-muted-foreground" variant="outline">
                    {talks.length}
                  </Badge>
                </TabsTab>
              )}
              {speakers.length > 0 && (
                <TabsTab value="speakers">
                  Speakers
                  <Badge className="not-in-data-active:text-muted-foreground" variant="outline">
                    {speakers.length}
                  </Badge>
                </TabsTab>
              )}
              {clips.length > 0 && (
                <TabsTab value="clips">
                  Clips
                  <Badge className="not-in-data-active:text-muted-foreground" variant="outline">
                    {clips.length}
                  </Badge>
                </TabsTab>
              )}
            </TabsList>
          </div>

          {talks.length > 0 && (
            <TabsPanel value="talks">
              <div className="p-6">
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
                              <UnfavoriteTalkButton talkId={talk._id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsPanel>
          )}

          {speakers.length > 0 && (
            <TabsPanel value="speakers">
              <div className="p-6">
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <span className="sr-only">Speaker</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {speakers.map((speaker) => (
                        <TableRow key={speaker._id}>
                          <TableCell>
                            <div className="flex items-center justify-between gap-4">
                              <Link className="hover:underline" href={`/speakers/${speaker.slug}`}>
                                {speaker.firstName} {speaker.lastName}
                              </Link>
                              <UnfavoriteSpeakerButton speakerId={speaker._id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsPanel>
          )}

          {clips.length > 0 && (
            <TabsPanel value="clips">
              <div className="p-6">
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <span className="sr-only">Clip</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clips.map((clip) => (
                        <TableRow key={clip._id}>
                          <TableCell>
                            <div className="flex items-center justify-between gap-4">
                              <Link className="hover:underline" href={`/clips/${clip.slug}`}>
                                {clip.title}
                              </Link>
                              <UnfavoriteClipButton clipId={clip._id} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsPanel>
          )}
        </Tabs>
      )}
    </Card>
  );
}
