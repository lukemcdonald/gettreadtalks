import type { TalksSearchParams } from '@/app/talks/_components/talks-results';
import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { BrowseFilters } from '@/components/browse-filters';
import { ComboboxMultiFilter, SelectFilter, SortSelect } from '@/components/ui';
import { talkFormats } from '@/convex/model/talks/validators';
import { loadSpeakers } from '@/features/speakers/queries/load-speakers';
import { getSpeakerName, sortSpeakersByName } from '@/features/speakers/utils';
import { loadTalkFormatFilter } from '@/features/talks/queries/load-talk-format-filter';
import { formatTalkFormat } from '@/features/talks/utils';
import { loadTopicsWithCounts } from '@/features/topics/queries/load-topics-with-counts';

import { showsTalkFormatFilter } from './shows-talk-format-filter';

interface TopicWithCount {
  count: number;
  topic: Topic;
}

interface TalksSidebarProps {
  showFormatFilter: boolean;
  speakers: Speaker[];
  topics: TopicWithCount[];
}

export async function TalksSidebarContent({
  searchParams,
}: {
  searchParams: Promise<TalksSearchParams>;
}) {
  const [formatFilter, params, speakersResult, topics] = await Promise.all([
    loadTalkFormatFilter(),
    searchParams,
    loadSpeakers(),
    loadTopicsWithCounts(),
  ]);

  return (
    <TalksSidebar
      showFormatFilter={showsTalkFormatFilter({
        format: params.format,
        visible: formatFilter.visible,
      })}
      speakers={sortSpeakersByName(speakersResult.speakers)}
      topics={topics}
    />
  );
}

function TalksSidebar({
  showFormatFilter,
  speakers,
  topics,
}: TalksSidebarProps) {
  const speakerOptions = speakers.map((speaker) => ({
    label: getSpeakerName(speaker),
    value: speaker.slug,
  }));

  const topicOptions = topics.map(({ topic }) => ({
    label: topic.title,
    value: topic.slug,
  }));

  const formatOptions = talkFormats.map((format) => ({
    label: formatTalkFormat(format),
    value: format,
  }));

  const sortOptions = [
    { label: 'Recently Added', value: 'recent' },
    { label: 'Featured', value: 'featured' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Alphabetical', value: 'alphabetical' },
  ];

  return (
    <BrowseFilters
      search={{ paramName: 'search', placeholder: 'Search talks...' }}
    >
      <ComboboxMultiFilter
        label="Speakers"
        name="speakers"
        options={speakerOptions}
        placeholder="All Speakers"
      />
      <ComboboxMultiFilter
        label="Topics"
        name="topics"
        options={topicOptions}
        placeholder="All Topics"
      />
      {showFormatFilter ? (
        <SelectFilter
          label="Format"
          name="format"
          options={formatOptions}
          placeholder="All Formats"
        />
      ) : null}
      <SortSelect label="Sort by" options={sortOptions} />
    </BrowseFilters>
  );
}
