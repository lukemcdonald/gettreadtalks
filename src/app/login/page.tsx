import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui';
import { LoginForm } from './_components/login-form';

export default function LoginPage() {
  return (
    <SidebarsLayout
      content={
        <Card className="m-auto w-full max-w-lg p-8">
          <LoginForm />
        </Card>
      }
      leftSidebar={
        <PageHeader
          description="Sign in to your account to access your saved content."
          title="Sign In"
        />
      }
      rightSidebar={<slot />}
    />
  );
}
