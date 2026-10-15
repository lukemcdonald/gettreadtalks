import type { Speaker } from '@/features/speakers/types';
import type { RenderOptions } from '@/test/render';
import type { ComponentProps } from 'react';

import { describe, expect, test } from 'vitest';

import { expectTracked, expectTrackedTimes } from '@/test/analytics';
import { render, screen, userEvent } from '@/test/render';

import { SpeakerMinistryLink } from './speaker-ministry-link';

describe('SpeakerMinistryLink', () => {
  const MOCK_SPEAKER: Pick<
    Speaker,
    '_id' | 'ministry' | 'slug' | 'websiteUrl'
  > = {
    _id: 'speakers:john-doe' as Speaker['_id'],
    ministry: 'Sample Chapel',
    slug: 'john-doe',
    websiteUrl: 'https://example.com',
  };

  function setup(
    props: Partial<ComponentProps<typeof SpeakerMinistryLink>> = {},
    options?: RenderOptions
  ) {
    return {
      user: userEvent.setup(),
      ...render(
        <SpeakerMinistryLink speaker={MOCK_SPEAKER} {...props} />,
        options
      ),
    };
  }

  test('links ministry to the website and tracks the click', async () => {
    const { user } = setup();
    const link = screen.getByRole('link', { name: /sample chapel/iu });

    expect(link).toHaveAttribute('href', MOCK_SPEAKER.websiteUrl);

    await user.click(link);

    expectTrackedTimes(1);
    expectTracked('speaker_link_clicked', {
      link_type: 'ministry',
      speaker_id: MOCK_SPEAKER._id,
      speaker_slug: MOCK_SPEAKER.slug,
      url: MOCK_SPEAKER.websiteUrl,
    });
  });

  test('renders ministry as text when there is no website', () => {
    setup({ speaker: { ...MOCK_SPEAKER, websiteUrl: undefined } });

    expect(screen.getByText('Sample Chapel')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('tracks a website link when ministry is missing', async () => {
    const { user } = setup({
      speaker: { ...MOCK_SPEAKER, ministry: undefined },
    });
    const link = screen.getByRole('link', { name: /website/iu });

    await user.click(link);

    expectTracked('speaker_link_clicked', {
      link_type: 'website',
      speaker_id: MOCK_SPEAKER._id,
      speaker_slug: MOCK_SPEAKER.slug,
      url: MOCK_SPEAKER.websiteUrl,
    });
  });

  test('renders nothing when ministry and website are both missing', () => {
    const { container } = setup({
      speaker: {
        ...MOCK_SPEAKER,
        ministry: undefined,
        websiteUrl: undefined,
      },
    });

    expect(container).toBeEmptyDOMElement();
  });
});
