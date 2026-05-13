'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Textarea, type TextareaProps } from '../textarea';

type FormTextareaProps = Omit<TextareaProps, 'error'> & {
  name: string;
  error?: string;
};

export function FormTextarea({
  name,
  error: customError,
  ref,
  ...textareaProps
}: FormTextareaProps) {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext || {};

  const fieldError = errors[name];
  const errorMessage =
    customError || (fieldError?.message as string) || undefined;

  if (!formContext) {
    return <Textarea ref={ref} error={errorMessage} {...textareaProps} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Textarea {...field} {...textareaProps} error={errorMessage} />
      )}
    />
  );
}
