import { describe, expect, it, render, screen } from '@/test';

import { SearchCommand, SearchCommandField } from './search-command';

describe('SearchCommandField', () => {
  function setup() {
    return render(
      <SearchCommand groups={[]} onInputValueChange={() => {}} value="">
        <SearchCommandField isLoading={false} />
      </SearchCommand>
    );
  }

  it('focuses the input when the search icon is pressed', async () => {
    const { click } = setup();
    const input = screen.getByRole('combobox', {
      name: 'Search talks, speakers, topics, and clips',
    });
    const field = input.closest('label');

    expect(field).toBeInstanceOf(HTMLLabelElement);

    if (!(field instanceof HTMLLabelElement)) {
      throw new Error('Search field should wrap the input in a label');
    }

    const icon = field.querySelector('svg');

    expect(icon).toBeInstanceOf(SVGElement);

    if (!(icon instanceof SVGElement)) {
      throw new Error('Search field should include a search icon');
    }

    input.blur();
    await click(icon);

    expect(input).toHaveFocus();
  });
});
