import { ForgotPasswordForm } from '@/app/forgot-password/_components/forgot-password-form';
import { Card } from '@/components/ui';

export function ForgotPasswordContent() {
  return (
    <Card className="m-auto w-full max-w-lg p-8">
      <ForgotPasswordForm />
    </Card>
  );
}
