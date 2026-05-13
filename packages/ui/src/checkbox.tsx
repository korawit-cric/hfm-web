'use client';

import { forwardRef, useId, type ReactNode } from 'react';
import { Error } from '@repo/icons';

import { cn } from './utils';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /**
   * Rich label next to the control (text, links, etc.).
   */
  label?: ReactNode;
  error?: string;
  helperText?: string;
}

/**
 * Checkbox row — layout and states aligned with {@link Input} / {@link Select}.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      disabled = false,
      className,
      id,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const labelRowStyles = cn(
      'flex cursor-pointer items-start gap-3 text-mobile-body1 md:text-desktop-body1 text-darkest-gray',
      disabled && 'cursor-not-allowed opacity-60',
    );

    const boxStyles = cn(
      'mt-0.5 h-5 w-5 shrink-0 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:ring-offset-0',
      'border-medium-gray text-primary-500 accent-primary-500',
      error && 'border-error-300',
      disabled && 'cursor-not-allowed',
    );

    const helperStyles = cn(
      'mt-2 text-mobile-caption md:text-desktop-caption',
      error ? 'text-error-500' : 'text-darkest-gray',
    );

    return (
      <div className={cn('w-full', className)}>
        <label htmlFor={inputId} className={labelRowStyles}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error || helperText ? `${inputId}-helper` : undefined
            }
            className={boxStyles}
            {...inputProps}
          />
          {label ? <span className="min-w-0 flex-1">{label}</span> : null}
        </label>

        {(error || helperText) && (
          <p
            id={`${inputId}-helper`}
            className={cn(helperStyles, error && 'flex items-center gap-1')}
            role={error ? 'alert' : undefined}
          >
            {error ? (
              <>
                <Error className="h-4 w-4 shrink-0" aria-hidden />
                {error}
              </>
            ) : (
              helperText
            )}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
