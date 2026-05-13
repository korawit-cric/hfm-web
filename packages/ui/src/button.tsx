'use client';

import { forwardRef, ReactNode } from 'react';

import { cn } from './utils';

type ButtonSize = 'large' | 'small';
type ButtonVariant = 'primary' | 'secondary';

/**
 * Button Component
 *
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="primary-icon" icon={<Icon />}>Text</Button>
 * <Button variant="secondary" color="primary">Text</Button>
 * <Button variant="primary" color="yellow" size="small">Text</Button>
 * <Button variant="linked" href="/page">Text</Button>
 * <Button variant="textlink" href="/page">Text</Button>
 * <Button variant="primary" disabled>Text</Button>
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
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  /**
   * Optional component to render instead of <a> for links
   * Useful for Next.js Link: as={Link}
   * @example
   * ```tsx
   * import Link from 'next/link';
   * <Button variant="linked" href="/page" as={Link}>Go to Page</Button>
   * ```
   */
  as?: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
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
    },
    ref,
  ) => {
    const sizeStyles = {
      large: 'h-[54px] text-lg font-normal',
      small: 'h-[35px] text-base font-normal',
    };

    // Base styles
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 px-4 py-[9px] rounded-sm font-medium transition-all duration-200 cursor-pointer text-white',
      sizeStyles[size],
    );

    // Color mappings
    const colorStyles = {
      primary: {
        bg: 'bg-primary-500',
        bgHover: 'hover:bg-primary-300',
        border: 'border-none',
        borderHover: 'hover:border-none',
      },
      secondary: {
        bg: 'bg-transparent',
        bgHover: 'hover:bg-secondary-300',
        border: 'border-secondary-500',
        borderHover: 'hover:border-secondary-300',
      },
    };

    const colors = colorStyles[variant];

    // Disabled styles override
    const disabledColorStyles = disabled
      ? 'bg-gray border-medium-gray border text-medium-gray hover:bg-gray hover:border-medium-gray cursor-not-allowed'
      : '';

    // Variant styles
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
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={href}
          className={cn(baseStyles, variantStyles[variant], className)}
        >
          {content}
        </LinkElement>
      );
    }

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={type}
        className={cn(baseStyles, variantStyles[variant], className)}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
