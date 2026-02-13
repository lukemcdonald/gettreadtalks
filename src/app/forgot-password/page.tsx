import { ForgotPasswordContent } from '@/app/forgot-password/_components/forgot-password-content';
import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';

export default function ForgotPasswordPage() {
  return (
    <SidebarsLayout
      content={<ForgotPasswordContent />}
      leftSidebar={
        <PageHeader
          description="Enter your email and we'll send you a reset link."
          title="Forgot password"
        />
      }
      rightSidebar={<slot />}
    />
  );
}
