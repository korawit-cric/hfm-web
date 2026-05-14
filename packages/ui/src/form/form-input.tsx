'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Input, type InputProps } from '../input';

type FormInputProps = Omit<InputProps, 'error'> & {
  name: string;
  error?: string;
};

export function FormInput({
  name,
  error: customError,
  ref,
  ...inputProps
}: FormInputProps) {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext || {};

  const fieldError = errors[name];
  const errorMessage =
    customError || (fieldError?.message as string) || undefined;

  if (!formContext) {
    return <Input ref={ref} error={errorMessage} {...inputProps} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input {...field} {...inputProps} error={errorMessage} />
      )}
    />
  );
}
