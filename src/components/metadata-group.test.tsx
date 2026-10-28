/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen } from '@/test';

import { MetadataGroup } from './metadata-group';

describe('MetadataGroup', () => {
  it('labels a region without using a heading', () => {
    render(
      <MetadataGroup label="About">
        <p>Summary</p>
      </MetadataGroup>
    );

    expect(screen.getByRole('region', { name: 'About' })).toBeVisible();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
