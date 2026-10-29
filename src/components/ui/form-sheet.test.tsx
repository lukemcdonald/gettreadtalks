import type { FormSheetProps } from './form-sheet';
import type { RenderOptions } from '@/test';
import type { FormEvent } from 'react';

import { useState } from 'react';

import { describe, expect, it, render, screen, vi, within } from '@/test';

import { FormSheet } from './form-sheet';

describe('FormSheet', () => {
  function stubLgMediaQuery(matches: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
    }));
  }

  function setup(
    props: Partial<FormSheetProps> = {},
    options?: RenderOptions,
    matchesLg = false
  ) {
    stubLgMediaQuery(matchesLg);

    const {
      children = <p>Talk fields</p>,
      onSubmit = vi.fn(),
      ...delegated
    } = props;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      onSubmit(event);
    }

    return render(
      <FormSheet
        isPending={false}
        onOpenChange={vi.fn()}
        onSubmit={handleSubmit}
        open
        submitLabel="Create Talk"
        title="Add New Talk"
        {...delegated}
      >
        {children}
      </FormSheet>,
      options
    );
  }

  function setupNested(matchesLg = false) {
    stubLgMediaQuery(matchesLg);

    function NestedForms() {
      const [innerOpen, setInnerOpen] = useState(true);
      const [outerOpen, setOuterOpen] = useState(true);

      return (
        <FormSheet
          isPending={false}
          onOpenChange={setOuterOpen}
          onSubmit={(event) => {
            event.preventDefault();
          }}
          open={outerOpen}
          submitLabel="Create Talk"
          title="Add New Talk"
        >
          <p>Talk fields</p>
          <FormSheet
            isPending={false}
            onOpenChange={setInnerOpen}
            onSubmit={(event) => {
              event.preventDefault();
            }}
            open={innerOpen}
            submitLabel="Create Speaker"
            title="Add New Speaker"
          >
            <p>Speaker fields</p>
          </FormSheet>
        </FormSheet>
      );
    }

    return render(<NestedForms />);
  }

  it('renders the title, fields, and actions', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Add New Talk' })
    ).toBeInTheDocument();
    expect(screen.getByText('Talk fields')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Talk' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('closes when Cancel is pressed', async () => {
    const onOpenChange = vi.fn();
    const { click } = setup({ onOpenChange });

    await click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it.each([
    { label: 'below lg', matchesLg: false, side: 'down' },
    { label: 'at lg', matchesLg: true, side: 'right' },
  ] as const)('opens from the $side side $label', ({ matchesLg, side }) => {
    setup({}, undefined, matchesLg);

    expect(
      screen.getByRole('dialog', { name: 'Add New Talk' })
    ).toHaveAttribute('data-swipe-direction', side);
  });

  it.each([
    { hasBar: true, label: 'on mobile', matchesLg: false },
    { hasBar: false, label: 'on desktop', matchesLg: true },
  ] as const)('shows the drag bar only $label', ({ hasBar, matchesLg }) => {
    setup({}, undefined, matchesLg);

    const bar = document.querySelector('[data-slot="drawer-bar"]');

    if (hasBar) {
      expect(bar).toBeInTheDocument();
    } else {
      expect(bar).not.toBeInTheDocument();
    }
  });

  it.each([
    { label: 'on mobile', matchesLg: false },
    { label: 'on desktop', matchesLg: true },
  ] as const)(
    'keeps the outer form open when a nested form is cancelled $label',
    async ({ matchesLg }) => {
      const { click } = setupNested(matchesLg);
      const nestedForm = screen.getByRole('dialog', {
        name: 'Add New Speaker',
      });

      expect(
        screen.getByRole('dialog', { hidden: true, name: 'Add New Talk' })
      ).toBeInTheDocument();
      expect(nestedForm).toBeInTheDocument();

      await click(within(nestedForm).getByRole('button', { name: 'Cancel' }));

      expect(
        await screen.findByRole('heading', { name: 'Add New Talk' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Add New Speaker' })
      ).not.toBeInTheDocument();
    }
  );
});
