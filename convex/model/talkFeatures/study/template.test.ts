import { describe, expect, it } from 'vitest';

import { getMissingStudyTemplateHeadings } from './template';

describe('getMissingStudyTemplateHeadings', () => {
  it('returns only the required template headings that are missing', () => {
    expect(getMissingStudyTemplateHeadings('')).toEqual([
      'Main points',
      'Key passages',
    ]);
    expect(
      getMissingStudyTemplateHeadings('## Main points\n\n### A point')
    ).toEqual(['Key passages']);
    expect(
      getMissingStudyTemplateHeadings(
        '## Main points\n\n### A point\n\n## Key passages\n\n### Romans 8:28'
      )
    ).toEqual([]);
  });
});
