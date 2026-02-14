'use client';

import { LoginContent } from '@/app/login/_components/login-content';
import { SidebarsLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';

export default function LoginPage() {
  return (
    <SidebarsLayout
      content={<LoginContent />}
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
