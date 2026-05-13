/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import { FieldHelperText } from './field-helper-text';
import { cn } from './utils';

/**
 * Textarea Component - Pure presentational component
 *
 * Ref is a normal prop (React 19).
 *
 * @example
 * <Textarea label="Note" placeholder="Enter your note" />
 * <Textarea label="Note" required placeholder="Enter your note" />
 * <Textarea label="Note" error="Invalid note" placeholder="Enter your note" />
 * <Textarea label="Note" disabled placeholder="Enter your note" />
 */
export interface TextareaProps extends Omit<
  React.ComponentProps<'textarea'>,
  'size'
> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
}

export function Textarea({
  label,
  required = false,
  error,
  helperText,
  rows = 2,
  disabled = false,
  className,
  ref,
  ...textareaProps
}: TextareaProps) {
  const hasValue =
    (textareaProps.value !== undefined && textareaProps.value !== '') ||
    (textareaProps.defaultValue !== undefined &&
      textareaProps.defaultValue !== '');

  const baseTextareaStyles = cn(
    'min-h-20 w-full resize-y rounded-lg bg-white px-4 py-3 text-darkest-gray placeholder:text-medium-gray transition-all duration-200 focus:outline-none text-mobile-body1 md:text-desktop-body1',
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
        <label htmlFor={textareaProps.id} className={labelStyles}>
          {label}
          {required && (
            <span className="text-error-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error || helperText ? `${textareaProps.id}-helper` : undefined
          }
          className={cn(baseTextareaStyles, stateStyles)}
          {...textareaProps}
        />
      </div>

      <FieldHelperText
        id={`${textareaProps.id}-helper`}
        error={error}
        helperText={helperText}
      />
    </div>
  );
}
