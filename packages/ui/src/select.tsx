/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import { forwardRef, type ReactNode } from 'react';
import { Error } from '@repo/icons';

import { cn } from './utils';

/**
 * Select — presentational native `<select>` aligned with {@link Input} states.
 */
export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  label?: string;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      required = false,
      icon,
      error,
      helperText,
      disabled = false,
      className,
      children,
      ...selectProps
    },
    ref,
  ) => {
    const hasValue =
      (selectProps.value !== undefined &&
        selectProps.value !== '' &&
        String(selectProps.value) !== '') ||
      (selectProps.defaultValue !== undefined &&
        selectProps.defaultValue !== '' &&
        String(selectProps.defaultValue) !== '');

    const baseSelectStyles = cn(
      'h-14 w-full cursor-pointer rounded-lg bg-white px-4 transition-all duration-200 focus:outline-none text-mobile-body1 md:text-desktop-body1',
      'appearance-none',
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

    const helperStyles = cn(
      'mt-2 text-mobile-caption md:text-desktop-caption',
      error ? 'text-error-500' : 'text-darkest-gray',
    );

    return (
      <div className={cn('w-full', className)}>
        {label ? (
          <label htmlFor={selectProps.id} className={labelStyles}>
            {label}
            {required ? (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error || helperText ? `${selectProps.id}-helper` : undefined
            }
            className={cn(baseSelectStyles, stateStyles)}
            {...selectProps}
          >
            {children}
          </select>

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
              {error ? <Error className="text-error-500 h-6" /> : icon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={`${selectProps.id}-helper`}
            className={helperStyles}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
