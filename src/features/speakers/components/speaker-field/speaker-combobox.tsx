'use client';

import type { SpeakerFieldValue } from './speaker-field-utils';
import type { SpeakerId, SpeakerListItem } from '@/features/speakers/types';
import type { ControllerFieldState } from 'react-hook-form';

import { PlusIcon } from 'lucide-react';

import {
  Button,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxPopup,
} from '@/components/ui';

import { SpeakerComboboxItem } from './speaker-combobox-item';
import {
  filterSpeakerByQuery,
  getSpeakerItemLabel,
} from './speaker-field-utils';

interface SpeakerComboboxProps {
  field: SpeakerFieldValue;
  fieldState: ControllerFieldState;
  onAddSpeaker: () => void;
  speakers: SpeakerListItem[];
}

export function SpeakerCombobox({
  field,
  fieldState,
  onAddSpeaker,
  speakers,
}: SpeakerComboboxProps) {
  return (
    <Combobox
      filter={(itemValue: SpeakerId, query: string) =>
        filterSpeakerByQuery(speakers, itemValue, query)
      }
      items={speakers.map((speaker) => speaker._id)}
      itemToStringLabel={(itemValue: SpeakerId) =>
        getSpeakerItemLabel(speakers, itemValue)
      }
      onValueChange={(selected: SpeakerId | null) => {
        field.onChange(selected ?? undefined);
      }}
      value={field.value || null}
    >
      <ComboboxInput
        aria-invalid={fieldState.invalid}
        id={field.name}
        placeholder="Search speakers..."
        showClear
      />
      <ComboboxPopup>
        <ComboboxEmpty>
          <Button
            className="w-full justify-start"
            onClick={onAddSpeaker}
            type="button"
            variant="ghost"
          >
            <PlusIcon className="size-4" />
            <span>Add New Speaker</span>
          </Button>
        </ComboboxEmpty>
        <ComboboxList>
          {(itemValue: SpeakerId) => (
            <SpeakerComboboxItem speakers={speakers} value={itemValue} />
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
