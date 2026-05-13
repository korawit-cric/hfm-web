'use client';

import { useLocale } from 'next-intl';

import { LocaleSwitcherEn, LocaleSwitcherTh } from '@repo/icons';

import { Link, usePathname } from '@/lib/i18n/navigation';

type Props = {
  labelSwitchToEnglish: string;
  labelSwitchToThai: string;
};

export function NavigationBarLocaleSwitch({
  labelSwitchToEnglish,
  labelSwitchToThai,
}: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const targetLocale = locale === 'en' ? 'th' : 'en';
  const ariaLabel =
    targetLocale === 'th' ? labelSwitchToThai : labelSwitchToEnglish;

  return (
    <Link
      href={pathname}
      locale={targetLocale}
      prefetch={false}
      aria-label={ariaLabel}
      className="text-lightest-gray rounded-sm transition-opacity hover:opacity-80"
    >
      {locale === 'en' ? (
        <LocaleSwitcherEn className="h-4 w-auto" aria-hidden />
      ) : (
        <LocaleSwitcherTh className="h-4 w-auto" aria-hidden />
      )}
    </Link>
  );
}
