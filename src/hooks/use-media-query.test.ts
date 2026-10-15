import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { useMediaQuery } from './use-media-query';

describe('useMediaQuery', () => {
  function MediaLabel() {
    const isDesktop = useMediaQuery('lg');

    return createElement(
      'p',
      null,
      isDesktop ? 'Desktop layout' : 'Mobile layout'
    );
  }

  it('does not read window during SSR', () => {
    expect(typeof globalThis.window).toBe('undefined');
    expect(() => renderToString(createElement(MediaLabel))).not.toThrow();
    expect(renderToString(createElement(MediaLabel))).toBe(
      '<p>Mobile layout</p>'
    );
  });
});
