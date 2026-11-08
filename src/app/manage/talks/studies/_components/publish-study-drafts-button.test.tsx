/// <reference types="vitest/globals" />

import type { Id } from '@/convex/_generated/dataModel';

import { describe, expect, it, render, screen } from '@/test';

import { PublishStudyDraftsConfirm } from './publish-study-drafts-button';

const refresh = vi.fn();
const onPublish = vi.fn();

vi.mock('@/features/talks/actions/publish-study-drafts', () => ({
  publishStudyDraftsAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

vi.mock('@/components/ui/primitives/toast', () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

const firstId = 'talkFeatures:one' as Id<'talkFeatures'>;
const secondId = 'talkFeatures:two' as Id<'talkFeatures'>;

describe('PublishStudyDraftsConfirm', () => {
  beforeEach(() => {
    onPublish.mockReset();
    refresh.mockReset();
  });

  it('hides when there are no eligible drafts', () => {
    render(<PublishStudyDraftsConfirm featureIds={[]} onPublish={onPublish} />);

    expect(
      screen.queryByTestId('publish-study-drafts')
    ).not.toBeInTheDocument();
  });

  it('does not publish when cancel is chosen', async () => {
    const { click } = render(
      <PublishStudyDraftsConfirm featureIds={[firstId]} onPublish={onPublish} />
    );

    await click(screen.getByTestId('publish-study-drafts'));
    expect(
      screen.getByRole('heading', { name: 'Publish 1 study draft?' })
    ).toBeVisible();

    await click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onPublish).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('publishes the confirmed snapshot, not later eligible ids', async () => {
    onPublish.mockResolvedValue({
      data: { published: 1, skipped: 0 },
      success: true,
    });

    const { click, rerender } = render(
      <PublishStudyDraftsConfirm featureIds={[firstId]} onPublish={onPublish} />
    );

    await click(screen.getByTestId('publish-study-drafts'));

    rerender(
      <PublishStudyDraftsConfirm
        featureIds={[firstId, secondId]}
        onPublish={onPublish}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Publish 1 study draft?' })
    ).toBeVisible();

    await click(screen.getByRole('button', { name: 'Publish' }));

    expect(onPublish).toHaveBeenCalledWith([firstId]);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
