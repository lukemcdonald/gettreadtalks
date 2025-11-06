import Link from 'next/link';

import { MainLayout } from '@/components/main-layout';
import { Button } from '@/components/ui/button';
import { getAuthUser } from '@/lib/services/auth/server';

export default async function TalksPage() {
  const user = await getAuthUser();

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Talks</h1>
        {user && (
          <Button asChild>
            <Link href="/talks/new">New Talk</Link>
          </Button>
        )}
      </div>
    </MainLayout>
  );
}
