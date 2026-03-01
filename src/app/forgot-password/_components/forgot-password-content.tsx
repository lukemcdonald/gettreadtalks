import { Card } from '@/components/ui';
import { ForgotPasswordForm } from '@/features/users/components/forgot-password-form';

export function ForgotPasswordContent() {
  return (
    <Card className="m-auto w-full max-w-lg p-8">
      <ForgotPasswordForm />
    </Card>
  );
}
