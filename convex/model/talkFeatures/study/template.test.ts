import { describe, expect, it } from 'vitest';

import { getMissingStudyTemplateHeadings } from './template';

describe('getMissingStudyTemplateHeadings', () => {
  it('returns only the required template headings that are missing', () => {
    expect(getMissingStudyTemplateHeadings('')).toEqual([
      'Main points',
      'Key passages',
      'Questions',
      'Next step',
    ]);
    expect(
      getMissingStudyTemplateHeadings('## Main points\n\n### A point')
    ).toEqual(['Key passages', 'Questions', 'Next step']);
    expect(
      getMissingStudyTemplateHeadings(
        '## Main points\n\n### A point\n\n## Key passages\n\n### Romans 8:28'
      )
    ).toEqual(['Questions', 'Next step']);
    expect(
      getMissingStudyTemplateHeadings(
        [
          '## Main points',
          '',
          '### A point',
          '',
          '## Key passages',
          '',
          '### Romans 8:28',
          '',
          '## Questions',
          '',
          '- A question.',
          '',
          '## Next step',
          '',
          'Do this.',
        ].join('\n')
      )
    ).toEqual([]);
  });
});
