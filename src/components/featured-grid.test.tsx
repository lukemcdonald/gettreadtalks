/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen } from '@/test';

import { FeaturedGrid } from './featured-grid';

describe('FeaturedGrid', () => {
  it('uses a section heading for the group title', () => {
    render(
      <FeaturedGrid title="Talks">
        <p>A talk</p>
      </FeaturedGrid>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Talks' })
    ).toBeVisible();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
