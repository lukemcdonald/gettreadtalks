'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';
import { FormField } from './form-field';

interface SelectOption {
  label: string;
  value: string;
}

function toSelectValue(value: string | null | undefined) {
  return value ?? '';
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  onChange?: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
}

/**
 * Generic reusable select field component that wraps Controller + Field + Select.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <SelectField
 *   control={form.control}
 *   options={[
 *     { label: 'Select an option', value: '' },
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]}
 *   label="Select Option"
 *   name="option"
 *   required
 * />
 * ```
 */
export function SelectField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  onChange,
  options,
  required,
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      description={description}
      label={label}
      name={name}
      required={required}
    >
      {(field, fieldState) => (
        <Select
          items={options}
          name={field.name}
          onValueChange={(nextValue) => {
            const value = toSelectValue(nextValue);
            field.onChange(value);
            onChange?.(value);
          }}
          required={required}
          value={toSelectValue(field.value)}
        >
          <SelectTrigger
            aria-invalid={fieldState.invalid}
            id={field.name}
            size="lg"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
    </FormField>
  );
}
