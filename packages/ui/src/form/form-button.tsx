'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '../button';
import type { ButtonProps } from '../button';

type FormButtonProps = Omit<ButtonProps, 'type'> & {
  type?: 'button' | 'submit' | 'reset';
  autoDisable?: boolean;
};

export function FormButton({
  ref,
  type = 'submit',
  autoDisable = true,
  disabled,
  ...buttonProps
}: FormButtonProps) {
  const formContext = useFormContext();
  const { isValid = true, isSubmitting = false } = formContext?.formState || {};

  const isFormDisabled =
    autoDisable &&
    type === 'submit' &&
    formContext &&
    (!isValid || isSubmitting);

  return (
    <Button
      ref={ref}
      type={type}
      disabled={disabled || isFormDisabled}
      {...buttonProps}
    />
  );
}
