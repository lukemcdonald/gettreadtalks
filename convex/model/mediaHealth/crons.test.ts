import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { MEDIA_HEALTH_CRON_IDENTIFIER } from './cronJob.ts';

test('cron targets the internal media health action', () => {
  const source = readFileSync(
    new URL('../../crons.ts', import.meta.url),
    'utf-8'
  );

  assert.equal(MEDIA_HEALTH_CRON_IDENTIFIER, 'check published media urls');
  assert.match(source, /internal\.mediaHealth\.checkPublishedMedia/u);
  assert.doesNotMatch(source, /api\.mediaHealth/u);
});
