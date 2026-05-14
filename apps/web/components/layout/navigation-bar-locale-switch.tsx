'use client';

import { useLocale } from 'next-intl';

import { LocaleSwitcherEn, LocaleSwitcherTh } from '@repo/icons';

import { Link, Locale, usePathname } from '@/lib/i18n/navigation';

export type NavigationBarLocaleLabels = {
  switchToEnglish: string;
  switchToThai: string;
};

type Props = {
  labels: NavigationBarLocaleLabels;
  onClick?: () => void;
};

export function NavigationBarLocaleSwitch({ labels, onClick }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const targetLocale = locale === Locale.EN ? Locale.TH : Locale.EN;
  const ariaLabel =
    targetLocale === Locale.TH ? labels.switchToThai : labels.switchToEnglish;

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      prefetch={false}
      aria-label={ariaLabel}
      className="text-lightest-gray rounded-sm transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      {locale === Locale.EN ? (
        <LocaleSwitcherEn className="h-4 w-auto" aria-hidden />
      ) : (
        <LocaleSwitcherTh className="h-4 w-auto" aria-hidden />
      )}
    </Link>
  );
}
