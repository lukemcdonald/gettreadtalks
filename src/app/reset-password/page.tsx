import { redirect } from 'next/navigation';

import { ResetPasswordForm } from '@/app/reset-password/_components/reset-password-form';
import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/forgot-password');
  }

  return (
    <SidebarsLayout
      content={
        <Card className="m-auto w-full max-w-lg p-8">
          <ResetPasswordForm token={token} />
        </Card>
      }
      leftSidebar={
        <PageHeader description="Choose a new password for your account." title="Reset password" />
      }
      rightSidebar={<slot />}
    />
  );
}
