import type { TopicId, TopicListItem } from '@/features/topics/types';

import { useForm } from 'react-hook-form';
import { describe, expect, test, vi } from 'vitest';

import { render, screen } from '@/test/render';

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

const options = [
  { label: 'Grace', value: graceId },
  { label: 'Zion', value: zionId },
];

function TopicFieldForm() {
  const form = useForm<{ topicIds: TopicId[] }>({
    defaultValues: { topicIds: [] },
  });

  return (
    <form>
      <TopicField control={form.control} name="topicIds" topics={topics} />
    </form>
  );
}

describe('TopicFieldInput', () => {
  test('renders the label, description, and required marker', () => {
    render(
      <TopicFieldInput
        description="Pick the themes this talk covers."
        fieldName="topicIds"
        invalid={false}
        label="Topics"
        onTopicIdsChange={vi.fn()}
        options={options}
        required
        value={undefined}
      />
    );

    expect(screen.getByLabelText(/topics/iu)).toBeInTheDocument();
    expect(
      screen.getByText('Pick the themes this talk covers.')
    ).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search topics...')).toBeInTheDocument();
  });

  test('shows a field error and selected topic chips', () => {
    render(
      <TopicFieldInput
        errorMessage="Select at least one topic"
        fieldName="topicIds"
        invalid
        label="Topics"
        onTopicIdsChange={vi.fn()}
        options={options}
        value={[graceId]}
      />
    );

    expect(screen.getByText('Select at least one topic')).toBeInTheDocument();
    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});

describe('TopicField', () => {
  test('sorts topics alphabetically in the combobox', async () => {
    const { user } = render(<TopicFieldForm />);
    const input = screen.getByPlaceholderText('Search topics...');

    await user.click(input);

    const items = await screen.findAllByRole('option');

    expect(items.map((item) => item.textContent)).toEqual(['Grace', 'Zion']);
  });

  test('selects a topic and updates the chips', async () => {
    const { user } = render(<TopicFieldForm />);

    await user.click(screen.getByPlaceholderText('Search topics...'));
    await user.click(await screen.findByRole('option', { name: 'Grace' }));

    expect(screen.getByLabelText('Grace')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('Search topics...')
    ).not.toBeInTheDocument();
  });
});
