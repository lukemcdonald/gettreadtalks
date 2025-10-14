'use client';

import { Authenticated, Unauthenticated } from 'convex/react';
import Link from 'next/link';

import MainLayout from '@/components/layout/main-layout';
import { useCurrentUser } from '@/lib/features/users/hooks';

export default function Home() {
  return (
    <MainLayout>
      <Authenticated>
        <AuthenticatedHomeContent />
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedHomeContent />
      </Unauthenticated>
    </MainLayout>
  );
}

const AuthenticatedHomeContent = () => {
  const { data: user } = useCurrentUser();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover inspiring talks and clips from TREAD Talks
        </p>
      </div>

      <div className="text-center">
        <Link
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          href="/account"
        >
          View Account
        </Link>
      </div>
    </div>
  );
};

const UnauthenticatedHomeContent = () => (
  <div className="text-center space-y-8">
    <div>
      <h1 className="text-4xl font-bold mb-4">Greetings!</h1>
      <Link href="/login">Login</Link>
    </div>
  </div>
);
