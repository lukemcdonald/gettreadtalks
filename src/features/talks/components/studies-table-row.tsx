import type { Talk, TalkStudy } from '@/features/talks/types';

import { getHoverItems, ManageRow } from '@/components/manage-table';
import { buildEntityEditPath } from '@/lib/entities/paths';

interface StudiesTableRowProps {
  study: TalkStudy;
  talk: Talk;
}

export function StudiesTableRow({ study, talk }: StudiesTableRowProps) {
  return (
    <ManageRow
      actions={<span />}
      editHref={buildEntityEditPath('talks', talk._id)}
      hoverItems={getHoverItems([{ label: 'Summary', value: study.summary }])}
      status={study.studyStatus}
      subtitle={study.summary}
      title={talk.title}
    />
  );
}
