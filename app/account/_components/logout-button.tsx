'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';
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
    <Button variant="error" onClick={handleLogout} type="button">
      Logout
    </Button>
  );
}

export default LogoutButton;
