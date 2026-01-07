'use client';

import { Checkbox, Label } from '@/components/ui';

type CheckboxFilterProps = {
  checked: boolean;
  label: string;
  name: string;
  onCheckedChange: (checked: boolean) => void;
};

export function CheckboxFilter({ checked, label, name, onCheckedChange }: CheckboxFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} id={name} onCheckedChange={onCheckedChange} />
      <Label className="cursor-pointer" htmlFor={name}>
        {label}
      </Label>
    </div>
  );
}
