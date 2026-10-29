import { describe, expect, it } from 'vitest';

import { orderKeyPassages, parseScriptureRef } from './scriptureRef';

describe('parseScriptureRef', () => {
  it('parses a verse, a psalm range, and a numbered book', () => {
    expect(parseScriptureRef('Romans 8:28')).toEqual({
      osis: 'Rom.8.28',
      text: 'Romans 8:28',
    });
    expect(parseScriptureRef('Psalm 23:1-3')).toEqual({
      osis: 'Ps.23.1-Ps.23.3',
      text: 'Psalm 23:1-3',
    });
    expect(parseScriptureRef('1 Corinthians 15:3-4')).toEqual({
      osis: '1Cor.15.3-1Cor.15.4',
      text: '1 Corinthians 15:3-4',
    });
  });

  it('keeps osis null when the text is not a reference', () => {
    expect(parseScriptureRef('the gospel')).toEqual({
      osis: null,
      text: 'the gospel',
    });
  });
});

describe('orderKeyPassages', () => {
  it('moves the main text first and keeps the rest in order', () => {
    expect(
      orderKeyPassages(
        [
          {
            note: 'The older brother stays outside.',
            reference: parseScriptureRef('Luke 15:25-32'),
          },
          {
            note: 'The father runs to the returning son.',
            reference: parseScriptureRef('Luke 15:11-32'),
          },
          {
            note: 'Grace is not a wage.',
            reference: parseScriptureRef('Romans 4:4-5'),
          },
        ],
        'Luke 15:11-32'
      ).map((passage) => passage.reference.text)
    ).toEqual(['Luke 15:11-32', 'Luke 15:25-32', 'Romans 4:4-5']);
  });
});
