'use client';

import type { ReactNode } from 'react';
import { Error } from '@repo/icons';

import { cn } from './utils';

export interface FieldHelperTextProps {
  id: string;
  error?: string;
  helperText?: string;
  showErrorIcon?: boolean;
  className?: string;
}

export function FieldHelperText({
  id,
  error,
  helperText,
  showErrorIcon = false,
  className,
}: FieldHelperTextProps): ReactNode {
  if (!error && !helperText) {
    return null;
  }

  const isError = Boolean(error);

  let children: ReactNode;
  if (error) {
    children = showErrorIcon ? (
      <>
        <Error className="h-3 w-3 shrink-0" aria-hidden />
        {error}
      </>
    ) : (
      error
    );
  } else {
    children = helperText;
  }

  return (
    <p
      id={id}
      className={cn(
        'mt-2',
        isError
          ? cn(
              'text-error-500 text-sm leading-snug',
              showErrorIcon && 'flex items-center gap-1',
            )
          : 'text-darkest-gray text-sm',
        className,
      )}
      role={isError ? 'alert' : undefined}
    >
      {children}
    </p>
  );
}
