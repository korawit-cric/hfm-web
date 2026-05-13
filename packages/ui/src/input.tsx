/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import { forwardRef, ReactNode } from 'react';
import { Error } from '@repo/icons';

import { FieldHelperText } from './field-helper-text';
import { cn } from './utils';

/**
 * Input Component - Pure presentational component
 *
 * Supports all input states: rest, hover, error, active, filled, disabled
 *
 * @example
 * <Input label="Email" placeholder="Enter your email" />
 * <Input label="Email" required placeholder="Enter your email" />
 * <Input label="Email" icon={<Icon />} placeholder="Enter your email" />
 * <Input label="Email" error="Invalid email" placeholder="Enter your email" />
 * <Input label="Email" disabled placeholder="Enter your email" />
 */
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Whether the field is required (shows asterisk)
   */
  required?: boolean;
  /**
   * Icon displayed on the right side of the input
   */
  icon?: ReactNode;
  /**
   * Error message (triggers error state)
   */
  error?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Classes merged onto the native &lt;input&gt; (overrides default 317×42).
   */
  controlClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required = false,
      icon,
      error,
      helperText,
      disabled = false,
      className,
      controlClassName,
      ...inputProps
    },
    ref,
  ) => {
    // Determine if input has a value (for filled state styling)
    // For controlled inputs (React Hook Form), check value prop
    // For uncontrolled inputs, check defaultValue prop
    const hasValue =
      (inputProps.value !== undefined && inputProps.value !== '') ||
      (inputProps.defaultValue !== undefined && inputProps.defaultValue !== '');

    // Default field size (design spec); override with controlClassName when needed.
    const baseInputStyles = cn(
      'h-[42px] w-full max-w-full rounded-lg bg-white px-4 text-darkest-gray placeholder:text-medium-gray transition-all duration-200 focus:outline-none text-mobile-body1 md:text-desktop-body1',
      icon && 'pr-10',
    );

    // State-based border and text colors
    const stateStyles = disabled
      ? cn(
          'border-2 border-gray bg-lightest-gray cursor-not-allowed',
          hasValue ? 'text-darkest-gray' : 'text-medium-gray ',
        )
      : error
        ? cn('border border-error-300 focus:border-2')
        : // Normal states (rest, hover, active, filled)
          hasValue
          ? cn(
              'border-2 border-medium-gray hover:border-2 hover:border-primary-300 focus:border-2 focus:border-primary-400',
            )
          : cn(
              'border border-medium-gray hover:border-primary-300 focus:border-2 focus:border-primary-400 focus:ring-primary-400/20',
            );

    // Label styles
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
  },
);

Input.displayName = 'Input';
