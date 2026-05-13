/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import type { ReactNode } from 'react';
import { Error } from '@repo/icons';

import { FieldHelperText } from './field-helper-text';
import { cn } from './utils';

export interface InputProps extends Omit<
  React.ComponentProps<'input'>,
  'size'
> {
  label?: string;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  controlClassName?: string;
}

export function Input({
  label,
  required = false,
  icon,
  error,
  helperText,
  disabled = false,
  className,
  controlClassName,
  ref,
  ...inputProps
}: InputProps) {
  const hasValue =
    (inputProps.value !== undefined && inputProps.value !== '') ||
    (inputProps.defaultValue !== undefined && inputProps.defaultValue !== '');

  const baseInputStyles = cn(
    'h-[42px] w-full max-w-full rounded-sm bg-white px-4 text-darkest-gray placeholder:text-medium-gray transition-all duration-200 focus:outline-none text-mobile-body1 md:text-desktop-body1',
    icon && 'pr-10',
  );

  const stateStyles = disabled
    ? cn(
        'border-2 border-gray bg-lightest-gray cursor-not-allowed',
        hasValue ? 'text-darkest-gray' : 'text-medium-gray ',
      )
    : error
      ? cn('border border-error-300 focus:border-2')
      : hasValue
        ? cn(
            'border-2 border-medium-gray hover:border-2 hover:border-primary-300 focus:border-2 focus:border-primary-400',
          )
        : cn(
            'border border-medium-gray hover:border-primary-300 focus:border-2 focus:border-primary-400 focus:ring-primary-400/20',
          );

  const labelStyles =
    'mb-2 block font-bold text-bold-gray text-mobile-caption md:text-desktop-caption';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputProps.id} className={labelStyles}>
          {label}
          {required && (
            <span className="text-error-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${inputProps.id}-helper` : undefined
          }
          className={cn(baseInputStyles, stateStyles, controlClassName)}
          {...inputProps}
        />

        {(icon || error) && (
          <div
            className={cn(
              'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2',
              'flex items-center justify-center',
              error
                ? 'text-error-500'
                : disabled
                  ? 'text-medium-gray'
                  : hasValue
                    ? 'text-darkest-gray'
                    : 'text-medium-gray',
            )}
          >
            {error ? <Error className="text-error-500 h-4" /> : icon}
          </div>
        )}
      </div>

      <FieldHelperText
        id={`${inputProps.id}-helper`}
        error={error}
        helperText={helperText}
      />
    </div>
  );
}
