import { describe, expect, it } from '@/test';

import { buildPageMetadata, formatMetaDescription } from './metadata';

describe('buildPageMetadata', () => {
  it('uses absolute canonical and og:url', () => {
    const page = buildPageMetadata({
      canonical: '/talks/lloyd-jones/the-cross',
      description: 'A talk by Martyn Lloyd-Jones.',
      title: 'The Cross',
    });

    expect(page.alternates?.canonical).toMatch(/^https:\/\//u);
    expect(page.openGraph?.url).toMatch(/^https:\/\//u);
  });

  it('pins the default share image when the page has no generated image', () => {
    const page = buildPageMetadata({
      canonical: '/talks',
      title: 'Talks',
    });

    expect(page.openGraph).toHaveProperty(
      'images',
      expect.arrayContaining([
        expect.objectContaining({ url: '/default-seo-image.png' }),
      ])
    );
  });

  it('omits share images so a colocated opengraph-image route can apply', () => {
    const page = buildPageMetadata({
      canonical: '/talks/lloyd-jones/the-cross',
      hasGeneratedShareImage: true,
      title: 'The Cross',
    });

    expect(page.openGraph).not.toHaveProperty('images');
  });
});

describe('formatMetaDescription', () => {
  it('trims at a word boundary without ending on a conjunction', () => {
    const description =
      'Speaking from Colossians 2, Jeff Durbin was asked to show how a presuppositional, Van Tillian apologetic answers Black Lives Matter, the LGBT movement and abortion.';
    const result = formatMetaDescription(description);

    expect(result).toMatch(/^Speaking from Colossians 2/u);
    expect(result).not.toMatch(/\b(?:and|or|but)$/iu);
    expect(result?.length).toBeLessThanOrEqual(160);
    expect(result?.length).toBeLessThan(description.length);
  });
});
