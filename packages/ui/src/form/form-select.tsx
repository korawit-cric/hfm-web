'use client';

import { forwardRef, type ChangeEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Select, type SelectProps } from '../select';

type FormSelectProps = Omit<SelectProps, 'error'> & {
  name: string;
  error?: string;
  /** Called after React Hook Form updates the field (e.g. sync dependent fields). */
  onSelectChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * FormSelect — Select integrated with React Hook Form (same pattern as {@link FormInput}).
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ name, error: customError, onSelectChange, ...selectProps }, ref) => {
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
  },
);

FormSelect.displayName = 'FormSelect';
