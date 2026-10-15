import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import {
  describe,
  expectTracked,
  expectTrackedTimes,
  it,
  render,
  screen,
  vi,
} from '@/test';

import { ShareTalkButton } from './share-talk-button';

describe('ShareTalkButton', () => {
  const MOCK_SPEAKER: Pick<Speaker, '_id' | 'slug'> = {
    _id: 'speakers:john-doe' as Speaker['_id'],
    slug: 'john-doe',
  };
  const MOCK_TALK: Pick<Talk, '_id' | 'slug' | 'title'> = {
    _id: 'talks:romans-8' as Talk['_id'],
    slug: 'romans-8',
    title: 'Romans 8',
  };

  function setup(
    props: Partial<ComponentProps<typeof ShareTalkButton>> = {},
    options?: RenderOptions
  ) {
    return render(
      <ShareTalkButton speaker={MOCK_SPEAKER} talk={MOCK_TALK} {...props} />,
      options
    );
  }

  it('tracks talk_shared with the share method and talk props', async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });

    const { click } = setup();

    await click(screen.getByRole('button'));

    expectTrackedTimes(1);
    expectTracked('talk_shared', {
      method: 'share_api',
      speaker_id: MOCK_SPEAKER._id,
      speaker_slug: MOCK_SPEAKER.slug,
      talk_id: MOCK_TALK._id,
      talk_slug: MOCK_TALK.slug,
    });
  });
});
