/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen, within } from '@/test';

import { DeleteAccountForm } from './delete-account-form';

const { deleteAccount } = vi.hoisted(() => ({
  deleteAccount: vi.fn(),
}));

vi.mock('@/features/users/actions/delete-account', () => ({
  deleteAccount,
}));

vi.mock('@/components/ui/primitives/toast', () => ({
  toastManager: {
    add: vi.fn(),
  },
}));

describe('DeleteAccountForm', () => {
  async function openDialog() {
    const view = render(<DeleteAccountForm />);
    const [trigger] = screen.getAllByRole('button', { name: 'Delete Account' });

    await view.click(trigger);

    return view;
  }

  it('shows the server error instead of blaming the password', async () => {
    deleteAccount.mockResolvedValue({
      errors: { _form: 'Could not delete this account.' },
      success: false,
    });

    const { click, type } = await openDialog();
    const dialog = await screen.findByRole('alertdialog');

    await type(within(dialog).getByLabelText(/^Password/u), 'correct-horse');
    await click(within(dialog).getByRole('button', { name: 'Delete Account' }));

    expect(
      await screen.findByText('Could not delete this account.')
    ).toBeVisible();
    expect(screen.queryByText(/Check your password/u)).not.toBeInTheDocument();
  });

  it('clears the password and error when the dialog is closed and reopened', async () => {
    deleteAccount.mockResolvedValue({
      errors: { _form: 'Could not delete this account.' },
      success: false,
    });

    const { click, type } = await openDialog();
    const dialog = await screen.findByRole('alertdialog');
    const password = within(dialog).getByLabelText(/^Password/u);

    await type(password, 'stale-password');
    await click(within(dialog).getByRole('button', { name: 'Delete Account' }));
    expect(
      await screen.findByText('Could not delete this account.')
    ).toBeVisible();

    await click(within(dialog).getByRole('button', { name: 'Cancel' }));

    const [trigger] = screen.getAllByRole('button', { name: 'Delete Account' });
    await click(trigger);

    expect(screen.getByLabelText(/^Password/u)).toHaveValue('');
    expect(
      screen.queryByText('Could not delete this account.')
    ).not.toBeInTheDocument();
  });
});
