import type { TopicId, TopicListItem } from '@/features/topics/types';
import type { RenderOptions } from '@/test';
import type { ComponentProps } from 'react';

import { useForm } from 'react-hook-form';

import { describe, expect, it, render, screen, vi } from '@/test';

import { TopicField } from './topic-field';
import { TopicFieldInput } from './topic-field-input';

describe('TopicFieldInput', () => {
  const MOCK_GRACE_ID = 'topics:grace' as TopicId;
  const MOCK_TOPIC_OPTIONS = [
    { label: 'Grace', value: MOCK_GRACE_ID },
    { label: 'Zion', value: 'topics:zion' as TopicId },
  ];

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
        options={MOCK_TOPIC_OPTIONS}
        value={undefined}
        {...props}
      />,
      options
    );
  }

  it('renders the label, description, and required marker', () => {
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

  it('shows a field error and selected topic chips', () => {
    setup({
      errorMessage: 'Select at least one topic',
      invalid: true,
      value: [MOCK_GRACE_ID],
    });

    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});

describe('TopicField', () => {
  const MOCK_TOPICS: TopicListItem[] = [
    {
      _id: 'topics:zion' as TopicId,
      slug: 'zion',
      title: 'Zion',
    },
    {
      _id: 'topics:grace' as TopicId,
      slug: 'grace',
      title: 'Grace',
    },
  ];

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
            topics={MOCK_TOPICS}
            {...props}
          />
        </form>
      );
    }

    return render(<TopicFieldForm />, options);
  }

  it('sorts topics alphabetically in the combobox', async () => {
    const { user } = setup();
    const input = screen.getByPlaceholderText('Search topics...');

    await user.click(input);

    const items = await screen.findAllByRole('option');

    expect(items.map((item) => item.textContent)).toEqual(['Grace', 'Zion']);
  });

  it('selects a topic and updates the chips', async () => {
    const { user } = setup();

    await user.click(screen.getByPlaceholderText('Search topics...'));
    await user.click(await screen.findByRole('option', { name: 'Grace' }));

    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});
