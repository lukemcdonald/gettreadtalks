import { redirect } from 'next/navigation';

import { buildAdminListPath } from '@/lib/entities/paths';

export default function ManagePage() {
  redirect(buildAdminListPath('talks'));
}
