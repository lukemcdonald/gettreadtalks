import type { ReactNode } from 'react';
import type { Components } from 'react-markdown';

import Markdown from 'react-markdown';

const STUDY_MARKDOWN_ELEMENTS = [
  'blockquote',
  'br',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'ol',
  'p',
  'strong',
  'ul',
];

const STUDY_HEADING_CLASS_NAME = {
  h2: 'text-muted-foreground text-xs font-semibold tracking-wide uppercase first:pt-0 pt-6',
  h3: 'text-base font-semibold',
  h4: 'text-sm font-semibold',
} as const;

function StudyHeading({
  as: Tag,
  children,
}: {
  as: keyof typeof STUDY_HEADING_CLASS_NAME;
  children?: ReactNode;
}) {
  return <Tag className={STUDY_HEADING_CLASS_NAME[Tag]}>{children}</Tag>;
}

const studyMarkdownComponents: Components = {
  blockquote: ({ children }) => (
    <blockquote className="border-border text-muted-foreground border-l-2 pl-4 text-sm leading-relaxed">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => <StudyHeading as="h2">{children}</StudyHeading>,
  h2: ({ children }) => <StudyHeading as="h2">{children}</StudyHeading>,
  h3: ({ children }) => <StudyHeading as="h3">{children}</StudyHeading>,
  h4: ({ children }) => <StudyHeading as="h4">{children}</StudyHeading>,
  h5: ({ children }) => <StudyHeading as="h4">{children}</StudyHeading>,
  h6: ({ children }) => <StudyHeading as="h4">{children}</StudyHeading>,
  li: ({ children }) => <li>{children}</li>,
  ol: ({ children }) => (
    <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm leading-relaxed">
      {children}
    </ol>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm leading-relaxed">
      {children}
    </ul>
  ),
};

export function TalkStudyContent({ body }: { body?: string | null }) {
  const markdown = body?.trim();

  if (!markdown) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="talk-study-content">
      <Markdown
        allowedElements={STUDY_MARKDOWN_ELEMENTS}
        components={studyMarkdownComponents}
        skipHtml
        unwrapDisallowed
      >
        {markdown}
      </Markdown>
    </div>
  );
}
