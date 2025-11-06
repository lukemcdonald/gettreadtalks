import type { Id } from '@/convex/_generated/dataModel';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SpeakerSelectFieldProps {
  defaultValue?: Id<'speakers'> | null;
  error?: string;
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
}

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
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
