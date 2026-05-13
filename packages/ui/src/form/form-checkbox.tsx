'use client';

import { useFormContext, Controller } from 'react-hook-form';

import { Checkbox, type CheckboxProps } from '../checkbox';

type FormCheckboxProps = Omit<
  CheckboxProps,
  'error' | 'checked' | 'defaultChecked'
> & {
  name: string;
  error?: string;
};

/**
 * FormCheckbox — Checkbox integrated with React Hook Form (boolean fields).
 * Ref is a normal prop on {@link Checkbox} (React 19).
 */
export function FormCheckbox({
  name,
  error: customError,
  ref,
  ...checkboxProps
}: FormCheckboxProps) {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext || {};

  const fieldError = errors[name];
  const errorMessage =
    customError || (fieldError?.message as string) || undefined;

  if (!formContext) {
    return <Checkbox ref={ref} error={errorMessage} {...checkboxProps} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...checkboxProps}
          name={field.name}
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          ref={field.ref}
          error={errorMessage}
        />
      )}
    />
  );
}
