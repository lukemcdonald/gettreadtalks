import { SpeakersTable } from '@/features/speakers/components/speakers-table/speakers-table';
import { getSpeakersAdmin } from '@/features/speakers/queries/get-speakers-admin';

export async function SpeakersContent() {
  const { speakers } = await getSpeakersAdmin();

  return <SpeakersTable speakers={speakers} />;
}
