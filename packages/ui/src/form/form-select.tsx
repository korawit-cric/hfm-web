'use client';

import type { ChangeEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Select, type SelectProps } from '../select';

type FormSelectProps = Omit<SelectProps, 'error'> & {
  name: string;
  error?: string;
  onSelectChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * FormSelect — Select integrated with React Hook Form.
 * Ref is a normal prop on {@link Select} (React 19).
 */
export function FormSelect({
  name,
  error: customError,
  onSelectChange,
  ref,
  ...selectProps
}: FormSelectProps) {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext || {};

  const fieldError = errors[name];
  const errorMessage =
    customError || (fieldError?.message as string) || undefined;

  if (!formContext) {
    return <Select ref={ref} error={errorMessage} {...selectProps} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...selectProps}
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
