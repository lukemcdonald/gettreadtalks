import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { RenderOptions } from '@/test/render';
import type { ComponentProps } from 'react';

import { describe, test, vi } from 'vitest';

import { expectTracked, expectTrackedTimes } from '@/test/analytics';
import { render, screen, userEvent } from '@/test/render';

import { ShareTalkButton } from './share-talk-button';

const talk: Pick<Talk, '_id' | 'slug' | 'title'> = {
  _id: 'talks:romans-8' as Talk['_id'],
  slug: 'romans-8',
  title: 'Romans 8',
};

const speaker: Pick<Speaker, '_id' | 'slug'> = {
  _id: 'speakers:john-doe' as Speaker['_id'],
  slug: 'john-doe',
};

function setup(
  props: Partial<ComponentProps<typeof ShareTalkButton>> = {},
  options?: RenderOptions
) {
  return {
    user: userEvent.setup(),
    ...render(
      <ShareTalkButton speaker={speaker} talk={talk} {...props} />,
      options
    ),
  };
}

describe('ShareTalkButton', () => {
  test('tracks talk_shared with the share method and talk props', async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });

    const { user } = setup();

    await user.click(screen.getByRole('button'));

    expectTrackedTimes(1);
    expectTracked('talk_shared', {
      method: 'share_api',
      speaker_id: speaker._id,
      speaker_slug: speaker.slug,
      talk_id: talk._id,
      talk_slug: talk.slug,
    });
  });
});
