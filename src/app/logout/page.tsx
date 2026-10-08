import { Suspense } from 'react';

import { LogoutContent } from '@/app/logout/_components/logout-content';

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutContent />
    </Suspense>
  );
}
