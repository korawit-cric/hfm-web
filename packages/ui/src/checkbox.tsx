'use client';

import { forwardRef, useId, type ReactNode } from 'react';
import { FieldHelperText } from './field-helper-text';
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
      'flex cursor-pointer items-center gap-2 text-mobile-body1 md:text-desktop-body1 text-darkest-gray',
      disabled && 'cursor-not-allowed opacity-60',
    );

    const boxStyles = cn(
      'h-[15px] w-[15px] shrink-0 rounded border transition-colors',
      'border-medium-gray text-primary-500 accent-primary-500',
      error && 'border-error-300',
      disabled && 'cursor-not-allowed',
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

        <FieldHelperText
          id={`${inputId}-helper`}
          error={error}
          helperText={helperText}
          showErrorIcon
        />
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
