'use client';

import type { ChangeEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { DropdownSelect, type DropdownSelectProps } from '../dropdown-select';

type FormDropdownSelectProps = Omit<DropdownSelectProps, 'error'> & {
  name: string;
  error?: string;
  onSelectChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export function FormDropdownSelect({
  name,
  error: customError,
  onSelectChange,
  ref,
  ...dropdownSelectProps
}: FormDropdownSelectProps) {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext || {};

  const fieldError = errors[name];
  const errorMessage =
    customError || (fieldError?.message as string) || undefined;

  if (!formContext) {
    return (
      <DropdownSelect ref={ref} error={errorMessage} {...dropdownSelectProps} />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DropdownSelect
          {...dropdownSelectProps}
          {...field}
          onChange={(e) => {
            field.onChange(e);
            onSelectChange?.(e);
          }}
          error={errorMessage}
        />
      )}
    />
  );
}
