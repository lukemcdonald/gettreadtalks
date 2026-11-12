import { describe, expect, it } from '@/test';

import { getPrefetchPath } from './get-prefetch-path';

describe('getPrefetchPath', () => {
  it('keeps an internal path', () => {
    expect(getPrefetchPath('/talks')).toBe('/talks');
    expect(getPrefetchPath({ pathname: '/speakers' })).toBe('/speakers');
  });

  it('ignores external and protocol-relative urls', () => {
    expect(getPrefetchPath('https://www.crossway.org/bibles/')).toBe('');
    expect(getPrefetchPath('mailto:hello@example.com')).toBe('');
    expect(getPrefetchPath('//example.com')).toBe('');
  });

  it('ignores a missing path', () => {
    expect(getPrefetchPath({ pathname: undefined })).toBe('');
  });
});
