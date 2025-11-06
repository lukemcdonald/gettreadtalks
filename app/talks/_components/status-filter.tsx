'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

type StatusFilter = 'all' | 'published' | 'backlog' | 'archived';

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = (searchParams.get('status') as StatusFilter) || 'all';

  const handleStatusChange = (status: StatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    router.push(`/talks${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleStatusChange('all')}
        size="sm"
        variant={currentStatus === 'all' ? 'default' : 'outline'}
      >
        All
      </Button>
      <Button
        onClick={() => handleStatusChange('published')}
        size="sm"
        variant={currentStatus === 'published' ? 'default' : 'outline'}
      >
        Published
      </Button>
      <Button
        onClick={() => handleStatusChange('backlog')}
        size="sm"
        variant={currentStatus === 'backlog' ? 'default' : 'outline'}
      >
        Backlog
      </Button>
      <Button
        onClick={() => handleStatusChange('archived')}
        size="sm"
        variant={currentStatus === 'archived' ? 'default' : 'outline'}
      >
        Archived
      </Button>
    </div>
  );
}
