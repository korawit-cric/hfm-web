import { getTranslations } from 'next-intl/server';

import { AppleAppStore, GooglePlayStore } from '@repo/icons';

import { Link } from '@/lib/i18n/navigation';

const SOCIAL_PLACEHOLDER_SLOTS = 7;

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="bg-darkest-gray">
      <div className="mx-auto h-[330px] max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <div>
              <h2 className="mb-4 text-base font-bold text-white">
                {t('findUsOn')}
              </h2>
              <ul
                className="text-lightest-gray flex flex-wrap items-center gap-4"
                aria-label={t('socialListLabel')}
              >
                {Array.from({ length: SOCIAL_PLACEHOLDER_SLOTS }, (_, i) => (
                  <li key={i}>
                    <span
                      className="border-medium-gray/35 bg-bold-gray/20 block h-7 w-7 shrink-0 rounded border"
                      aria-hidden
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-base font-bold text-white">
                {t('downloadHfmApp')}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/download"
                  className="inline-block shrink-0 rounded transition-opacity hover:opacity-90"
                  aria-label={t('appStoreBadgeAlt')}
                >
                  <AppleAppStore
                    className="block h-[39px] w-[116px] shrink-0 text-black"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/download"
                  className="inline-block shrink-0 rounded transition-opacity hover:opacity-90"
                  aria-label={t('googlePlayBadgeAlt')}
                >
                  <GooglePlayStore
                    className="block h-[39px] w-[117px] shrink-0 text-black"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="mb-4 text-base font-bold text-white">
              {t('riskWarning')}
            </h2>
            <p className="text-medium-gray text-xs leading-relaxed whitespace-pre-line">
              {t('riskWarningBody')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
