import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui';
import { formatUnsavedStatusNotice } from '@/lib/entities/status-prefill';

export function UnsavedStatusNotice({ status }: { status: StatusPrefill }) {
  return (
    <Alert data-testid="unsaved-status-notice" variant="info">
      <InfoIcon />
      <AlertDescription>{formatUnsavedStatusNotice(status)}</AlertDescription>
    </Alert>
  );
}
