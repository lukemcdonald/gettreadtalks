import { LoginForm } from '@/app/login/_components/login-form';
import { Card } from '@/components/ui';

export function LoginContent() {
  return (
    <Card className="m-auto w-full max-w-lg p-8">
      <LoginForm />
    </Card>
  );
}
