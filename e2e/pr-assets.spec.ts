import { expect, test } from './fixtures/index.ts';

const ASSETS = 'test-results/pr-assets';
const NO_SUMMARY_PATH = '/talks/john-doe/sample-talk-the-lord-is-my-shepherd';
const SUMMARY_PATH = '/talks/mary-smith/example-talk-the-prodigal-son';

test('PR assets / talk with published summary', async ({ talksPage }) => {
  const { page } = talksPage;

  await page.setViewportSize({ height: 900, width: 1280 });
  await page.goto(SUMMARY_PATH);
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  await expect(page.getByText(/the father runs to meet him/u)).toBeVisible();
  await page.screenshot({
    fullPage: true,
    path: `${ASSETS}/talk-with-summary-desktop.png`,
  });

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto(SUMMARY_PATH);
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  await page.screenshot({
    fullPage: true,
    path: `${ASSETS}/talk-with-summary-mobile.png`,
  });
});

test('PR assets / talk without published summary', async ({ talksPage }) => {
  const { page } = talksPage;

  await page.setViewportSize({ height: 900, width: 1280 });
  await page.goto(NO_SUMMARY_PATH);
  await expect(talksPage.talkHeading).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About' })).toHaveCount(0);
  await page.screenshot({
    fullPage: true,
    path: `${ASSETS}/talk-without-summary-desktop.png`,
  });

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto(NO_SUMMARY_PATH);
  await expect(talksPage.talkHeading).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About' })).toHaveCount(0);
  await page.screenshot({
    fullPage: true,
    path: `${ASSETS}/talk-without-summary-mobile.png`,
  });
});
