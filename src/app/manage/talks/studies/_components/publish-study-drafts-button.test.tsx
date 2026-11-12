/// <reference types="vitest/globals" />

import type { Id } from '@/convex/_generated/dataModel';

import { toastManager } from '@/components/ui';
import { reportUnexpectedError } from '@/services/errors';
import { describe, expect, it, render, screen, waitFor } from '@/test';

import { PublishStudyDraftsConfirm } from './publish-study-drafts-button';

const { onPublish, refresh } = vi.hoisted(() => ({
  onPublish: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('@/features/talks/actions/publish-study-drafts', () => ({
  publishStudyDraftsAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: vi.fn(),
    refresh,
  }),
}));

vi.mock('@/services/errors', () => ({
  reportUnexpectedError: vi.fn(() => 'Something went wrong. Please try again.'),
}));

const firstId = 'talkFeatures:one' as Id<'talkFeatures'>;
const secondId = 'talkFeatures:two' as Id<'talkFeatures'>;

async function openConfirm(featureIds: Id<'talkFeatures'>[] = [firstId]) {
  const view = render(
    <PublishStudyDraftsConfirm featureIds={featureIds} onPublish={onPublish} />
  );

  await view.click(screen.getByTestId('publish-study-drafts'));

  return view;
}

describe('PublishStudyDraftsConfirm', () => {
  beforeEach(() => {
    onPublish.mockReset();
    refresh.mockReset();
    vi.mocked(reportUnexpectedError).mockClear();
    vi.spyOn(toastManager, 'add').mockReturnValue('toast');
  });

  afterEach(() => {
    vi.mocked(toastManager.add).mockRestore();
  });

  it('hides when there are no eligible drafts', () => {
    render(<PublishStudyDraftsConfirm featureIds={[]} onPublish={onPublish} />);

    expect(
      screen.queryByTestId('publish-study-drafts')
    ).not.toBeInTheDocument();
  });

  it('shows the live eligible count on the trigger', () => {
    render(
      <PublishStudyDraftsConfirm featureIds={[firstId]} onPublish={onPublish} />
    );

    expect(screen.getByTestId('publish-study-drafts')).toHaveTextContent(
      'Publish all study drafts (1)'
    );
  });

  it('does not publish when cancel is chosen', async () => {
    const { click } = await openConfirm();

    expect(
      screen.getByRole('heading', { name: 'Publish 1 study draft?' })
    ).toBeVisible();

    await click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onPublish).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('publishes the confirmed snapshot and reports skipped results', async () => {
    onPublish.mockResolvedValue({
      data: { published: 1, skipped: 2 },
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
    expect(toastManager.add).toHaveBeenCalledWith({
      description: '2 studies were skipped.',
      title: 'Published 1 study',
      type: 'success',
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('disables duplicate submits while publish is pending', async () => {
    const pending = Promise.withResolvers<{
      data: { published: number; skipped: number };
      success: true;
    }>();
    onPublish.mockReturnValue(pending.promise);

    const { click } = await openConfirm();
    const publish = click(screen.getByTestId('publish-study-drafts-confirm'));

    await waitFor(() => {
      expect(screen.getByTestId('publish-study-drafts-confirm')).toBeDisabled();
    });

    expect(onPublish).toHaveBeenCalledTimes(1);

    pending.resolve({
      data: { published: 1, skipped: 0 },
      success: true,
    });
    await publish;
  });

  it('shows an error toast and stays put when publish fails', async () => {
    onPublish.mockResolvedValue({
      errors: { _form: 'Admin access required' },
      success: false,
    });

    const { click } = await openConfirm();
    await click(screen.getByRole('button', { name: 'Publish' }));

    expect(toastManager.add).toHaveBeenCalledWith({
      description: 'Admin access required',
      title: 'Could not publish study drafts',
      type: 'error',
    });
    expect(refresh).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
  });

  it('reports unexpected errors and allows retry', async () => {
    onPublish.mockRejectedValueOnce(new Error('network down'));
    onPublish.mockResolvedValueOnce({
      data: { published: 1, skipped: 0 },
      success: true,
    });

    const { click } = await openConfirm();
    await click(screen.getByRole('button', { name: 'Publish' }));

    expect(reportUnexpectedError).toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();

    await click(screen.getByRole('button', { name: 'Publish' }));

    expect(onPublish).toHaveBeenCalledTimes(2);
    expect(toastManager.add).toHaveBeenLastCalledWith({
      description: undefined,
      title: 'Published 1 study',
      type: 'success',
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
