import { describe, expect, it, render, screen } from '@/test';

import { HeaderSearchFallback } from './header-search';

describe('HeaderSearchFallback', () => {
  it('does not expose the live search control test id', () => {
    render(<HeaderSearchFallback />);

    expect(screen.queryByTestId('search-cta')).not.toBeInTheDocument();
  });
});
