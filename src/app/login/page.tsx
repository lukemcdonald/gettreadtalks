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
          description="Sign in or create a free account to save your favorite content."
          title="Login"
        />
      }
      rightSidebar={<slot />}
    />
  );
}
