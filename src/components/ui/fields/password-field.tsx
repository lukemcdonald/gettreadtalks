'use client';

import type { Control, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel, Input } from '@/components/ui';

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
}

export function PasswordField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  placeholder,
  required,
  rules,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          dirty={fieldState.isDirty}
          invalid={fieldState.invalid}
          name={field.name}
          touched={fieldState.isTouched}
        >
          <FieldLabel required={required}>{label}</FieldLabel>
          {!!description && <FieldDescription>{description}</FieldDescription>}
          <div className="relative">
            <Input
              aria-invalid={fieldState.invalid}
              className="**:data-[slot=input]:pr-10"
              placeholder={placeholder}
              required={required}
              size="lg"
              type={showPassword ? 'text' : 'password'}
              {...field}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center border-l border-l-border px-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              type="button"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {!!fieldState.error && <FieldError match>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
      rules={rules}
    />
  );
}
