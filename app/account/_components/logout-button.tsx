'use client';

import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/services/auth/client';
import { captureException } from '@/lib/services/errors/client';

function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      captureException(error, {
        fingerprint: ['auth', 'logout', 'client-error'],
      });
    }
  };

  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
      onClick={handleLogout}
      type="button"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
