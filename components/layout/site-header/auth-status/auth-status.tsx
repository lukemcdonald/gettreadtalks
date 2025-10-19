'use client';

import { AuthLoading, Authenticated, Unauthenticated } from 'convex/react';

import AuthenticatedContent from './authenticated-content';
import UnauthenticatedContent from './unauthenticated-content';

function AuthStatus() {
  return (
    <>
      <AuthLoading>
        <div className="inline-flex gap-2 items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <span>⚪</span>
          <span className="text-gray-600 dark:text-gray-300">Checking auth...</span>
        </div>
      </AuthLoading>

      <Authenticated>
        <AuthenticatedContent />
      </Authenticated>

      <Unauthenticated>
        <UnauthenticatedContent />
      </Unauthenticated>
    </>
  );
}

export default AuthStatus;
