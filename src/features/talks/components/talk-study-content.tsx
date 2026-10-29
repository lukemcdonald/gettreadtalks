import type { TalkStudy } from '@/features/talks/types';
import type { ReactNode } from 'react';

import { cn } from '@/utils';

type TalkStudyKeyPassage = NonNullable<TalkStudy['keyPassages']>[number];
type TalkStudyMainPoint = NonNullable<TalkStudy['mainPoints']>[number];

function formatStudyRefs(references: TalkStudyMainPoint['references']) {
  return references
    .map((reference) => reference.trim())
    .filter(Boolean)
    .join(', ');
}

function hasMainPointContent(point: TalkStudyMainPoint) {
  return Boolean(point.heading.trim() || point.body.trim());
}

function hasKeyPassageContent(passage: TalkStudyKeyPassage) {
  return Boolean(passage.reference.trim() || passage.note.trim());
}

function toStudyItems<T>(
  items: T[] | null | undefined,
  hasContent: (item: T) => boolean
) {
  return (items ?? []).filter(hasContent);
}

function StudySection({
  children,
  heading,
  items,
  stacked,
  testId,
}: {
  children: ReactNode;
  heading: string;
  items: unknown[];
  stacked?: boolean;
  testId: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={
        stacked ? 'space-y-4' : 'grid gap-4 lg:grid-cols-[280px_1fr] lg:gap-8'
      }
      data-testid={testId}
    >
      <header className={stacked ? undefined : 'lg:sticky lg:top-20 lg:h-fit'}>
        <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {heading}
        </h2>
      </header>
      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}

function TalkStudyMainPointItem({ point }: { point: TalkStudyMainPoint }) {
  const body = point.body.trim();
  const heading = point.heading.trim();
  const refs = formatStudyRefs(point.references);

  return (
    <div className="space-y-2">
      {heading ? <h3 className="text-base font-semibold">{heading}</h3> : null}
      {body ? (
        <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
      ) : null}
      {refs ? <p className="text-muted-foreground text-sm">{refs}</p> : null}
    </div>
  );
}

function TalkStudyKeyPassageItem({
  passage,
}: {
  passage: TalkStudyKeyPassage;
}) {
  const note = passage.note.trim();
  const reference = passage.reference.trim();

  return (
    <div className="space-y-2">
      {reference ? (
        <h3 className="text-base font-semibold">{reference}</h3>
      ) : null}
      {note ? (
        <p className="text-muted-foreground text-sm leading-relaxed">{note}</p>
      ) : null}
    </div>
  );
}

export function TalkStudyContent({
  keyPassages,
  mainPoints,
  stacked,
}: {
  keyPassages?: TalkStudyKeyPassage[] | null;
  mainPoints?: TalkStudyMainPoint[] | null;
  stacked?: boolean;
}) {
  const points = toStudyItems(mainPoints, hasMainPointContent);
  const passages = toStudyItems(keyPassages, hasKeyPassageContent);

  if (points.length + passages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('space-y-8', !stacked && 'lg:space-y-16')}
      data-testid="talk-study-content"
    >
      <StudySection
        heading="Main points"
        items={points}
        stacked={stacked}
        testId="talk-study-main-points"
      >
        {points.map((point) => (
          <TalkStudyMainPointItem
            key={point.heading || point.body}
            point={point}
          />
        ))}
      </StudySection>
      <StudySection
        heading="Key passages"
        items={passages}
        stacked={stacked}
        testId="talk-study-key-passages"
      >
        {passages.map((passage) => (
          <TalkStudyKeyPassageItem
            key={passage.reference || passage.note}
            passage={passage}
          />
        ))}
      </StudySection>
    </div>
  );
}
