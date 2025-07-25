import type { Control, Path, FieldValues, RegisterOptions } from 'react-hook-form';
import { Controller, get } from 'react-hook-form';
import React from 'react';
import BaseSelectBox from './select-box';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectBoxControllerProps<T extends FieldValues>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'value' | 'onChange'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  options: SelectOption[];
}

const SelectBoxController = <T extends FieldValues>({
  control,
  name,
  rules,
  options,
  ...props
}: SelectBoxControllerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState: { errors } }) => {
        const error = get(errors, name) as { message?: string };
        return (
          <>
            <BaseSelectBox
              {...field}
              {...props}
              error={!!error?.message}
            >
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </BaseSelectBox>
            {error?.message && (
              <span className="text-red-500 text-xs mt-1 block">{error.message}</span>
            )}
          </>
        );
      }}
    />
  );
};

export default SelectBoxController;
