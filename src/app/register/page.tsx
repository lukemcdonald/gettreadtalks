import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui';
import { RegisterForm } from './_components/register-form';

export default function RegisterPage() {
  return (
    <SidebarsLayout
      content={
        <Card className="m-auto w-full max-w-lg p-8">
          <RegisterForm />
        </Card>
      }
      leftSidebar={
        <PageHeader
          description="Create a free account to save your favorite content."
          title="Create Account"
        />
      }
      rightSidebar={<slot />}
    />
  );
}
