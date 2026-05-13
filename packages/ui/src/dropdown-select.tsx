/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Error } from '@repo/icons';

import { FieldHelperText } from './field-helper-text';
import { cn } from './utils';

export type DropdownSelectOptionItem = {
  value: string;
  label: ReactNode;
  disabled: boolean;
};

function collectOptions(children: ReactNode): DropdownSelectOptionItem[] {
  const out: DropdownSelectOptionItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== 'option') {
      return;
    }
    const o = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
    out.push({
      value: o.value !== undefined && o.value !== null ? String(o.value) : '',
      label: (o.children ?? o.label ?? o.value ?? '') as ReactNode,
      disabled: !!o.disabled,
    });
  });
  return out;
}

export interface DropdownSelectProps extends Omit<
  React.ComponentProps<'select'>,
  'size'
> {
  label?: string;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  controlClassName?: string;
}

export function DropdownSelect({
  label,
  required = false,
  icon,
  error,
  helperText,
  disabled = false,
  className,
  children,
  controlClassName,
  onChange,
  value: valueProp,
  defaultValue: defaultValueProp,
  id: idProp,
  ref,
  ...selectRest
}: DropdownSelectProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const labelId = `${fieldId}-label`;
  const helperId = `${fieldId}-helper`;

  const innerSelectRef = useRef<HTMLSelectElement>(null);

  const setSelectRef = useCallback(
    (node: HTMLSelectElement | null) => {
      innerSelectRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    defaultValueProp !== undefined && defaultValueProp !== null
      ? String(defaultValueProp)
      : '',
  );

  const options = useMemo(() => collectOptions(children), [children]);

  const committedValue = isControlled
    ? String(valueProp ?? '')
    : uncontrolledValue;

  const hasValue = committedValue !== '' && String(committedValue) !== '';

  const selectedOption = options.find((o) => o.value === committedValue);
  const placeholderOption = options.find((o) => o.value === '');
  const triggerLabel = selectedOption
    ? selectedOption.label
    : (placeholderOption?.label ?? '\u00a0');

  const emitChange = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.({
      target: {
        value: nextValue,
        name: String(selectRest.name ?? ''),
      },
    } as unknown as ChangeEvent<HTMLSelectElement>);
  };

  const baseSelectStyles = cn(
    'h-[42px] w-full max-w-full rounded-sm bg-white px-4 text-left text-mobile-body1 transition-all duration-200 focus:outline-none md:text-desktop-body1',
    'flex items-center',
    icon && 'pr-10',
  );

  const stateStyles = disabled
    ? cn(
        'cursor-not-allowed border-2 border-gray bg-lightest-gray',
        hasValue ? 'text-darkest-gray' : 'text-medium-gray',
      )
    : error
      ? cn(
          'cursor-pointer border border-error-300 focus:border-2',
          hasValue ? 'text-darkest-gray' : 'text-medium-gray',
        )
      : hasValue
        ? cn(
            'cursor-pointer border-2 border-medium-gray hover:border-2 hover:border-primary-300 focus:border-2 focus:border-primary-400',
            'text-darkest-gray',
          )
        : cn(
            'cursor-pointer border border-medium-gray hover:border-primary-300 focus:border-2 focus:border-primary-400 focus:ring-primary-400/20',
            'text-medium-gray',
          );

  const labelStyles =
    'mb-2 block font-bold text-bold-gray text-mobile-caption md:text-desktop-caption';

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div id={labelId} className={labelStyles}>
          {label}
          {required ? (
            <span className="text-error-500 ml-1" aria-label="required">
              *
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="relative">
        <select
          ref={setSelectRef}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none absolute h-px w-px -translate-y-[9999px] opacity-0"
          value={committedValue}
          onChange={(e) => {
            onChange?.(e);
            if (!isControlled) {
              setUncontrolledValue(e.target.value);
            }
          }}
          {...selectRest}
        >
          {children}
        </select>

        <DropdownMenuPrimitive.Root modal={false}>
          <DropdownMenuPrimitive.Trigger
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? helperId : undefined}
            aria-labelledby={label ? labelId : undefined}
            className={cn(baseSelectStyles, stateStyles, controlClassName)}
          >
            <span className="min-w-0 flex-1 truncate">{triggerLabel}</span>
          </DropdownMenuPrimitive.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              sideOffset={4}
              align="start"
              collisionPadding={8}
              className={cn(
                'border-medium-gray z-[200] max-h-[240px] overflow-y-auto rounded-sm border bg-white py-1 shadow-lg',
                'w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)]',
              )}
            >
              {options.map((opt, index) => (
                <DropdownMenuPrimitive.Item
                  key={`${opt.value}-${index}`}
                  disabled={opt.disabled}
                  onSelect={() => {
                    if (!opt.disabled) {
                      emitChange(opt.value);
                    }
                  }}
                  className={cn(
                    'text-mobile-body1 md:text-desktop-body1 px-4 py-2',
                    'cursor-pointer outline-none select-none',
                    'data-[disabled]:text-medium-gray data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
                    'data-[highlighted]:bg-lightest-gray data-[highlighted]:text-darkest-gray',
                    opt.value === committedValue &&
                      !opt.disabled &&
                      'text-darkest-gray font-medium',
                    !opt.disabled &&
                      opt.value !== committedValue &&
                      'text-darkest-gray',
                  )}
                >
                  {opt.label}
                </DropdownMenuPrimitive.Item>
              ))}
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>

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

      <FieldHelperText id={helperId} error={error} helperText={helperText} />
    </div>
  );
}
