import type { Speaker } from '@/features/speakers/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import {
  describe,
  expectTracked,
  expectTrackedTimes,
  it,
  render,
  vi,
} from '@/test';

import { ShareSpeakerButton } from './share-speaker-button';

describe('ShareSpeakerButton', () => {
  const MOCK_SPEAKER: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'> =
    {
      _id: 'speakers:john-doe' as Speaker['_id'],
      firstName: 'John',
      lastName: 'Doe',
      slug: 'john-doe',
    };

  function setup(
    props: Partial<ComponentProps<typeof ShareSpeakerButton>> = {},
    options?: RenderOptions
  ) {
    return render(
      <ShareSpeakerButton speaker={MOCK_SPEAKER} {...props} />,
      options
    );
  }

  it('tracks speaker_shared with the share method and speaker props', async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });

    const { getByRole, user } = setup();

    await user.click(getByRole('button'));

    expectTrackedTimes(1);
    expectTracked('speaker_shared', {
      method: 'share_api',
      speaker_id: MOCK_SPEAKER._id,
      speaker_slug: MOCK_SPEAKER.slug,
    });
  });
});
