import type { RenderOptions } from '@/test';
import type { ComponentProps, FormEvent } from 'react';

import { useState } from 'react';

import { describe, expect, it, render, screen, vi, within } from '@/test';

import { FormSheet } from './form-sheet';

describe('FormSheet', () => {
  function setup(
    props: Partial<ComponentProps<typeof FormSheet>> = {},
    options?: RenderOptions
  ) {
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

  function setupNested() {
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

  it('keeps the outer form open when a nested form is cancelled', async () => {
    const { click } = setupNested();
    const nestedForm = screen.getByRole('dialog', { name: 'Add New Speaker' });

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
  });
});
