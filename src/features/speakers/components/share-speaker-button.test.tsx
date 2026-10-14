import type { Speaker } from '@/features/speakers/types';

import { describe, test, vi } from 'vitest';

import { expectTracked, expectTrackedTimes } from '@/test/analytics';
import { render, screen } from '@/test/render';

import { ShareSpeakerButton } from './share-speaker-button';

const speaker: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'> = {
  _id: 'speakers:john-doe' as Speaker['_id'],
  firstName: 'John',
  lastName: 'Doe',
  slug: 'john-doe',
};

describe('ShareSpeakerButton', () => {
  test('tracks speaker_shared with the share method and speaker props', async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });

    const { user } = render(<ShareSpeakerButton speaker={speaker} />);

    await user.click(screen.getByRole('button'));

    expectTrackedTimes(1);
    expectTracked('speaker_shared', {
      method: 'share_api',
      speaker_id: speaker._id,
      speaker_slug: speaker.slug,
    });
  });
});
