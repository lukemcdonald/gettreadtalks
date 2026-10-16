import { describe, expect, it } from '@/test';

import { shareImage, toShareSpeaker } from './share-image';

const PNG_MAGIC = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

async function pngBuffer(response: Response) {
  return Buffer.from(await response.arrayBuffer());
}

function pngSize(buffer: Buffer) {
  return {
    height: buffer.readUInt32BE(20),
    width: buffer.readUInt32BE(16),
  };
}

describe('toShareSpeaker', () => {
  it('prefers ministry over role', () => {
    expect(
      toShareSpeaker({
        ministry: 'Truth For Life',
        name: 'Alistair Begg',
        role: 'Pastor',
      })
    ).toEqual({
      detail: 'Truth For Life',
      imageUrl: undefined,
      name: 'Alistair Begg',
    });
  });
});

describe('shareImage', () => {
  it('returns a 1200x630 png', async () => {
    const png = await pngBuffer(
      await shareImage({
        subtitle: '6 talks',
        title: 'Anxiety',
      })
    );

    expect(png.subarray(0, 8).equals(PNG_MAGIC)).toBe(true);
    expect(pngSize(png)).toEqual({ height: 630, width: 1200 });
  });

  it('keeps the canvas size when a speaker byline is present', async () => {
    const png = await pngBuffer(
      await shareImage({
        speaker: toShareSpeaker({
          imageUrl: '/images/speakers/voddie-baucham.jpg',
          ministry: 'Founders Ministries',
          name: 'Voddie Baucham',
          role: 'Pastor',
        }),
        title: 'Does the Bible Permit A Woman to Preach?',
      })
    );

    expect(pngSize(png)).toEqual({ height: 630, width: 1200 });
    expect(png.byteLength).toBeGreaterThan(8000);
  });

  it('keeps the canvas size for a speaker title card', async () => {
    const png = await pngBuffer(
      await shareImage({
        speaker: toShareSpeaker({
          imageUrl: '/images/speakers/alistair-begg.jpg',
          ministry: 'Truth For Life',
          name: 'Alistair Begg',
          role: 'Pastor',
        }),
        speakerPlacement: 'title',
        title: 'Alistair Begg',
      })
    );

    expect(pngSize(png)).toEqual({ height: 630, width: 1200 });
    expect(png.byteLength).toBeGreaterThan(8000);
  });
});
