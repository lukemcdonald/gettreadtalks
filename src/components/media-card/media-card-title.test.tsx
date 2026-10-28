/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen } from '@/test';

import { MediaCardHeadingLevel, MediaCardTitle } from './media-card-title';

describe('MediaCardTitle', () => {
  it('defaults to an h2', () => {
    render(<MediaCardTitle>Sample talk</MediaCardTitle>);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Sample talk' })
    ).toBeVisible();
  });

  it('renders the given heading level', () => {
    render(<MediaCardTitle level={3}>Sample talk</MediaCardTitle>);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Sample talk' })
    ).toBeVisible();
  });

  it('uses the parent heading level', () => {
    render(
      <MediaCardHeadingLevel level={3}>
        <MediaCardTitle>Sample talk</MediaCardTitle>
      </MediaCardHeadingLevel>
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Sample talk' })
    ).toBeVisible();
  });
});
