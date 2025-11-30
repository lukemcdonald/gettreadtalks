import { FilterUtilityBar } from '@/components/filter-utility-bar';
import { getAllSpeakersForFilter, getAllTopicsForFilter } from '@/features/talks';

type TalksListFilterProps = {
  userIsAdmin: boolean;
};

export async function TalksListFilter({ userIsAdmin }: TalksListFilterProps) {
  // Fetch filter data (not affected by pagination)
  // Todo: should the filter bar include filter getters? Maybe pass a set of filters to get? [speakers, topics, status]
  const [speakers, topics] = await Promise.all([
    getAllSpeakersForFilter(),
    getAllTopicsForFilter(),
  ]);

  return <FilterUtilityBar isAdmin={userIsAdmin} speakers={speakers} topics={topics} />;
}
