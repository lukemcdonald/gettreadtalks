import { site } from '@/configs/site';
import { describe, expect, it } from '@/test';

import { buildPageMetadata } from './metadata';

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
      canonical: '/talks/lloyd-jones/the-cross',
    });
    expect(talk.openGraph).toEqual({
      locale: site.locale,
      siteName: site.name,
      type: 'video.other',
    });
    expect(speaker.openGraph).toEqual({
      locale: site.locale,
      siteName: site.name,
      type: 'profile',
    });
  });

  it('omits openGraph so pages inherit siteName and locale from the root', () => {
    const topic = buildPageMetadata({
      canonical: '/topics/justification',
      description: 'Talks on justification.',
      title: 'Justification',
    });

    expect(topic.alternates).toEqual({ canonical: '/topics/justification' });
    expect(topic.openGraph).toBeUndefined();
  });
});
