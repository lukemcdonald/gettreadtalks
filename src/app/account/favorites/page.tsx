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
  TableCell,
  TableRow,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';
import { AccountTable } from '../_components/account-table';
import { TalkTableRow } from '../_components/talk-table-row';
import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
  UnfavoriteTalkButton,
} from './_components/unfavorite-buttons';

interface FavoritesTabProps {
  count: number;
  label: string;
  value: string;
}

function FavoritesTab({ count, label, value }: FavoritesTabProps) {
  return (
    <TabsTab value={value}>
      {label}
      <Badge className="not-in-data-active:text-muted-foreground" variant="outline">
        {count}
      </Badge>
    </TabsTab>
  );
}

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
                <FavoritesTab count={talks.length} label="Talks" value="talks" />
              )}
              {speakers.length > 0 && (
                <FavoritesTab count={speakers.length} label="Speakers" value="speakers" />
              )}
              {clips.length > 0 && (
                <FavoritesTab count={clips.length} label="Clips" value="clips" />
              )}
            </TabsList>
          </div>

          {talks.length > 0 && (
            <TabsPanel value="talks">
              <AccountTable label="Talk">
                {talks.map((talk) => (
                  <TalkTableRow
                    action={<UnfavoriteTalkButton talkId={talk._id} />}
                    href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
                    key={talk._id}
                    speaker={talk.speaker}
                    title={talk.title}
                  />
                ))}
              </AccountTable>
            </TabsPanel>
          )}

          {speakers.length > 0 && (
            <TabsPanel value="speakers">
              <AccountTable label="Speaker">
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
              </AccountTable>
            </TabsPanel>
          )}

          {clips.length > 0 && (
            <TabsPanel value="clips">
              <AccountTable label="Clip">
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
              </AccountTable>
            </TabsPanel>
          )}
        </Tabs>
      )}
    </Card>
  );
}
