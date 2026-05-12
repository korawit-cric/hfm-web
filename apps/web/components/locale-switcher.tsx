'use client';

import { useLocale } from 'next-intl';

import { Link, usePathname } from '../lib/i18n/navigation';
import { routing } from '../lib/i18n/routing';

type Props = {
  labels: Record<string, string>;
  ariaLabel: string;
};

export function LocaleSwitcher({ labels, ariaLabel }: Props) {
  const pathname = usePathname();
  const activeLocale = useLocale();

  return (
    <nav aria-label={ariaLabel} className="flex items-center gap-1 text-xs">
      {routing.locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {Boolean(index) && (
            <span className="text-white/30" aria-hidden>
              |
            </span>
          )}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === activeLocale
                ? 'font-semibold text-white'
                : 'text-white/60 transition-colors hover:text-white'
            }
            prefetch={false}
          >
            {labels[locale] ?? locale.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
