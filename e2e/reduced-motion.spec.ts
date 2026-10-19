import type { Locator } from '@playwright/test';

import { expect, test } from './fixtures/index.ts';

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Talks / Card hover has no scale or timed transition', async ({
    talksPage,
  }) => {
    await talksPage.goto();

    const talkLink = talksPage.firstTalk;

    await expect(talkLink).toBeVisible();

    const rest = await getCardMotion(talkLink);
    await talkLink.hover();
    const hover = await getCardMotion(talkLink);

    expect(hover.scale).toBe(1);
    expect(hover.transitionSeconds).toBe(0);
    expect(hover.boxShadow).not.toBe(rest.boxShadow);
  });
});

function getCardMotion(talkLink: Locator) {
  return talkLink.evaluate((el) => {
    const card = el.closest('[data-slot="card"]');

    if (!(card instanceof HTMLElement)) {
      throw new Error('Talk card not found');
    }

    const style = getComputedStyle(card);
    const durations = style.transitionDuration
      .split(',')
      .map((part) => Number(part.trim()) || 0);
    const { transform } = style;
    const scale = transform === 'none' ? 1 : new DOMMatrix(transform).a;

    return {
      boxShadow: style.boxShadow,
      scale,
      transitionSeconds: Math.max(...durations),
    };
  });
}
