import type { Clip } from '@/features/clips/types';

import {
  describe,
  expectTracked,
  expectTrackedTimes,
  it,
  render,
  screen,
  vi,
} from '@/test';

import { ShareClipButton } from './share-clip-button';

describe('ShareClipButton', () => {
  const MOCK_CLIP: Pick<Clip, '_id' | 'slug' | 'title'> = {
    _id: 'clips:the-father-runs' as Clip['_id'],
    slug: 'the-father-runs',
    title: 'The Father Runs',
  };

  it('tracks clip_shared with the share method and clip props', async () => {
    const share = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share,
      writable: true,
    });

    const { click } = render(<ShareClipButton clip={MOCK_CLIP} />);

    await click(screen.getByRole('button'));

    expectTrackedTimes(1);
    expectTracked('clip_shared', {
      clip_id: MOCK_CLIP._id,
      clip_slug: MOCK_CLIP.slug,
      method: 'share_api',
    });
  });
});
