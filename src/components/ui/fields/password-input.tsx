'use client';

import type { InputProps } from '@/components/ui/primitives/input';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/primitives/input';
import { cn } from '@/utils';

export type PasswordInputProps = Omit<InputProps, 'type'>;

export function PasswordInput({ className, ...delegated }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        className={cn('w-full **:data-[slot=input]:pr-10', className)}
        size="lg"
        type={showPassword ? 'text' : 'password'}
        {...delegated}
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
  );
}
