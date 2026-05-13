import { Fragment } from 'react';
import { getTranslations } from 'next-intl/server';
import { HfmMarketsLogo, MobileDevice } from '@repo/icons';
import { Button } from '@repo/ui/button';

import { NavigationBarLocaleSwitch } from './navigation-bar-locale-switch';
import { NavigationBarMainNav } from './navigation-bar-main-nav';
import { NavigationBarMobileDrawer } from './navigation-bar-mobile-drawer';
import { Link } from '@/lib/i18n/navigation';

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

  const mainNavItems = MAIN_NAV_ITEMS.map(({ href, translationKey }) => ({
    href,
    label: t(translationKey),
  }));

  const drawerUtilityLinks = TOP_UTILITY_LINKS.map(
    ({ href, translationKey }) => ({
      href,
      label: t(translationKey),
    }),
  );

  const localeLabels = {
    switchToEnglish: t('localeSwitchToEnglish'),
    switchToThai: t('localeSwitchToThai'),
  };

  const drawerLabels = {
    navAriaLabel: t('mainNavLabel'),
    openMenu: t('mainNavOpenMenu'),
    closeMenu: t('mainNavCloseMenu'),
    download: t('downloadApp'),
    locale: localeLabels,
  };

  return (
    <header className="bg-darkest-gray relative z-50">
      <div className="mx-auto flex max-w-6xl flex-col justify-center gap-4 px-4 py-4 sm:px-6 lg:h-[132px] lg:py-0">
        <div className="hidden flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:flex">
          <span className="text-medium-gray text-xxs font-open-sans leading-2.5 font-normal">
            Member of HF Markets Group
          </span>
          <div className="text-lightest-gray flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm sm:flex-initial sm:gap-4">
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
            <NavigationBarLocaleSwitch labels={localeLabels} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-[100px]">
            <Link href="/" aria-label={t('logoAlt')} className="shrink-0">
              <HfmMarketsLogo
                className="block h-10! w-auto max-w-none shrink-0 sm:h-12! lg:h-[58px]!"
                aria-hidden
              />
            </Link>
            <NavigationBarMainNav
              items={mainNavItems}
              navAriaLabel={t('mainNavLabel')}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-[17px]">
            <Button variant="secondary" size="small">
              {t('login')}
            </Button>
            <Button variant="primary" size="small">
              {t('register')}
            </Button>
            <NavigationBarMobileDrawer
              items={mainNavItems}
              utilityLinks={drawerUtilityLinks}
              labels={drawerLabels}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
