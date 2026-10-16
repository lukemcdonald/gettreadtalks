import { PageHeader } from '@/components/page-header';
import {
  Badge,
  Card,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Tabs,
  TabsList,
  TabsTab,
} from '@/components/ui';
import { buildClipUrl } from '@/features/clips/utils';
import { getSpeakerName } from '@/features/speakers/utils';
import { buildTalkUrl } from '@/features/talks/utils';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';

import {
  FavoriteClipRow,
  FavoriteSpeakerRow,
} from './_components/favorite-entity-row';
import { FavoriteTalkRow } from './_components/favorite-talk-row';
import { FavoritesTabPanel } from './_components/favorites-tab-panel';

type UserFavorites = Awaited<ReturnType<typeof getUserFavorites>>;

function FavoritesTab({
  count,
  label,
  value,
}: {
  count: number;
  label: string;
  value: string;
}) {
  return (
    <TabsTab value={value}>
      {label}
      <Badge
        className="not-in-data-active:text-muted-foreground"
        variant="outline"
      >
        {count}
      </Badge>
    </TabsTab>
  );
}

function FavoritesEmpty() {
  return (
    <div className="p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyDescription>
            Start exploring to build your collection!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

function FavoritesTabPanels({ clips, speakers, talks }: UserFavorites) {
  return (
    <>
      <FavoritesTabPanel
        items={talks}
        label="Talk"
        renderItem={(talk) => (
          <FavoriteTalkRow
            href={talk.speaker ? buildTalkUrl(talk.speaker.slug, talk.slug) : ''}
            key={talk._id}
            speaker={talk.speaker}
            talkId={talk._id}
            title={talk.title}
          />
        )}
        value="talks"
      />
      <FavoritesTabPanel
        items={speakers}
        label="Speaker"
        renderItem={(speaker) => (
          <FavoriteSpeakerRow
            href={`/speakers/${speaker.slug}`}
            key={speaker._id}
            speakerId={speaker._id}
            title={getSpeakerName(speaker)}
          />
        )}
        value="speakers"
      />
      <FavoritesTabPanel
        items={clips}
        label="Clip"
        renderItem={(clip) => (
          <FavoriteClipRow
            clipId={clip._id}
            href={buildClipUrl(clip.slug)}
            key={clip._id}
            title={clip.title}
          />
        )}
        value="clips"
      />
    </>
  );
}

function FavoritesTabs({ clips, speakers, talks }: UserFavorites) {
  const tabs = [
    { count: talks.length, label: 'Talks', value: 'talks' },
    { count: speakers.length, label: 'Speakers', value: 'speakers' },
    { count: clips.length, label: 'Clips', value: 'clips' },
  ].filter((tab) => tab.count > 0);

  return (
    <Tabs defaultValue={tabs[0]?.value ?? 'talks'}>
      <div className="border-b px-6">
        <TabsList variant="underline">
          {tabs.map((tab) => (
            <FavoritesTab
              count={tab.count}
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </TabsList>
      </div>
      <FavoritesTabPanels clips={clips} speakers={speakers} talks={talks} />
    </Tabs>
  );
}

export default async function FavoritesPage() {
  const { clips, speakers, talks } = await getUserFavorites();
  const total = clips.length + speakers.length + talks.length;

  return (
    <>
      <PageHeader
        description="Talks, speakers, and clips you've saved."
        title="Favorites"
      />
      <Card>
        {total === 0 ? (
          <FavoritesEmpty />
        ) : (
          <FavoritesTabs clips={clips} speakers={speakers} talks={talks} />
        )}
      </Card>
    </>
  );
}
