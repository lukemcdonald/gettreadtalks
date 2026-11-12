/// <reference types="vitest/globals" />

import type * as Ui from '@/components/ui';

import { SpeakersSidebar } from '@/app/speakers/_components/speakers-sidebar';
import { describe, expect, it, render, screen } from '@/test';

vi.mock('next/navigation', () => ({
  usePathname: () => '/speakers',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/components/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof Ui>();

  return {
    ...actual,
    SelectFilter: ({
      options,
    }: {
      options: { label: string; value: string }[];
    }) => (
      <ul>
        {options.map((option) => (
          <li key={option.value}>{option.label}</li>
        ))}
      </ul>
    ),
  };
});

describe('SpeakersSidebar', () => {
  it('lists every provided role, not only roles on the current page', () => {
    render(<SpeakersSidebar roles={['Author', 'Theologian']} />);

    expect(screen.getAllByText('Author').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Theologian').length).toBeGreaterThan(0);
    expect(screen.queryByText('Pastor')).not.toBeInTheDocument();
  });
});
