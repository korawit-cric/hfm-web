'use client';

import { useLocale } from 'next-intl';

import { LocaleSwitcherEn, LocaleSwitcherTh } from '@repo/icons';

import { Link, Locale, usePathname } from '@/lib/i18n/navigation';

type Props = {
  labelSwitchToEnglish: string;
  labelSwitchToThai: string;
  onClick?: () => void;
};

export function NavigationBarLocaleSwitch({
  labelSwitchToEnglish,
  labelSwitchToThai,
  onClick,
}: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const targetLocale = locale === Locale.EN ? Locale.TH : Locale.EN;
  const ariaLabel =
    targetLocale === Locale.TH ? labelSwitchToThai : labelSwitchToEnglish;

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      prefetch={false}
      aria-label={ariaLabel}
      className="text-lightest-gray rounded-sm transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      {locale === 'en' ? (
        <LocaleSwitcherEn className="h-4 w-auto" aria-hidden />
      ) : (
        <LocaleSwitcherTh className="h-4 w-auto" aria-hidden />
      )}
    </Link>
  );
}
