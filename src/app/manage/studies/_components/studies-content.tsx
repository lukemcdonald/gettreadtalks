import { ManageTable } from '@/components/manage-table';
import { SectionHeading } from '@/components/section-heading';
import { StudiesTableRow } from '@/features/talks/components/studies-table-row';
import { loadStudyReviewOverview } from '@/features/talks/queries/load-study-review-overview';

const COVERAGE_LABELS = [
  { key: 'done', label: 'Done' },
  { key: 'failed', label: 'Failed' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'missing', label: 'Missing' },
] as const;

export async function ManageStudiesContent() {
  const { coverage, drafts } = await loadStudyReviewOverview();

  return (
    <div className="space-y-6">
      <SectionHeading heading="Transcript coverage" />
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {COVERAGE_LABELS.map(({ key, label }) => (
          <div key={key}>
            <dt className="text-muted-foreground text-sm">{label}</dt>
            <dd className="text-2xl tabular-nums">{coverage[key]}</dd>
          </div>
        ))}
      </dl>
      <SectionHeading heading="Drafts" />
      <ManageTable isEmpty={drafts.length === 0} resource="studies">
        {drafts.map(({ speaker, study, talk }) => (
          <StudiesTableRow
            key={study._id}
            speaker={speaker}
            study={study}
            talk={talk}
          />
        ))}
      </ManageTable>
    </div>
  );
}
