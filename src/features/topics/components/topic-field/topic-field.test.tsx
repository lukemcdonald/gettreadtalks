import type { TopicId, TopicListItem } from '@/features/topics/types';
import type { RenderOptions } from '@/test/render';
import type { ComponentProps } from 'react';

import { useForm } from 'react-hook-form';
import { describe, expect, test, vi } from 'vitest';

import { render, screen, userEvent } from '@/test/render';

import { TopicField } from './topic-field';
import { TopicFieldInput } from './topic-field-input';

const graceId = 'topics:grace' as TopicId;
const zionId = 'topics:zion' as TopicId;

const topics: TopicListItem[] = [
  {
    _id: zionId,
    slug: 'zion',
    title: 'Zion',
  },
  {
    _id: graceId,
    slug: 'grace',
    title: 'Grace',
  },
];

const topicOptions = [
  { label: 'Grace', value: graceId },
  { label: 'Zion', value: zionId },
];

describe('TopicFieldInput', () => {
  function setup(
    props: Partial<ComponentProps<typeof TopicFieldInput>> = {},
    options?: RenderOptions
  ) {
    return render(
      <TopicFieldInput
        fieldName="topicIds"
        invalid={false}
        label="Topics"
        onTopicIdsChange={vi.fn()}
        options={topicOptions}
        value={undefined}
        {...props}
      />,
      options
    );
  }

  test('renders the label, description, and required marker', () => {
    setup({
      description: 'Pick the themes this talk covers.',
      required: true,
    });

    expect(screen.getByLabelText(/topics/iu)).toBeInTheDocument();
    expect(
      screen.getByText('Pick the themes this talk covers.')
    ).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search topics...')).toBeInTheDocument();
  });

  test('shows a field error and selected topic chips', () => {
    setup({
      errorMessage: 'Select at least one topic',
      invalid: true,
      value: [graceId],
    });

    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});

describe('TopicField', () => {
  function setup(
    props: {
      description?: string;
      label?: string;
      required?: boolean;
      topics?: TopicListItem[];
    } = {},
    options?: RenderOptions
  ) {
    function TopicFieldForm() {
      const form = useForm<{ topicIds: TopicId[] }>({
        defaultValues: { topicIds: [] },
      });

      return (
        <form>
          <TopicField
            control={form.control}
            name="topicIds"
            topics={topics}
            {...props}
          />
        </form>
      );
    }

    return {
      user: userEvent.setup(),
      ...render(<TopicFieldForm />, options),
    };
  }

  test('sorts topics alphabetically in the combobox', async () => {
    const { user } = setup();
    const input = screen.getByPlaceholderText('Search topics...');

    await user.click(input);

    const items = await screen.findAllByRole('option');

    expect(items.map((item) => item.textContent)).toEqual(['Grace', 'Zion']);
  });

  test('selects a topic and updates the chips', async () => {
    const { user } = setup();

    await user.click(screen.getByPlaceholderText('Search topics...'));
    await user.click(await screen.findByRole('option', { name: 'Grace' }));

    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});
