import { expect, test } from './fixtures/index.ts';
import {
  E2E_USER_SKIP_REASON,
  hasE2eUser,
} from './fixtures/user-credentials.ts';

test.skip(!hasE2eUser(), E2E_USER_SKIP_REASON);

test('Talks / Favorite and unfavorite', async ({ talksPage }) => {
  await talksPage.goto();
  await talksPage.openFirst();

  await expect(talksPage.favorite).toBeVisible();
  await expect(talksPage.favorite).toBeEnabled();

  const startedPressed = await talksPage.favorite.getAttribute('aria-pressed');

  await talksPage.favorite.click();
  await expect(talksPage.favorite).toHaveAttribute(
    'aria-pressed',
    startedPressed === 'true' ? 'false' : 'true'
  );

  await talksPage.favorite.click();
  await expect(talksPage.favorite).toHaveAttribute(
    'aria-pressed',
    startedPressed ?? 'false'
  );
});
