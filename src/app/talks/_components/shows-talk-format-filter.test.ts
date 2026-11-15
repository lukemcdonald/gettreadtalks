import { describe, expect, it } from '@/test';

import { showsTalkFormatFilter } from './shows-talk-format-filter';

describe('showsTalkFormatFilter', () => {
  it('stays hidden when one format is in use and none is selected', () => {
    expect(showsTalkFormatFilter({ format: undefined, visible: false })).toBe(
      false
    );
    expect(showsTalkFormatFilter({ format: 'homily', visible: false })).toBe(
      false
    );
  });

  it('stays visible when a format is already selected', () => {
    expect(showsTalkFormatFilter({ format: 'sermon', visible: false })).toBe(
      true
    );
  });

  it('stays visible when published talks use multiple formats', () => {
    expect(showsTalkFormatFilter({ visible: true })).toBe(true);
  });
});
