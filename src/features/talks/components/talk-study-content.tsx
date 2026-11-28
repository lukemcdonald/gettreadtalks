import type { ReactNode } from 'react';
import type { Components } from 'react-markdown';

import { isValidElement } from 'react';
import Markdown from 'react-markdown';

import { slugify } from '@/convex/lib/utils';
import { cn } from '@/utils';

const STUDY_MARKDOWN_ELEMENTS = [
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

function getText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getText).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getText(node.props.children);
  }

  return '';
}

function StudyPartHeading({ children }: { children?: ReactNode }) {
  return (
    <h3
      className="mt-12 scroll-mt-24 text-lg font-semibold tracking-tight first:mt-0"
      id={slugify(getText(children))}
    >
      {children}
    </h3>
  );
}

function StudyItemHeading({ children }: { children?: ReactNode }) {
  return <h4 className="mt-5 font-semibold [h3+&]:mt-4">{children}</h4>;
}

const STUDY_BLOCK_CLASS_NAME = 'mt-1 [h3+&]:mt-4';

const studyMarkdownComponents: Components = {
  h1: StudyPartHeading,
  h2: StudyPartHeading,
  h3: StudyItemHeading,
  h4: StudyItemHeading,
  h5: StudyItemHeading,
  h6: StudyItemHeading,
  li: ({ children }) => <li>{children}</li>,
  ol: ({ children }) => (
    <ol className={cn(STUDY_BLOCK_CLASS_NAME, 'list-decimal space-y-2 pl-5')}>
      {children}
    </ol>
  ),
  p: ({ children }) => <p className={STUDY_BLOCK_CLASS_NAME}>{children}</p>,
  ul: ({ children }) => (
    <ul className={cn(STUDY_BLOCK_CLASS_NAME, 'list-disc space-y-2 pl-5')}>
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
    <div
      className="text-foreground max-w-prose text-base leading-7"
      data-testid="talk-study-content"
    >
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
