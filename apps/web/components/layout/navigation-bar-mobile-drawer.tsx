'use client';

import { useEffect, useId, useState } from 'react';
import { HamburgerMenu, MobileDevice } from '@repo/icons';

import { Link, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@repo/ui/utils';

import type { NavigationBarMainNavItem } from './navigation-bar-main-nav';
import type { NavigationBarLocaleLabels } from './navigation-bar-locale-switch';
import { NavigationBarLocaleSwitch } from './navigation-bar-locale-switch';

type UtilityLink = {
  href: string;
  label: string;
};

export type NavigationBarDrawerLabels = {
  navAriaLabel: string;
  openMenu: string;
  closeMenu: string;
  download: string;
  locale: NavigationBarLocaleLabels;
};

type Props = {
  items: NavigationBarMainNavItem[];
  utilityLinks: UtilityLink[];
  /** From sitemap `ROUTES.DOWNLOAD` — single source of truth for app paths. */
  downloadHref: string;
  labels: NavigationBarDrawerLabels;
};

export function NavigationBarMobileDrawer({
  items,
  utilityLinks,
  downloadHref,
  labels,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = useId();
  const titleId = `${drawerId}-title`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="text-lightest-gray cursor-pointer rounded-md p-1 transition-colors hover:text-white lg:hidden"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? labels.closeMenu : labels.openMenu}
        onClick={() => setOpen((prev) => !prev)}
      >
        <HamburgerMenu className="h-6 w-6 shrink-0" aria-hidden />
      </button>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <aside
        id={drawerId}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-hidden={!open}
        aria-labelledby={titleId}
        className={cn(
          'border-bold-gray/60 bg-darkest-gray text-lightest-gray fixed top-0 right-0 z-50 flex h-full max-w-full flex-col border-l shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          'w-[min(100vw,22rem)]',
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
      >
        <div className="border-bold-gray/40 flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3">
          <h2 id={titleId} className="text-base font-bold text-white">
            {labels.navAriaLabel}
          </h2>
          <button
            type="button"
            className="text-lightest-gray -mr-2 cursor-pointer rounded-md p-2 transition-colors hover:text-white"
            aria-label={labels.closeMenu}
            onClick={() => setOpen(false)}
          >
            <span className="text-2xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <nav className="min-h-0 flex-1 overflow-y-auto py-2">
            <ul className="flex flex-col gap-0.5 px-2">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-lightest-gray hover:bg-bold-gray/50 block rounded px-3 py-3 text-base transition-colors hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-bold-gray/40 shrink-0 border-t px-2 py-2">
            <Link
              href={downloadHref}
              className="text-lightest-gray hover:bg-bold-gray/50 inline-flex w-full items-center gap-2 rounded px-3 py-3 text-base transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              <MobileDevice className="h-4 w-auto shrink-0" aria-hidden />
              {labels.download}
            </Link>
            <ul className="flex flex-col gap-0.5">
              {utilityLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-lightest-gray hover:bg-bold-gray/50 block rounded px-3 py-3 text-base transition-colors hover:text-white hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex px-3 py-3">
              <NavigationBarLocaleSwitch
                labels={labels.locale}
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
