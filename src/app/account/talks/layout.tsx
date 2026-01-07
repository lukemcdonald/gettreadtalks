import { requireAdminUser } from '@/services/auth/server';

export default async function TalksLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return <>{children}</>;
}
