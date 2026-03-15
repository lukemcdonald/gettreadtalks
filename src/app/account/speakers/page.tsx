import { SpeakersContent } from '@/app/account/speakers/_components/speakers-content';
import { PageHeader } from '@/components/page-header';
import { NewSpeakerButton } from '@/features/speakers/components/new-speaker-button';

export default async function AccountSpeakersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader description="Manage all speakers" title="Manage Speakers" />
        <NewSpeakerButton />
      </div>
      <SpeakersContent />
    </div>
  );
}
