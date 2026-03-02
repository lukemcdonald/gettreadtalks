import type { ReactNode } from 'react';

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
  Separator,
  Tabs,
  TabsList,
  TabsTab,
} from '@/components/ui';
import { getUserFavorites } from '@/features/users/queries/get-user-favorites';
import { FavoriteClipRow, FavoriteSpeakerRow } from './_components/favorite-entity-row';
import { FavoriteTalkRow } from './_components/favorite-talk-row';
import { FavoritesTabPanel } from './_components/favorites-tab-panel';

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

interface TabConfig<T> {
  items: T[];
  label: string;
  renderItem: (item: T) => ReactNode;
  value: string;
}

export default async function FavoritesPage() {
  const favorites = await getUserFavorites();

  const talks = favorites?.talks ?? [];
  const speakers = favorites?.speakers ?? [];
  const clips = favorites?.clips ?? [];

  const talksTab: TabConfig<(typeof talks)[number]> = {
    items: talks,
    label: 'Talk',
    renderItem: (talk) => (
      <FavoriteTalkRow
        href={`/talks/${talk.speaker?.slug}/${talk.slug}`}
        key={talk._id}
        speaker={talk.speaker}
        talkId={talk._id}
        title={talk.title}
      />
    ),
    value: 'talks',
  };

  const speakersTab: TabConfig<(typeof speakers)[number]> = {
    items: speakers,
    label: 'Speaker',
    renderItem: (speaker) => (
      <FavoriteSpeakerRow
        href={`/speakers/${speaker.slug}`}
        key={speaker._id}
        speakerId={speaker._id}
        title={`${speaker.firstName} ${speaker.lastName}`}
      />
    ),
    value: 'speakers',
  };

  const clipsTab: TabConfig<(typeof clips)[number]> = {
    items: clips,
    label: 'Clip',
    renderItem: (clip) => (
      <FavoriteClipRow
        clipId={clip._id}
        href={`/clips/${clip.slug}`}
        key={clip._id}
        title={clip.title}
      />
    ),
    value: 'clips',
  };

  const tabs = [talksTab, speakersTab, clipsTab];
  const activeTabs = tabs.filter((tab) => tab.items.length > 0);
  const total = talks.length + speakers.length + clips.length;
  const defaultTab = activeTabs[0]?.value ?? 'talks';

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
              {activeTabs.map((tab) => (
                <FavoritesTab
                  count={tab.items.length}
                  key={tab.value}
                  label={`${tab.label}s`}
                  value={tab.value}
                />
              ))}
            </TabsList>
          </div>

          {activeTabs.map((tab) => (
            <FavoritesTabPanel
              items={tab.items as never[]}
              key={tab.value}
              label={tab.label}
              renderItem={tab.renderItem as (item: never) => ReactNode}
              value={tab.value}
            />
          ))}
        </Tabs>
      )}
    </Card>
  );
}
