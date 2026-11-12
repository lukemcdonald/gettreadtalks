/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen } from '@/test';

import { Link } from './link';

const { prefetch } = vi.hoisted(() => ({
  prefetch: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch,
  }),
}));

describe('Link', () => {
  it('prefetches an internal path on hover', async () => {
    const { hover } = render(<Link href="/talks">Talks</Link>);

    expect(prefetch).not.toHaveBeenCalled();

    await hover(screen.getByRole('link', { name: 'Talks' }));

    expect(prefetch).toHaveBeenCalledWith(
      '/talks',
      expect.objectContaining({ kind: 'full' })
    );
  });

  it('does not prefetch an external url on hover', async () => {
    const { hover } = render(
      <Link href="https://www.crossway.org/bibles/">Bibles</Link>
    );

    await hover(screen.getByRole('link', { name: 'Bibles' }));

    expect(prefetch).not.toHaveBeenCalled();
  });
});
