import { describe, expect, it } from 'vitest';

import { internal } from '../../_generated/api';
import { createConvexTest } from '../../test.setup';

const CHECKED_AT = 1_700_000_000_000;
const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

async function upsert(
  t: ReturnType<typeof createConvexTest>,
  observedStatus: 'missing' | 'ok' | 'private',
  checkedAt = CHECKED_AT
) {
  return await t.mutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt,
    entityId: 'talk1',
    entityTable: 'talks',
    mediaUrl: MEDIA_URL,
    observedStatus,
  });
}

describe('media health notify timestamps', () => {
  it('treats a first break as unnotified', async () => {
    const t = createConvexTest();
    const result = await upsert(t, 'private');

    expect(result.firstBrokenAt).toBe(CHECKED_AT);
    expect(result.lastNotifiedAt).toBeUndefined();
  });

  it('does not treat an already-notified break as new', async () => {
    const t = createConvexTest();
    const first = await upsert(t, 'private');

    await t.mutation(internal.mediaHealth.stampMediaChecksNotified, {
      checkIds: [first.checkId],
      notifiedAt: CHECKED_AT + 1,
    });

    const second = await upsert(t, 'private', CHECKED_AT + 2);

    expect(second.checkId).toBe(first.checkId);
    expect(second.firstBrokenAt).toBe(CHECKED_AT);
    expect(second.lastNotifiedAt).toBe(CHECKED_AT + 1);
  });

  it('treats a re-break after recovery as unnotified', async () => {
    const t = createConvexTest();
    const first = await upsert(t, 'private');

    await t.mutation(internal.mediaHealth.stampMediaChecksNotified, {
      checkIds: [first.checkId],
      notifiedAt: CHECKED_AT + 1,
    });
    await upsert(t, 'ok', CHECKED_AT + 2);

    const again = await upsert(t, 'missing', CHECKED_AT + 3);

    expect(again.firstBrokenAt).toBe(CHECKED_AT + 3);
    expect(again.lastNotifiedAt).toBeUndefined();
  });
});
