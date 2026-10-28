/// <reference types="vitest/globals" />

import { MediaCardTitle } from '@/components/media-card';
import { describe, expect, it, render, screen } from '@/test';

import { AlphabeticalGrid } from './alphabetical-grid';

describe('AlphabeticalGrid', () => {
  it('nests card titles one level below the letter heading', () => {
    render(
      <AlphabeticalGrid
        groups={[
          {
            items: [<MediaCardTitle key="john">John Doe</MediaCardTitle>],
            letter: 'D',
            range: 'D-F',
          },
        ]}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'D D-F' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 3, name: 'John Doe' })
    ).toBeVisible();
  });
});
