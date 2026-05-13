'use client';

import type { ComponentType, Ref, ReactNode } from 'react';

import { cn } from './utils';

type ButtonSize = 'large' | 'small';
type ButtonVariant = 'primary' | 'secondary';

/**
 * Button Component
 *
 * Ref is a normal prop (React 19).
 *
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" size="small">Text</Button>
 *
 * @example With Next.js Link
 * ```tsx
 * import Link from 'next/link';
 * import { Button } from '@repo/ui/button';
 *
 * <Button variant="linked" href="/page" as={Link}>
 *   Go to Page
 * </Button>
 * ```
 */
export interface ButtonProps {
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  as?: ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export function Button({
  ref,
  children,
  className = '',
  variant = 'primary',
  size = 'large',
  icon: _icon,
  onClick,
  disabled = false,
  href,
  type = 'button',
  as: LinkComponent,
}: ButtonProps) {
  const sizeStyles = {
    large: 'h-[54px] text-lg font-normal',
    small: 'h-[35px] text-base font-normal',
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 px-4 py-[9px] rounded-sm font-medium transition-all duration-200 cursor-pointer text-white',
    sizeStyles[size],
  );

  const colorStyles = {
    primary: {
      bg: 'bg-primary-500',
      bgHover: 'hover:bg-primary-700',
      border: 'border-none',
      borderHover: 'hover:border-none',
    },
    secondary: {
      bg: 'bg-transparent',
      bgHover: 'hover:bg-secondary-700',
      border: 'border-secondary-500',
      borderHover: 'hover:border-secondary-700',
    },
  };

  const colors = colorStyles[variant];

  const disabledColorStyles = disabled
    ? 'bg-gray border-medium-gray border text-medium-gray hover:bg-gray hover:border-medium-gray cursor-not-allowed'
    : '';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: disabled
      ? disabledColorStyles
      : cn(colors.bg, colors.bgHover, colors.border, colors.borderHover),
    secondary: disabled
      ? cn(
          disabledColorStyles,
          'bg-transparent hover:bg-transparent border-none ',
        )
      : cn(
          'bg-transparent border',
          colors.bg,
          colors.bgHover,
          colors.border,
          colors.borderHover,
        ),
  };

  const content = <>{children}</>;

  if (href && !disabled) {
    const LinkElement = LinkComponent || 'a';
    return (
      <LinkElement
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
      >
        {content}
      </LinkElement>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
