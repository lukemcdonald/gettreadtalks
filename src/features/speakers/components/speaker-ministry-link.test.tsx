import type { Speaker } from '@/features/speakers/types';

import { describe, expect, test } from 'vitest';

import { expectTracked, expectTrackedTimes } from '@/test/analytics';
import { render, screen } from '@/test/render';

import { SpeakerMinistryLink } from './speaker-ministry-link';

const speaker: Pick<Speaker, '_id' | 'ministry' | 'slug' | 'websiteUrl'> = {
  _id: 'speakers:john-doe' as Speaker['_id'],
  ministry: 'Sample Chapel',
  slug: 'john-doe',
  websiteUrl: 'https://example.com',
};

describe('SpeakerMinistryLink', () => {
  test('links ministry to the website and tracks the click', async () => {
    const { user } = render(<SpeakerMinistryLink speaker={speaker} />);
    const link = screen.getByRole('link', { name: /sample chapel/iu });

    expect(link).toHaveAttribute('href', 'https://example.com');

    await user.click(link);

    expectTrackedTimes(1);
    expectTracked('speaker_link_clicked', {
      link_type: 'ministry',
      speaker_id: speaker._id,
      speaker_slug: speaker.slug,
      url: 'https://example.com',
    });
  });

  test('renders ministry as text when there is no website', () => {
    render(
      <SpeakerMinistryLink speaker={{ ...speaker, websiteUrl: undefined }} />
    );

    expect(screen.getByText('Sample Chapel')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('tracks a website link when ministry is missing', async () => {
    const { user } = render(
      <SpeakerMinistryLink speaker={{ ...speaker, ministry: undefined }} />
    );
    const link = screen.getByRole('link', { name: /website/iu });

    await user.click(link);

    expectTracked('speaker_link_clicked', {
      link_type: 'website',
      speaker_id: speaker._id,
      speaker_slug: speaker.slug,
      url: 'https://example.com',
    });
  });

  test('renders nothing when ministry and website are both missing', () => {
    const { container } = render(
      <SpeakerMinistryLink
        speaker={{ ...speaker, ministry: undefined, websiteUrl: undefined }}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
