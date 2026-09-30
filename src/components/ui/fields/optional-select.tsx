'use client';

import { Field } from '../primitives/field';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';
import { FieldLabel } from './field-label';

const NONE_VALUE = '';

function toOptionalValue<T extends string>(value: string | null | undefined) {
  if (!value) {
    return;
  }

  return value as T;
}

interface OptionalSelectProps<T extends string> {
  items: { label: string; value: T }[];
  label: string;
  name: string;
  noneLabel?: string;
  onValueChange: (value: T | undefined) => void;
  value?: T;
}

export function OptionalSelect<T extends string>({
  items,
  label,
  name,
  noneLabel = 'None',
  onValueChange,
  value,
}: OptionalSelectProps<T>) {
  const options = [{ label: noneLabel, value: NONE_VALUE }, ...items];

  return (
    <Field name={name}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select
        items={options}
        name={name}
        onValueChange={(nextValue) => {
          onValueChange(toOptionalValue<T>(nextValue));
        }}
        value={value ?? NONE_VALUE}
      >
        <SelectTrigger id={name} size="lg">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}
