import { site } from '@/configs/site';
import { describe, expect, it } from '@/test';

import { buildPageMetadata, formatMetaDescription } from './metadata';

describe('buildPageMetadata', () => {
  it('keeps siteName and locale when a page sets an openGraph type', () => {
    const talk = buildPageMetadata({
      canonical: '/talks/lloyd-jones/the-cross',
      description: 'A talk by Martyn Lloyd-Jones. Romans 3:21-26',
      openGraphType: 'video.other',
      title: 'The Cross',
    });
    const speaker = buildPageMetadata({
      canonical: '/speakers/lloyd-jones',
      description: 'Martyn Lloyd-Jones — faithful minister of the Gospel.',
      openGraphType: 'profile',
      title: 'Martyn Lloyd-Jones',
    });

    expect(talk.alternates).toEqual({
      canonical: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
    });
    expect(talk.openGraph).toEqual({
      images: [
        {
          alt: site.name,
          height: 630,
          url: '/default-seo-image.png',
          width: 1200,
        },
      ],
      locale: site.locale,
      siteName: site.name,
      type: 'video.other',
      url: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
    });
    expect(speaker.openGraph).toEqual({
      images: [
        {
          alt: site.name,
          height: 630,
          url: '/default-seo-image.png',
          width: 1200,
        },
      ],
      locale: site.locale,
      siteName: site.name,
      type: 'profile',
      url: 'https://www.gettreadtalks.com/speakers/lloyd-jones',
    });
  });

  it('sets website openGraph and an absolute canonical by default', () => {
    const topic = buildPageMetadata({
      canonical: '/topics/justification',
      description: 'Talks on justification.',
      title: 'Justification',
    });

    expect(topic.alternates).toEqual({
      canonical: 'https://www.gettreadtalks.com/topics/justification',
    });
    expect(topic.openGraph).toMatchObject({
      type: 'website',
      url: 'https://www.gettreadtalks.com/topics/justification',
    });
  });
});

describe('formatMetaDescription', () => {
  it('trims to 160 characters and drops a trailing conjunction', () => {
    const description =
      'Speaking from Colossians 2, Jeff Durbin was asked to show how a presuppositional, Van Tillian apologetic answers Black Lives Matter, the LGBT movement and abortion.';

    expect(formatMetaDescription(description)).toBe(
      'Speaking from Colossians 2, Jeff Durbin was asked to show how a presuppositional, Van Tillian apologetic answers Black Lives Matter, the LGBT movement'
    );
    expect(formatMetaDescription(description)?.length).toBeLessThanOrEqual(160);
  });
});
