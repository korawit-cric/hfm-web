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
import * as SelectPrimitive from '@radix-ui/react-select';
import { Error } from '@repo/icons';

import { FieldHelperText } from './field-helper-text';
import { cn } from './utils';

export type SelectOptionItem = {
  value: string;
  label: ReactNode;
  disabled: boolean;
};

function collectOptions(children: ReactNode): SelectOptionItem[] {
  const out: SelectOptionItem[] = [];
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

function buildEmptySentinels(allValues: Iterable<string>): {
  empty: string;
  placeholder: string;
} {
  const vals = new Set(allValues);
  let empty = '\u2060\u200b';
  let placeholder = '\u2060\u200c';
  while (vals.has(empty)) {
    empty += '\u200b';
  }
  while (vals.has(placeholder) || placeholder === empty) {
    placeholder += '\u200c';
  }
  return { empty, placeholder };
}

export interface SelectProps extends Omit<
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

export function Select({
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
}: SelectProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
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

  const { empty: emptySentinel, placeholder: placeholderSentinel } = useMemo(
    () => buildEmptySentinels(options.map((o) => o.value)),
    [options],
  );

  const firstEmptyOption = useMemo(
    () => options.find((o) => o.value === ''),
    [options],
  );

  const toRadixValue = useCallback(
    (committed: string): string | undefined => {
      if (committed !== '') {
        return committed;
      }
      if (firstEmptyOption && !firstEmptyOption.disabled) {
        return emptySentinel;
      }
      return undefined;
    },
    [firstEmptyOption, emptySentinel],
  );

  const fromRadixValue = useCallback(
    (radix: string) => (radix === emptySentinel ? '' : radix),
    [emptySentinel],
  );

  const radixItemValue = useCallback(
    (opt: SelectOptionItem) => {
      if (opt.value !== '') {
        return opt.value;
      }
      return opt.disabled ? placeholderSentinel : emptySentinel;
    },
    [emptySentinel, placeholderSentinel],
  );

  const placeholderOption = options.find((o) => o.value === '');

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

  const handleRadixValueChange = (radix: string) => {
    emitChange(fromRadixValue(radix));
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

  const committedRadixValue = toRadixValue(committedValue);
  const defaultRadixValue = toRadixValue(
    defaultValueProp !== undefined && defaultValueProp !== null
      ? String(defaultValueProp)
      : '',
  );

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label htmlFor={fieldId} className={labelStyles}>
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

        <SelectPrimitive.Root
          disabled={disabled}
          required={required}
          {...(isControlled
            ? {
                value: committedRadixValue,
                onValueChange: handleRadixValueChange,
              }
            : {
                defaultValue: defaultRadixValue,
                onValueChange: handleRadixValueChange,
              })}
        >
          <SelectPrimitive.Trigger
            id={fieldId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? helperId : undefined}
            className={cn(baseSelectStyles, stateStyles, controlClassName)}
          >
            <SelectPrimitive.Value
              placeholder={placeholderOption?.label ?? '\u00a0'}
            />
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              collisionPadding={8}
              className={cn(
                'border-medium-gray z-[200] max-h-[240px] overflow-hidden rounded-sm border bg-white py-1 shadow-lg',
                'w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]',
              )}
            >
              <SelectPrimitive.Viewport className="max-h-[240px] overflow-y-auto p-0">
                {options.map((opt, index) => (
                  <SelectPrimitive.Item
                    key={`${radixItemValue(opt)}-${index}`}
                    value={radixItemValue(opt)}
                    disabled={opt.disabled}
                    textValue={
                      typeof opt.label === 'string' ? opt.label : undefined
                    }
                    className={cn(
                      'text-mobile-body1 md:text-desktop-body1 px-4 py-2',
                      'cursor-pointer outline-none select-none',
                      'data-[disabled]:text-medium-gray data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
                      'data-[highlighted]:bg-lightest-gray data-[highlighted]:text-darkest-gray',
                      'data-[state=checked]:text-darkest-gray data-[state=checked]:font-medium',
                      !opt.disabled &&
                        opt.value !== committedValue &&
                        'text-darkest-gray',
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {opt.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

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
