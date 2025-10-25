'use client';

import { useEffect } from 'react';

import { Authenticated, Unauthenticated } from 'convex/react';
import { useRouter } from 'next/navigation';

import { AccountContent } from './_components/account-content';

export default function AccountPage() {
  return (
    <>
      <Authenticated>
        <AccountContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </>
  );
}

function UnauthenticatedContent() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return <div>Redirecting to login...</div>;
}
