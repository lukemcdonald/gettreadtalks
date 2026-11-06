/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen, within } from '@/test';

import { ComboboxMultiFilter } from './combobox-multi-filter';
import { MobileFilterDrawer } from './mobile-filter-drawer';

vi.mock('next/navigation', () => ({
  usePathname: () => '/topics',
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const topicOptions = [
  { label: 'Faith', value: 'faith' },
  { label: 'Grace', value: 'grace' },
  { label: 'Hope', value: 'hope' },
  { label: 'Love', value: 'love' },
];

describe('MobileFilterDrawer', () => {
  function setup() {
    return render(
      <MobileFilterDrawer onOpenChange={vi.fn()} open>
        <ComboboxMultiFilter
          label="Topics"
          name="topics"
          options={topicOptions}
          placeholder="All Topics"
        />
      </MobileFilterDrawer>
    );
  }

  it('keeps the sheet still when the topic list opens outside it', async () => {
    const { click } = setup();
    const drawer = screen.getByTestId('mobile-filter-drawer');
    const heightBefore = drawer.getBoundingClientRect().height;

    await click(screen.getByRole('combobox', { name: 'Topics' }));

    const listbox = await screen.findByRole('listbox');

    expect(drawer.contains(listbox)).toBe(false);
    expect(drawer.getBoundingClientRect().height).toBe(heightBefore);
    expect(
      within(listbox).getByRole('option', { name: 'Faith' })
    ).toBeInTheDocument();
  });
});
