import type { Topic } from '@/features/topics/types';

import { SidebarContent } from '@/components/sidebar-content';
import { MobileFilterDrawer } from '@/components/ui';
import { ComboboxMultiFilter } from '@/components/ui/combobox-multi-filter';

interface TopicWithCount {
  talkCount: number;
  topic: Pick<Topic, 'slug' | 'title'>;
}

interface TopicsSidebarProps {
  topics: TopicWithCount[];
}

export function TopicsSidebar({ topics }: TopicsSidebarProps) {
  const topicOptions = topics.map(({ topic }) => ({
    label: topic.title,
    value: topic.slug,
  }));

  return (
    <SidebarContent className="space-y-4">
      {/* Mobile: icon filter button */}
      <div className="flex items-center gap-2 md:hidden">
        <MobileFilterDrawer variant="icon">
          <ComboboxMultiFilter
            label="Topics"
            name="topics"
            options={topicOptions}
            placeholder="All Topics"
          />
        </MobileFilterDrawer>
      </div>

      {/* Desktop: full sidebar */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <ComboboxMultiFilter
          label="Topics"
          name="topics"
          options={topicOptions}
          placeholder="All Topics"
        />
      </div>
    </SidebarContent>
  );
}
