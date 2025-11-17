import type { Speaker, SpeakerId } from '@/lib/features/speakers/types';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SpeakerSelectFieldProps = {
  defaultValue?: SpeakerId | null;
  error?: string;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName'>[];
};

export function SpeakerSelectField({ defaultValue, error, speakers }: SpeakerSelectFieldProps) {
  const items = speakers.map((speaker) => ({
    label: `${speaker.firstName} ${speaker.lastName}`,
    value: speaker._id,
  }));

  return (
    <div>
      <Label htmlFor="speakerId">
        Speaker <span className="text-destructive">*</span>
      </Label>
      <Select defaultValue={defaultValue ?? undefined} items={items} name="speakerId" required>
        <SelectTrigger aria-invalid={error ? 'true' : undefined} id="speakerId">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {speakers.map((speaker) => (
            <SelectItem key={speaker._id} value={speaker._id}>
              {speaker.firstName} {speaker.lastName}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      {error && <p className="mt-1 text-destructive text-sm">{error}</p>}
    </div>
  );
}
