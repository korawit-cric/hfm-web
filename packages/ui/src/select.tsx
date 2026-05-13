/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import { forwardRef, type ReactNode } from 'react';
import { Error } from '@repo/icons';

import { FieldHelperText } from './field-helper-text';
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
  /** Classes merged onto the native &lt;select&gt; (overrides default 317×42). */
  controlClassName?: string;
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
      controlClassName,
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
      'h-[42px] w-full max-w-full cursor-pointer rounded-sm bg-white px-4 transition-all duration-200 text-mobile-body1 md:text-desktop-body1',
      'appearance-none',
      icon && 'pr-10',
    );

    const stateStyles = disabled
      ? cn(
          'border-2 border-gray bg-lightest-gray cursor-not-allowed',
          hasValue ? 'text-darkest-gray' : 'text-medium-gray',
        )
      : error
        ? cn(
            'border border-error-300',
            hasValue ? 'text-darkest-gray' : 'text-medium-gray',
          )
        : hasValue
          ? cn(
              'border-2 border-medium-gray hover:border-2 hover:border-primary-300',
              'text-darkest-gray',
            )
          : cn(
              'border border-medium-gray hover:border-primary-300',
              'text-medium-gray',
            );

    const labelStyles =
      'mb-2 block font-bold text-bold-gray text-mobile-caption md:text-desktop-caption';

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
            className={cn(baseSelectStyles, stateStyles, controlClassName)}
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
              {error ? <Error className="text-error-500 h-4" /> : icon}
            </div>
          )}
        </div>

        <FieldHelperText
          id={`${selectProps.id}-helper`}
          error={error}
          helperText={helperText}
        />
      </div>
    );
  },
);

Select.displayName = 'Select';
