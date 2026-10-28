/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen } from '@/test';

import { MediaCardTitle } from './media-card-title';

describe('MediaCardTitle', () => {
  it('is not a heading', () => {
    render(<MediaCardTitle>Sample talk</MediaCardTitle>);

    expect(screen.getByText('Sample talk')).toBeVisible();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
