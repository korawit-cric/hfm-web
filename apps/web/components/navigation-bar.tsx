import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';
import { HfmMarketsLogo, MobileDevice } from '@repo/icons';
import { Button } from '@repo/ui/button';

import { NavigationBarLocaleSwitch } from './navigation-bar-locale-switch';
import { Link } from '../lib/i18n/navigation';

const MAIN_NAV_ITEMS = [
  { href: '/products', translationKey: 'navProducts' },
  { href: '/about', translationKey: 'navAbout' },
  { href: '/resources', translationKey: 'navResources' },
  { href: '/support', translationKey: 'navSupport' },
  { href: '/contact', translationKey: 'navContact' },
] as const;

const TOP_UTILITY_LINKS = [
  { href: '/contact', translationKey: 'utilityContactUs' },
  { href: '/partner', translationKey: 'utilityPartnerWithUs' },
] as const;

export async function NavigationBar() {
  const t = await getTranslations('NavigationBar');

  return (
    <header className="bg-darkest-gray">
      <div className="mx-auto flex h-[132px] max-w-6xl flex-col justify-center gap-4">
        <div className="flex items-end justify-between gap-4">
          <span className="text-medium-gray text-xxs leading-2.5 font-normal">
            Member of HF Markets Group
          </span>
          <div className="text-lightest-gray flex items-center gap-4 text-sm">
            <Link
              href="/download"
              className="border-dark-gray text-lightest-gray hover:border-lightest-gray/40 inline-flex items-center gap-2 rounded-md border-[0.5px] px-2 py-1 transition-colors hover:text-white"
            >
              <MobileDevice className="h-4 w-auto shrink-0" aria-hidden />
              {t('downloadApp')}
            </Link>
            {TOP_UTILITY_LINKS.map(({ href, translationKey }) => (
              <Fragment key={href}>
                <div className="text-bold-gray" aria-hidden>
                  |
                </div>
                <Link
                  href={href}
                  className="transition-colors hover:text-white hover:underline!"
                >
                  {t(translationKey)}
                </Link>
              </Fragment>
            ))}
            <div className="text-bold-gray" aria-hidden>
              |
            </div>
            <NavigationBarLocaleSwitch
              labelSwitchToEnglish={t('localeSwitchToEnglish')}
              labelSwitchToThai={t('localeSwitchToThai')}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-[100px]">
            <Link
              href="/"
              aria-label={t('logoAlt')}
            >
              <HfmMarketsLogo
                className="block h-[58px]! w-auto max-w-none shrink-0"
                aria-hidden
              />
            </Link>
            <nav
              aria-label={t('mainNavLabel')}
              className="text-lightest-gray flex items-center gap-9 text-base font-normal"
            >
              {MAIN_NAV_ITEMS.map(({ href, translationKey }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-white! hover:underline!"
                >
                  {t(translationKey)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex gap-[17px]">
            <Button variant="secondary" size="small">
              Login
            </Button>
            <Button variant="primary" size="small">
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
