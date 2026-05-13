/* eslint-disable no-nested-ternary */ /* better for readability */
'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
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

function getScrollParents(node: HTMLElement | null): HTMLElement[] {
  const scrollParents: HTMLElement[] = [];
  let current: HTMLElement | null = node?.parentElement ?? null;
  while (current) {
    const { overflow, overflowY, overflowX } = window.getComputedStyle(current);
    const scrollable =
      /(auto|scroll|overlay)/.test(overflow) ||
      /(auto|scroll|overlay)/.test(overflowY) ||
      /(auto|scroll|overlay)/.test(overflowX);
    if (scrollable) {
      scrollParents.push(current);
    }
    current = current.parentElement;
  }
  scrollParents.push(document.documentElement);
  return scrollParents;
}

type ListCoords = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

function measureListCoords(triggerEl: HTMLElement): ListCoords {
  const r = triggerEl.getBoundingClientRect();
  const gap = 4;
  const margin = 8;
  const spaceBelow = window.innerHeight - r.bottom - margin;
  const maxListPx = 240;
  return {
    top: r.bottom + gap,
    left: r.left,
    width: r.width,
    maxHeight: Math.min(maxListPx, Math.max(spaceBelow - gap, 80)),
  };
}

/**
 * Select — custom listbox aligned with {@link Input} states; keeps a native
 * &lt;select&gt; (visually hidden) for the same ref and change events as before.
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
  /** Classes merged onto the trigger (same role as the former native control). */
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
      onChange,
      value: valueProp,
      defaultValue: defaultValueProp,
      id: idProp,
      ...selectRest
    },
    ref,
  ) => {
    const autoId = useId();
    const fieldId = idProp ?? autoId;
    const listboxId = useId();
    const helperId = `${fieldId}-helper`;

    const listRef = useRef<HTMLUListElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
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

    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const [listCoords, setListCoords] = useState<ListCoords | null>(null);

    useEffect(() => {
      const idx = options.findIndex((o) => o.value === committedValue);
      setHighlight(idx >= 0 ? idx : 0);
    }, [committedValue, options]);

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

    const close = () => setOpen(false);

    const pick = (opt: SelectOptionItem) => {
      if (opt.disabled) {
        return;
      }
      emitChange(opt.value);
      close();
      triggerRef.current?.focus();
    };

    const updateListPosition = useCallback(() => {
      const el = triggerRef.current;
      if (!el) {
        return;
      }
      setListCoords(measureListCoords(el));
    }, []);

    const openMenu = () => {
      if (disabled) {
        return;
      }
      const idx = options.findIndex((o) => o.value === committedValue);
      setHighlight(idx >= 0 ? idx : 0);
      const el = triggerRef.current;
      if (el) {
        setListCoords(measureListCoords(el));
      }
      setOpen(true);
    };

    useLayoutEffect(() => {
      if (!open) {
        setListCoords(null);
        return;
      }
      updateListPosition();
    }, [open, updateListPosition]);

    useEffect(() => {
      if (!open) {
        return;
      }
      const scrollOpts = { capture: true, passive: true } as const;
      const onScrollOrResize = () => updateListPosition();
      const parents = getScrollParents(triggerRef.current);
      parents.forEach((p) =>
        p.addEventListener('scroll', onScrollOrResize, scrollOpts),
      );
      /* Main page scroll often fires on window/document, not only overflow ancestors. */
      window.addEventListener('scroll', onScrollOrResize, scrollOpts);
      document.addEventListener('scroll', onScrollOrResize, scrollOpts);
      window.addEventListener('resize', onScrollOrResize);
      window.visualViewport?.addEventListener('resize', onScrollOrResize);
      window.visualViewport?.addEventListener('scroll', onScrollOrResize);
      return () => {
        parents.forEach((p) =>
          p.removeEventListener('scroll', onScrollOrResize, scrollOpts),
        );
        window.removeEventListener('scroll', onScrollOrResize, scrollOpts);
        document.removeEventListener('scroll', onScrollOrResize, scrollOpts);
        window.removeEventListener('resize', onScrollOrResize);
        window.visualViewport?.removeEventListener('resize', onScrollOrResize);
        window.visualViewport?.removeEventListener('scroll', onScrollOrResize);
      };
    }, [open, updateListPosition]);

    useEffect(() => {
      if (!open) {
        return;
      }
      const onDoc = (e: MouseEvent) => {
        const t = e.target as Node;
        if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) {
          return;
        }
        close();
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    const moveHighlight = (delta: number) => {
      if (options.length === 0) {
        return;
      }
      let i = highlight;
      for (let step = 0; step < options.length; step++) {
        i = (i + delta + options.length) % options.length;
        if (!options[i]?.disabled) {
          setHighlight(i);
          return;
        }
      }
    };

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (open) {
          const opt = options[highlight];
          if (opt) {
            pick(opt);
          }
        } else {
          openMenu();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveHighlight(1);
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveHighlight(-1);
        }
      }
    };

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

          <button
            ref={triggerRef}
            type="button"
            id={fieldId}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error || helperText ? helperId : undefined}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            className={cn(baseSelectStyles, stateStyles, controlClassName)}
            onClick={() => (open ? close() : openMenu())}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="min-w-0 flex-1 truncate">{triggerLabel}</span>
          </button>

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

          {open &&
            listCoords &&
            typeof document !== 'undefined' &&
            createPortal(
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                style={{
                  position: 'fixed',
                  top: listCoords.top,
                  left: listCoords.left,
                  width: listCoords.width,
                  maxHeight: listCoords.maxHeight,
                }}
                className={cn(
                  'border-medium-gray z-[200] overflow-y-auto rounded-sm border',
                  'bg-white py-1 shadow-lg',
                )}
              >
                {options.map((opt, index) => (
                  <li
                    key={`${opt.value}-${index}`}
                    role="option"
                    aria-selected={opt.value === committedValue}
                    aria-disabled={opt.disabled}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pick(opt);
                    }}
                    onMouseEnter={() => setHighlight(index)}
                    className={cn(
                      'text-mobile-body1 md:text-desktop-body1 px-4 py-2',
                      'cursor-pointer select-none',
                      opt.disabled &&
                        'text-medium-gray cursor-not-allowed opacity-60',
                      index === highlight &&
                        !opt.disabled &&
                        'bg-lightest-gray',
                      opt.value === committedValue &&
                        !opt.disabled &&
                        'text-darkest-gray font-medium',
                      !opt.disabled &&
                        opt.value !== committedValue &&
                        'text-darkest-gray',
                    )}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>,
              document.body,
            )}
        </div>

        <FieldHelperText id={helperId} error={error} helperText={helperText} />
      </div>
    );
  },
);

Select.displayName = 'Select';
